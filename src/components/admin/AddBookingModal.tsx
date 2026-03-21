import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Calendar, User, Phone, Mail, MapPin, DollarSign, Tag } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddBookingModal({ isOpen, onClose, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        tour_name: 'Jaco ATV Off-Road Adventure',
        booking_date: new Date().toISOString().split('T')[0],
        total_amount: 0,
        status: 'confirmed',
        adults: 1,
        children: 0
    });

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            if (!supabase) {
                alert('Supabase not connected. This is a demo.');
                onSuccess();
                onClose();
                return;
            }

            const { error } = await supabase
                .from('bookings')
                .insert([{
                    ...formData,
                    created_at: new Date().toISOString()
                }]);

            if (error) throw error;
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error adding booking:', err);
            alert('Error adding booking. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-dark-soft rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 dark:border-white/5 animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50 dark:bg-black/20">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <Tag className="w-5 h-5 text-primary" />
                        Add New Booking
                    </h3>
                    <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Customer Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    required
                                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white"
                                    value={formData.customer_name}
                                    onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white"
                                    value={formData.customer_email}
                                    onChange={e => setFormData({ ...formData, customer_email: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Tour Name</label>
                        <select
                            className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary"
                            value={formData.tour_name}
                            onChange={e => setFormData({ ...formData, tour_name: e.target.value })}
                        >
                            <option value="Jaco ATV Off-Road Adventure">Jaco ATV Off-Road Adventure</option>
                            <option value="Jet Ski Ocean Adventure">Jet Ski Ocean Adventure</option>
                            <option value="Side by Side Buggy Tour">Side by Side Buggy Tour</option>
                            <option value="Canopy Zipline Tour">Canopy Zipline Tour</option>
                            <option value="Surf Lessons">Surf Lessons</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                            <input
                                type="date"
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white"
                                value={formData.booking_date}
                                onChange={e => setFormData({ ...formData, booking_date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Amount ($)</label>
                            <input
                                type="number"
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white"
                                value={formData.total_amount}
                                onChange={e => setFormData({ ...formData, total_amount: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] px-4 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
