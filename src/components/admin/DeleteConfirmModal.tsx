import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../../store';
import { adminTranslations } from '../../lib/admin-translations';

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
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {$language === 'en' 
                                ? `Type "${expectedText}" to confirm:` 
                                : `Escribe "${expectedText}" para confirmar:`}
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => { setConfirmText(e.target.value); setError(''); }}
                            placeholder={$language === 'en' ? 'Type to confirm...' : 'Escribe para confirmar...'}
                            className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 outline-none transition-colors"
                            autoFocus
                        />
                        {error && (
                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                        >
                            {$language === 'en' ? 'Cancel' : 'Cancelar'}
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={confirmText.toLowerCase().trim() !== expectedText}
                            className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {$language === 'en' ? 'Delete' : 'Eliminar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
