import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = path.resolve('./public/images');
const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg', '.gif'];

interface ImageFile {
    name: string;
    path: string;      // Public URL path
    fullPath: string;   // Full relative path
    size: number;
    modified: string;
    folder: string;
}

/**
 * GET /api/media — Lists all images in /public/images recursively
 */
export const GET: APIRoute = async () => {
    try {
        const images: ImageFile[] = [];
        scanDirectory(IMAGES_DIR, '', images);

        return new Response(JSON.stringify({ images, total: images.length }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message, images: [] }), {
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

/**
 * POST /api/media — Upload an image via base64 or FormData
 */
export const POST: APIRoute = async ({ request }) => {
    try {
        const contentType = request.headers.get('content-type') || '';

        let fileName: string;
        let fileBuffer: Buffer;
        let folder = '';

        if (contentType.includes('application/json')) {
            // JSON upload with base64
            const body = await request.json();
            fileName = body.fileName || `upload-${Date.now()}.png`;
            folder = body.folder || '';
            const base64Data = body.data.replace(/^data:image\/\w+;base64,/, '');
            fileBuffer = Buffer.from(base64Data, 'base64');
        } else if (contentType.includes('multipart/form-data')) {
            // FormData upload
            const formData = await request.formData();
            const file = formData.get('file') as File;
            folder = (formData.get('folder') as string) || '';

            if (!file) {
                return new Response(JSON.stringify({ error: 'No file provided' }), {
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
        return new Response(JSON.stringify({ error: error.message }), {
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
        const body = await request.json();
        const imagePath = body.path; // e.g. "/images/activities/atv.png"

        if (!imagePath || !imagePath.startsWith('/images/')) {
            return new Response(JSON.stringify({ error: 'Invalid path' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const fullPath = path.join('./public', imagePath);

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
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
