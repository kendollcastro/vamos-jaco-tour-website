import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import { verifyAdmin } from '../../lib/auth';

const IMAGES_DIR = path.resolve('./public/images');
const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg', '.gif'];

interface ImageFile {
    name: string;
    path: string;
    fullPath: string;
    size: number;
    modified: string;
    folder: string;
}

/**
 * Validate that a path is safe and within the allowed directory.
 */
function isSafePath(basePath: string, targetPath: string): boolean {
    const resolvedBase = path.resolve(basePath);
    const resolvedTarget = path.resolve(targetPath);
    return resolvedTarget.startsWith(resolvedBase + path.sep) || resolvedTarget === resolvedBase;
}

/**
 * Sanitize a folder path to prevent directory traversal.
 */
function sanitizeFolder(folder: string): string {
    if (!folder) return '';
    // Remove any path traversal attempts
    return folder
        .replace(/\.\./g, '')
        .replace(/\\/g, '/')
        .replace(/\/+/g, '/')
        .replace(/^\/+|\/+$/g, '')
        .trim();
}

/**
 * GET /api/media — Lists all images in /public/images recursively
 */
export const GET: APIRoute = async ({ request }) => {
    try {
        const authResult = await verifyAdmin(request);
        if (!authResult.authorized) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const images: ImageFile[] = [];
        scanDirectory(IMAGES_DIR, '', images);

        return new Response(JSON.stringify({ images, total: images.length }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: 'Failed to list images', images: [] }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

/**
 * POST /api/media — Upload an image via base64 or FormData
 */
export const POST: APIRoute = async ({ request }) => {
    try {
        const authResult = await verifyAdmin(request);
        if (!authResult.authorized) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const contentType = request.headers.get('content-type') || '';

        let fileName: string;
        let fileBuffer: Buffer;
        let folder = '';

        if (contentType.includes('application/json')) {
            const body = await request.json();
            fileName = body.fileName || `upload-${Date.now()}.png`;
            folder = sanitizeFolder(body.folder || '');
            
            // Validate base64 data
            const base64Data = body.data?.replace(/^data:image\/\w+;base64,/, '');
            if (!base64Data || base64Data.length > 10 * 1024 * 1024) { // Max 10MB
                return new Response(JSON.stringify({ error: 'Invalid or too large file' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            fileBuffer = Buffer.from(base64Data, 'base64');
        } else if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file') as File;
            folder = sanitizeFolder((formData.get('folder') as string) || '');

            if (!file) {
                return new Response(JSON.stringify({ error: 'No file provided' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                return new Response(JSON.stringify({ error: 'File too large (max 10MB)' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            fileName = file.name;
            const arrayBuffer = await file.arrayBuffer();
            fileBuffer = Buffer.from(arrayBuffer);
        } else {
            return new Response(JSON.stringify({ error: 'Unsupported content type' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Sanitize filename
        fileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
        const ext = path.extname(fileName).toLowerCase();
        if (!SUPPORTED_EXTENSIONS.includes(ext)) {
            return new Response(JSON.stringify({ error: `Unsupported file type: ${ext}` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Create folder if needed
        const targetDir = folder
            ? path.join(IMAGES_DIR, folder)
            : IMAGES_DIR;

        // Validate path is safe
        if (!isSafePath(IMAGES_DIR, targetDir)) {
            return new Response(JSON.stringify({ error: 'Invalid folder path' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Avoid overwriting
        let finalName = fileName;
        let counter = 1;
        while (fs.existsSync(path.join(targetDir, finalName))) {
            const base = path.basename(fileName, ext);
            finalName = `${base}-${counter}${ext}`;
            counter++;
        }

        const filePath = path.join(targetDir, finalName);
        
        // Final path validation
        if (!isSafePath(IMAGES_DIR, filePath)) {
            return new Response(JSON.stringify({ error: 'Invalid file path' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        fs.writeFileSync(filePath, fileBuffer);

        const publicPath = folder
            ? `/images/${folder}/${finalName}`
            : `/images/${finalName}`;

        return new Response(JSON.stringify({
            success: true,
            image: {
                name: finalName,
                path: publicPath,
                size: fileBuffer.length,
            },
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: 'Upload failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

/**
 * DELETE /api/media — Delete an image
 */
export const DELETE: APIRoute = async ({ request }) => {
    try {
        const authResult = await verifyAdmin(request);
        if (!authResult.authorized) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const body = await request.json();
        const imagePath = body.path;

        if (!imagePath || !imagePath.startsWith('/images/')) {
            return new Response(JSON.stringify({ error: 'Invalid path' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const fullPath = path.resolve('./public', '.' + imagePath);

        // Validate path is within allowed directory
        if (!isSafePath(path.resolve('./public/images'), fullPath)) {
            return new Response(JSON.stringify({ error: 'Invalid path' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!fs.existsSync(fullPath)) {
            return new Response(JSON.stringify({ error: 'File not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        fs.unlinkSync(fullPath);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: 'Delete failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

function scanDirectory(dir: string, relativePath: string, results: ImageFile[]) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

        if (entry.isDirectory()) {
            scanDirectory(fullPath, relPath, results);
        } else if (SUPPORTED_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
            const stats = fs.statSync(fullPath);
            results.push({
                name: entry.name,
                path: `/images/${relPath}`,
                fullPath: relPath,
                size: stats.size,
                modified: stats.mtime.toISOString(),
                folder: relativePath || 'root',
            });
        }
    }
}
