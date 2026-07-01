import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, LayoutGrid, List, Copy, Trash2, ExternalLink, X, AlertTriangle, Check, Loader2, ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';

interface ImageFile {
    name: string;
    path: string;
    fullPath: string;
    size: number;
    modified: string;
    folder: string;
}

export default function MediaGallery() {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [imageToDelete, setImageToDelete] = useState<ImageFile | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
    const [uploadFolder, setUploadFolder] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    async function fetchImages() {
        setLoading(true);
        try {
            if (!supabase) return;
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/media', {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            const data = await res.json();
            setImages(data.images || []);
        } catch (err) {
            console.error('Error fetching images:', err);
        }
        setLoading(false);
    }

    async function handleUpload(files: FileList) {
        setUploading(true);
        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append('file', file);
            if (uploadFolder) formData.append('folder', uploadFolder);

            try {
                if (!supabase) continue;
                const { data: { session } } = await supabase.auth.getSession();
                await fetch('/api/media', { 
                    method: 'POST', 
                    headers: { 'Authorization': `Bearer ${session?.access_token}` },
                    body: formData 
                });
            } catch (err) {
                console.error('Upload error:', err);
            }
        }
        setUploading(false);
        fetchImages();
    }

    function handleDelete(img: ImageFile) {
        setImageToDelete(img);
    }

    async function confirmDelete() {
        if (!imageToDelete) return;
        setIsDeleting(true);

        try {
            if (!supabase) return;
            const { data: { session } } = await supabase.auth.getSession();
            await fetch('/api/media', {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ path: imageToDelete.path }),
            });
            if (selectedImage?.path === imageToDelete.path) {
                setSelectedImage(null);
            }
            setImageToDelete(null);
            fetchImages();
        } catch (err) {
            console.error('Delete error:', err);
        } finally {
            setIsDeleting(false);
        }
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files);
        }
    }

    function copyPath(path: string) {
        navigator.clipboard.writeText(path);
    }

    const folders = ['all', ...new Set(images.map(img => img.folder))];
    const filtered = selectedFolder === 'all'
        ? images
        : images.filter(img => img.folder === selectedFolder);

    function formatSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex items-center gap-3">
                    <Select
                        value={selectedFolder}
                        onValueChange={(v) => setSelectedFolder(v)}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {folders.map(f => (
                                <SelectItem key={f} value={f}>{f === 'all' ? 'All Folders' : `📁 ${f}`}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex border border-gray-200 dark:border-white/10 rounded-full overflow-hidden bg-white dark:bg-transparent shadow-sm">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewMode('grid')}
                            className={`rounded-none ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-gray-400 dark:text-gray-500'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewMode('list')}
                            className={`rounded-none ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-gray-400 dark:text-gray-500'}`}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>

                    <span className="text-gray-500 text-sm">{filtered.length} images</span>
                </div>

                <div className="flex items-center gap-2">
                    <Input
                        value={uploadFolder}
                        onChange={(e) => setUploadFolder(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                        placeholder="folder (optional)"
                        className="w-36 rounded-full"
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Upload className="w-4 h-4" />
                        )}
                        Upload
                    </Button>
                    <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => e.target.files && handleUpload(e.target.files)}
                    />
                </div>
            </div>

            <div
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={handleDrop}
                className="min-h-[400px]"
            >
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-square bg-gray-100 dark:bg-dark-soft rounded-[20px] border border-border/40 animate-pulse" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-dark-soft rounded-[20px] border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center py-20 px-6 text-center transition-colors">
                        <ImageIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
                        <p className="text-gray-900 dark:text-gray-400 font-medium mb-1">No images found</p>
                        <p className="text-gray-500 dark:text-gray-600 text-sm mb-4">Drop images here or click Upload</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {filtered.map((img) => (
                            <div
                                key={img.path}
                                onClick={() => setSelectedImage(img)}
                                className={`group relative aspect-square rounded-[16px] overflow-hidden border cursor-pointer bg-gray-50 dark:bg-dark-soft transition-all ${selectedImage?.path === img.path
                                    ? 'border-primary ring-2 ring-primary/30'
                                    : 'border-border/40 hover:border-gray-300 dark:hover:border-white/15'
                                    }`}
                            >
                                <img
                                    src={img.path}
                                    alt={img.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/1A1816/666?text=Error'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                                        <p className="text-white text-[11px] font-medium truncate">{img.name}</p>
                                        <p className="text-gray-400 text-[10px]">{formatSize(img.size)}</p>
                                    </div>
                                </div>
                                {selectedImage?.path === img.path && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                        <Check className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-dark-soft rounded-3xl border border-border/40 overflow-hidden shadow-sm transition-colors">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-border/40 bg-muted/30">
                                    <TableHead className="px-4 py-2.5 text-gray-500 dark:text-gray-400 font-medium text-xs">Preview</TableHead>
                                    <TableHead className="px-4 py-2.5 text-gray-500 dark:text-gray-400 font-medium text-xs">Name</TableHead>
                                    <TableHead className="px-4 py-2.5 text-gray-500 dark:text-gray-400 font-medium text-xs hidden md:table-cell">Folder</TableHead>
                                    <TableHead className="px-4 py-2.5 text-gray-500 dark:text-gray-400 font-medium text-xs">Size</TableHead>
                                    <TableHead className="px-4 py-2.5 text-gray-500 dark:text-gray-400 font-medium text-xs">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((img) => (
                                    <TableRow
                                        key={img.path}
                                        onClick={() => setSelectedImage(img)}
                                        className={`cursor-pointer transition-colors ${selectedImage?.path === img.path ? 'bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'}`}
                                    >
                                        <TableCell className="px-4 py-2.5">
                                            <img src={img.path} alt={img.name} loading="lazy" decoding="async" className="w-10 h-10 rounded-lg object-cover" />
                                        </TableCell>
                                        <TableCell className="px-4 py-2.5 text-gray-900 dark:text-white text-sm">{img.name}</TableCell>
                                        <TableCell className="px-4 py-2.5 text-gray-500 dark:text-gray-400 text-xs hidden md:table-cell">{img.folder}</TableCell>
                                        <TableCell className="px-4 py-2.5 text-gray-600 dark:text-gray-400 text-xs">{formatSize(img.size)}</TableCell>
                                        <TableCell className="px-4 py-2.5">
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => { e.stopPropagation(); copyPath(img.path); }}
                                                    className="text-gray-400 dark:text-gray-500 hover:text-brand-teal hover:bg-brand-teal/10"
                                                >
                                                    <Copy className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(img); }}
                                                    className="text-gray-400 dark:text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setSelectedImage(null)}
                />
            )}

            <div
                className={`fixed inset-y-0 right-0 w-full md:w-80 bg-white dark:bg-dark-soft shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-white/10 flex flex-col ${selectedImage ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {selectedImage && (
                    <>
                        <div className="flex items-center justify-between p-4 border-b border-border/40">
                            <h3 className="text-gray-900 dark:text-white font-bold text-sm">Asset Details</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20">
                                <img
                                    src={selectedImage!.path}
                                    alt={selectedImage!.name}
                                    className="w-full object-contain"
                                    style={{ maxHeight: '200px' }}
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <span className="text-primary font-bold text-[10px] uppercase tracking-wider block mb-1">File Name</span>
                                    <span className="text-gray-900 dark:text-white font-medium text-sm break-all">{selectedImage!.name}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-primary font-bold text-[10px] uppercase tracking-wider block mb-1">Size</span>
                                        <span className="text-gray-900 dark:text-white font-medium text-sm">{formatSize(selectedImage!.size)}</span>
                                    </div>
                                    <div>
                                        <span className="text-primary font-bold text-[10px] uppercase tracking-wider block mb-1">Folder</span>
                                        <span className="text-gray-900 dark:text-white font-medium text-sm">{selectedImage!.folder}</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-primary font-bold text-[10px] uppercase tracking-wider block mb-1">Upload Date</span>
                                    <span className="text-gray-900 dark:text-white font-medium text-sm">{new Date(selectedImage!.modified).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="pt-4 space-y-2 border-t border-border/40">
                                <Button
                                    variant="outline"
                                    onClick={() => copyPath(selectedImage!.path)}
                                    className="w-full"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy Image Path
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => window.open(selectedImage!.path, '_blank')}
                                    className="w-full border-brand-teal/30 text-brand-teal hover:bg-brand-teal/10"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    View Full Res
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => handleDelete(selectedImage!)}
                                    className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10 mt-4"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Remove from Gallery
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {imageToDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => !isDeleting && setImageToDelete(null)}
                    />

                    <div className="bg-white dark:bg-dark-soft rounded-3xl p-6 md:p-8 max-w-sm w-full relative z-10 shadow-2xl border border-gray-100 dark:border-white/10 text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Eliminar Imagen</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                            ¿Estás seguro de que deseas eliminar permanentemente la imagen <span className="font-semibold text-gray-700 dark:text-gray-300">&quot;{imageToDelete.name}&quot;</span>? Esta acción no se puede deshacer.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => setImageToDelete(null)}
                                disabled={isDeleting}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Eliminando...
                                    </>
                                ) : (
                                    'Sí, eliminar'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
