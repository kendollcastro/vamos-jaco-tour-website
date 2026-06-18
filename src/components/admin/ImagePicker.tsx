import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';
import { X, Upload, Check, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageFile {
    name: string;
    path: string;
    fullPath: string;
    size: number;
    folder: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (imagePath: string) => void;
    multiple?: boolean;
    onSelectMultiple?: (paths: string[]) => void;
}

export default function ImagePicker({ isOpen, onClose, onSelect, multiple = false, onSelectMultiple }: Props) {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [folder, setFolder] = useState('all');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            fetchImages();
            setSelectedPaths([]);
        }
    }, [isOpen]);

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
            formData.append('folder', 'activities');
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

    function toggleSelect(path: string) {
        if (multiple) {
            setSelectedPaths(prev =>
                prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
            );
        } else {
            setSelectedPaths([path]);
        }
    }

    function handleConfirm() {
        if (multiple && onSelectMultiple) {
            onSelectMultiple(selectedPaths);
        } else if (selectedPaths.length > 0) {
            onSelect(selectedPaths[0]);
        }
        onClose();
    }

    if (!isOpen) return null;

    const folders = ['all', ...new Set(images.map(img => img.folder))];
    const filtered = folder === 'all' ? images : images.filter(img => img.folder === folder);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white dark:bg-dark-soft border border-gray-200 dark:border-white/10 rounded-[20px] w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl transition-colors duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-teal/10 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-brand-teal" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="text-gray-900 dark:text-white font-bold text-sm">
                                {multiple ? 'Select Images' : 'Select Image'}
                            </h2>
                            <p className="text-gray-500 text-[11px]">
                                {multiple ? 'Click to select multiple' : 'Click an image to select it'}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-white/5 transition-colors">
                    <Select
                        value={folder}
                        onValueChange={(value) => setFolder(value)}
                    >
                        <SelectTrigger className="bg-gray-50 dark:bg-dark border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 h-auto text-xs text-gray-900 dark:text-white">
                            <SelectValue placeholder="All Folders" />
                        </SelectTrigger>
                        <SelectContent>
                            {folders.map(f => (
                                <SelectItem key={f} value={f}>{f === 'all' ? 'All Folders' : `📁 ${f}`}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="ghost"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-white/5 dark:border-white/10 dark:text-gray-300 text-xs font-medium rounded-lg dark:hover:bg-white/10 h-auto disabled:opacity-50"
                    >
                        {uploading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Upload className="w-3.5 h-3.5" />
                        )}
                        Upload New
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

                {/* Grid */}
                <div className="flex-1 overflow-auto p-4">
                    {loading ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="aspect-square bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <ImageIcon className="w-12 h-12 text-gray-600 mb-3" strokeWidth={1} />
                            <p className="text-gray-500 text-sm">No images available</p>
                            <p className="text-gray-600 text-xs">Upload some images first</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {filtered.map((img) => {
                                const isSelected = selectedPaths.includes(img.path);
                                return (
                                    <div
                                        key={img.path}
                                        onClick={() => toggleSelect(img.path)}
                                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${isSelected
                                            ? 'border-primary ring-1 ring-primary/30 scale-[0.97]'
                                            : 'border-transparent hover:border-white/20'
                                            }`}
                                    >
                                        <img
                                            src={img.path}
                                            alt={img.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        {isSelected && (
                                            <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow">
                                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                                            <p className="text-white text-[9px] truncate">{img.name}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-white/5 transition-colors">
                    <span className="text-gray-500 text-xs">
                        {selectedPaths.length > 0
                            ? `${selectedPaths.length} selected`
                            : `${filtered.length} images available`
                        }
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 text-sm dark:hover:text-white h-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            onClick={handleConfirm}
                            disabled={selectedPaths.length === 0}
                            className="px-5 py-2 rounded-xl text-sm font-semibold h-auto disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {multiple
                                ? `Add ${selectedPaths.length} Image${selectedPaths.length !== 1 ? 's' : ''}`
                                : 'Select Image'
                            }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
