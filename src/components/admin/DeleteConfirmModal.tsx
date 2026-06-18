import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../../store';
import { adminTranslations } from '../../lib/admin-translations';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Trash2, AlertCircle } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    bookingInfo: {
        customerName: string;
        tourName: string;
    };
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, bookingInfo }: DeleteConfirmModalProps) {
    const $language = useStore(language);
    const t = adminTranslations[$language];
    const [confirmText, setConfirmText] = useState('');
    const [error, setError] = useState('');

    const expectedText = $language === 'en' 
        ? `delete ${bookingInfo.customerName.toLowerCase()}`
        : `eliminar ${bookingInfo.customerName.toLowerCase()}`;

    const handleConfirm = () => {
        if (confirmText.toLowerCase().trim() === expectedText) {
            onConfirm();
            setConfirmText('');
            setError('');
        } else {
            setError($language === 'en' 
                ? 'Text does not match. Type the exact phrase to confirm.' 
                : 'El texto no coincide. Escribe la frase exacta para confirmar.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                            <Trash2 className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {$language === 'en' ? 'Delete Booking?' : '¿Eliminar Reserva?'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {$language === 'en' ? 'This action cannot be undone' : 'Esta acción no se puede deshacer'}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 mb-4">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-gray-400 text-xs uppercase tracking-wider">{$language === 'en' ? 'Customer' : 'Cliente'}</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{bookingInfo.customerName}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs uppercase tracking-wider">Tour</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{bookingInfo.tourName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {$language === 'en' 
                                ? `Type "${expectedText}" to confirm:` 
                                : `Escribe "${expectedText}" para confirmar:`}
                        </Label>
                        <Input
                            type="text"
                            value={confirmText}
                            onChange={(e) => { setConfirmText(e.target.value); setError(''); }}
                            placeholder={$language === 'en' ? 'Type to confirm...' : 'Escribe para confirmar...'}
                            className="w-full bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 h-auto focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                            autoFocus
                        />
                        {error && (
                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 h-auto"
                        >
                            {$language === 'en' ? 'Cancel' : 'Cancelar'}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirm}
                            disabled={confirmText.toLowerCase().trim() !== expectedText}
                            className="flex-1 px-4 py-3 font-bold rounded-xl h-auto disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            {$language === 'en' ? 'Delete' : 'Eliminar'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
