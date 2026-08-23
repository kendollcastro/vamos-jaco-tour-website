import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { fetchBlockedRanges, type BlockedRange } from '../../lib/blocked-dates';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { CalendarX, Plus, Trash2, AlertCircle } from 'lucide-react';

interface BlockedDatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onChanged?: () => void;
}

export default function BlockedDatesModal({ isOpen, onClose, onChanged }: BlockedDatesModalProps) {
    const [ranges, setRanges] = useState<BlockedRange[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        setRanges(await fetchBlockedRanges(supabase));
        setLoading(false);
    }, []);

    useEffect(() => {
        if (isOpen) load();
    }, [isOpen, load]);

    if (!isOpen) return null;

    const fmt = (iso: string) =>
        new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

    const handleSave = async () => {
        setError('');
        if (!startDate || !endDate) {
            setError('Selecciona fecha de inicio y fin.');
            return;
        }
        if (endDate < startDate) {
            setError('La fecha final debe ser igual o posterior a la inicial.');
            return;
        }
        setSaving(true);
        const { error: insertError } = await supabase!
            .from('blocked_dates')
            .insert([{ start_date: startDate, end_date: endDate, reason: reason.trim() }]);
        setSaving(false);
        if (insertError) {
            setError(insertError.message.includes('row-level')
                ? 'Sin permisos. Inicia sesión como administrador.'
                : `Error: ${insertError.message}`);
            return;
        }
        setStartDate(''); setEndDate(''); setReason('');
        await load();
        onChanged?.();
    };

    const handleDelete = async (id: string) => {
        setError('');
        const { error: deleteError } = await supabase!
            .from('blocked_dates')
            .delete()
            .eq('id', id);
        if (deleteError) {
            setError(deleteError.message.includes('row-level')
                ? 'Sin permisos. Inicia sesión como administrador.'
                : `Error: ${deleteError.message}`);
            return;
        }
        await load();
        onChanged?.();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
                <div className="p-6 pb-4 border-b border-gray-200/50 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                            <CalendarX className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Fechas bloqueadas</h3>
                            <p className="text-xs text-gray-500">Días cerrados: el calendario público no permite reservarlos.</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 pt-4 space-y-4 overflow-y-auto">
                    {/* Existing ranges */}
                    <div className="space-y-2">
                        {loading && <p className="text-sm text-gray-400">Cargando...</p>}
                        {!loading && ranges.length === 0 && (
                            <p className="text-sm text-gray-400">No hay fechas bloqueadas.</p>
                        )}
                        {ranges.map(r => {
                            const isPast = r.end_date < new Date().toISOString().split('T')[0];
                            return (
                                <div
                                    key={r.id}
                                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                                        isPast
                                            ? 'border-gray-200/50 dark:border-white/5 opacity-50'
                                            : 'border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5'
                                    }`}
                                >
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                            {fmt(r.start_date)} → {fmt(r.end_date)}
                                        </p>
                                        {r.reason && <p className="text-xs text-gray-500">{r.reason}</p>}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(r.id)}
                                        className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Add new range */}
                    <div className="rounded-xl border border-gray-200/50 dark:border-white/10 p-4 space-y-3">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bloquear nuevas fechas</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Desde</label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => { setStartDate(e.target.value); setError(''); }}
                                    className="w-full bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 h-auto"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Hasta</label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => { setEndDate(e.target.value); setError(''); }}
                                    className="w-full bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 h-auto"
                                />
                            </div>
                        </div>
                        <Input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Motivo (ej. Vacaciones)"
                            className="w-full bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 h-auto"
                        />
                        {error && (
                            <p className="text-red-500 text-xs flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {error}
                            </p>
                        )}
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl h-auto gap-2 disabled:opacity-50"
                        >
                            <Plus className="w-4 h-4" />
                            {saving ? 'Guardando...' : 'Bloquear fechas'}
                        </Button>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200/50 dark:border-white/5">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 h-auto"
                    >
                        Cerrar
                    </Button>
                </div>
            </div>
        </div>
    );
}
