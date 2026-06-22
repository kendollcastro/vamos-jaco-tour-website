import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, User, Mail, Tag } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    prefillDate?: string;
}

export default function AddBookingModal({ isOpen, onClose, onSuccess, prefillDate }: Props) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        tour_name: 'Jaco ATV Off-Road Adventure',
        booking_date: prefillDate || new Date().toISOString().split('T')[0],
        total_amount: 0,
        status: 'confirmed',
        adults: 1,
        children: 0,
        duration: ''
    });

    // Update form date when prefillDate changes
    React.useEffect(() => {
        if (prefillDate) {
            setFormData(prev => ({ ...prev, booking_date: prefillDate }));
        }
    }, [prefillDate]);

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
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-500 uppercase">Customer Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    required
                                    className="w-full bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 h-auto"
                                    value={formData.customer_name}
                                    onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-500 uppercase">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="email"
                                    className="w-full bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 h-auto"
                                    value={formData.customer_email}
                                    onChange={e => setFormData({ ...formData, customer_email: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Tour Name</Label>
                        <Select
                            value={formData.tour_name}
                            onValueChange={value => setFormData({ ...formData, tour_name: value })}
                        >
                            <SelectTrigger className="w-full bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 h-auto text-sm">
                                <SelectValue placeholder="Select tour" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Jaco ATV Off-Road Adventure">Jaco ATV Off-Road Adventure</SelectItem>
                                <SelectItem value="Jet Ski Ocean Adventure">Jet Ski Ocean Adventure</SelectItem>
                                <SelectItem value="Side by Side Buggy Tour">Side by Side Buggy Tour</SelectItem>
                                <SelectItem value="Canopy Zipline Tour">Canopy Zipline Tour</SelectItem>
                                <SelectItem value="Surf Lessons">Surf Lessons</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Duration</Label>
                        <Input
                            className="w-full bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 h-auto"
                            value={formData.duration}
                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                            placeholder="e.g. 2 Hours"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-500 uppercase">Date</Label>
                            <Input
                                type="date"
                                className="w-full bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 h-auto"
                                value={formData.booking_date}
                                onChange={e => setFormData({ ...formData, booking_date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-500 uppercase">Amount ($)</Label>
                            <Input
                                type="number"
                                className="w-full bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 h-auto"
                                value={formData.total_amount}
                                onChange={e => setFormData({ ...formData, total_amount: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl text-sm font-bold h-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 h-auto disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Confirm Booking'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
