import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../../store';
import { adminTranslations } from '../../lib/admin-translations';
import { Button } from '../ui/button';
import { Trash2, AlertCircle, X } from 'lucide-react';

interface BookingItem {
    id: string;
    customerName: string;
    tourName: string;
}

interface BulkDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (ids: string[]) => void;
    bookings: BookingItem[];
}

export default function BulkDeleteModal({ isOpen, onClose, onConfirm, bookings }: BulkDeleteModalProps) {
    const $language = useStore(language);
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    const lang = mounted ? $language : 'en';

    if (!isOpen || bookings.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                            <Trash2 className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {lang === 'en' ? `Delete ${bookings.length} Bookings?` : `¿Eliminar ${bookings.length} Reservas?`}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {lang === 'en' ? 'This action cannot be undone' : 'Esta acción no se puede deshacer'}
                            </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-lg shrink-0">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="bg-muted/30 rounded-xl max-h-48 overflow-y-auto mb-6 divide-y divide-border/60">
                        {bookings.map((b) => (
                            <div key={b.id} className="flex items-center justify-between px-4 py-3">
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{b.customerName}</p>
                                    <p className="text-xs text-gray-500 truncate">{b.tourName}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700 dark:text-red-400">
                            {lang === 'en'
                                ? `This will permanently delete ${bookings.length} booking(s) and their audit logs.`
                                : `Esto eliminará permanentemente ${bookings.length} reserva(s) y sus registros de auditoría.`}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 h-auto"
                        >
                            {lang === 'en' ? 'Cancel' : 'Cancelar'}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => onConfirm(bookings.map(b => b.id))}
                            className="flex-1 px-4 py-3 font-bold rounded-xl h-auto gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            {lang === 'en' ? `Delete All (${bookings.length})` : `Eliminar Todo (${bookings.length})`}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}