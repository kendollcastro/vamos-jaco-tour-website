import { useState, useEffect, useRef } from 'react';

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
            const res = await fetch('/api/media');
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
                await fetch('/api/media', { method: 'POST', body: formData });
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
                            <svg className="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
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
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-white/5 transition-colors">
                    <select
                        value={folder}
                        onChange={(e) => setFolder(e.target.value)}
                        className="bg-gray-50 dark:bg-dark border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:border-primary outline-none transition-colors"
                    >
                        {folders.map(f => (
                            <option key={f} value={f}>{f === 'all' ? 'All Folders' : `📁 ${f}`}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-white/5 dark:border-white/10 dark:text-gray-300 text-xs font-medium rounded-lg dark:hover:bg-white/10 transition disabled:opacity-50"
                    >
                        {uploading ? (
                            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        )}
                        Upload New
                    </button>
                    <input
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
                            <svg className="w-12 h-12 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
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
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
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
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 text-sm dark:hover:text-white transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={selectedPaths.length === 0}
                            className="px-5 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {multiple
                                ? `Add ${selectedPaths.length} Image${selectedPaths.length !== 1 ? 's' : ''}`
                                : 'Select Image'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
