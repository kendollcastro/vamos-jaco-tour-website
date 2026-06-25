import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { logAudit } from '../../lib/audit';
import AuditInfo from './AuditInfo';
import { useStore } from '@nanostores/react';
import { language } from '../../store';
import { adminTranslations } from '../../lib/admin-translations';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import {
    Plus,
    Search,
    RefreshCw,
    Download,
    Pencil,
    Trash2,
    X,
    PiggyBank,
    DollarSign,
    Landmark,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    User,
} from 'lucide-react';

interface Commission {
    id: string;
    date: string;
    tour_name: string;
    customer_name: string;
    time: string;
    machines: number;
    pax: number;
    discount: number;
    price: number;
    guide_name: string;
    commission_10: number;
    provider_name: string;
    commission_20: number;
    tax: number;
    payment_method: string;
    location: string;
    created_at: string;
}

const DEMO_COMMISSIONS: Commission[] = [
    { id: '1', date: new Date().toISOString().split('T')[0], tour_name: 'ATV', customer_name: 'Sarah Johnson', time: '09:00', machines: 2, pax: 2, discount: 0, price: 180, guide_name: 'Carlos R.', commission_10: 18, provider_name: 'ATV Rentals CR', commission_20: 36, tax: 27.14, payment_method: 'Cash', location: 'Centro', created_at: new Date().toISOString() },
    { id: '2', date: new Date().toISOString().split('T')[0], tour_name: 'Jetski', customer_name: 'Mike Chen', time: '11:00', machines: 2, pax: 2, discount: 10, price: 230, guide_name: 'Andrea M.', commission_10: 23, provider_name: 'Jet Ski Jacó', commission_20: 46, tax: 34.56, payment_method: 'Card', location: 'Centro', created_at: new Date().toISOString() },
    { id: '3', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], tour_name: 'Mulas', customer_name: 'Ana García', time: '14:00', machines: 2, pax: 4, discount: 0, price: 600, guide_name: 'Carlos R.', commission_10: 60, provider_name: 'Buggy Tours CR', commission_20: 120, tax: 90.72, payment_method: 'Transfer', location: 'Madrigales', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: '4', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], tour_name: 'Surf', customer_name: 'James Wilson', time: '08:00', machines: 1, pax: 1, discount: 0, price: 70, guide_name: 'Sofia L.', commission_10: 7, provider_name: '', commission_20: 0, tax: 10.58, payment_method: 'Cash', location: 'Centro', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '5', date: new Date(Date.now() - 172800000).toISOString().split('T')[0], tour_name: 'Flyboard', customer_name: 'Laura Rodríguez', time: '15:00', machines: 2, pax: 2, discount: 0, price: 160, guide_name: 'Andrea M.', commission_10: 16, provider_name: 'Flyboard CR', commission_20: 32, tax: 24.19, payment_method: 'Card', location: 'Madrigales', created_at: new Date(Date.now() - 172800000).toISOString() },
    { id: '6', date: new Date().toISOString().split('T')[0], tour_name: 'Slingshot', customer_name: 'Carlos Méndez', time: '10:00', machines: 1, pax: 1, discount: 15, price: 335, guide_name: 'Carlos R.', commission_10: 33.50, provider_name: 'Slingshot Jacó', commission_20: 67, tax: 50.56, payment_method: 'Cash', location: 'Centro', created_at: new Date(Date.now() - 7200000).toISOString() },
];

const LOCATION_OPTIONS = ['', 'Centro', 'Madrigales'];
const PAYMENT_OPTIONS = ['Cash', 'Card', 'Transfer', 'Synapay', 'Tilopay'];

const TOUR_ICONS: Record<string, string> = {
    'ATV': '\u{1F3CE}',
    'Jetski': '\u{1F3C4}',
    'Mulas': '\u{1F98F}',
    'Surf': '\u{1F3C4}',
    'Flyboard': '\u{1F6F9}',
    'Slingshot': '\u{1F6B2}',
    'Rainforest': '\u{1F333}',
};

function getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
    'from-primary/80 to-primary',
    'from-brand-teal/80 to-brand-teal',
    'from-brand-orange/80 to-brand-orange',
    'from-brand-yellow/80 to-brand-yellow',
    'from-purple-500/80 to-purple-700',
];

function getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function CommissionsTable({ onToast }: { onToast?: (message: string) => void }) {
    const $language = useStore(language);

    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    const lang = mounted ? $language : 'en';

    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [guideFilter, setGuideFilter] = useState('__all__');
    const [locationFilter, setLocationFilter] = useState('__all__');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCommission, setEditingCommission] = useState<Commission | null>(null);
    const [originalCommission, setOriginalCommission] = useState<Partial<Record<keyof Commission, any>> | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Commission | null>(null);

    const [formDate, setFormDate] = useState('');
    const [formTour, setFormTour] = useState('');
    const [formCustomer, setFormCustomer] = useState('');
    const [formTime, setFormTime] = useState('');
    const [formMachines, setFormMachines] = useState('');
    const [formPax, setFormPax] = useState('');
    const [formDiscount, setFormDiscount] = useState('');
    const [formPrice, setFormPrice] = useState('');
    const [formGuide, setFormGuide] = useState('');
    const [formCommission10, setFormCommission10] = useState('');
    const [formProvider, setFormProvider] = useState('');
    const [formCommission20, setFormCommission20] = useState('');
    const [formTax, setFormTax] = useState('');
    const [formLocation, setFormLocation] = useState('');
    const [formPaymentMethod, setFormPaymentMethod] = useState('Cash');
    const [formSaving, setFormSaving] = useState(false);
    const [formError, setFormError] = useState('');

    const isDemo = !supabase;

    const [guides, setGuides] = useState<{ id: string; name: string; image_url?: string }[]>([]);
    const guideImageMap = Object.fromEntries(
        guides.filter(g => g.image_url).map(g => [g.name, g.image_url])
    );
    const [tourOptions, setTourOptions] = useState<{ id: string; name_en: string; name_es: string }[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchCommissions();
        fetchGuides();
        fetchToursList();
    }, []);

    async function fetchCommissions() {
        setLoading(true);
        if (!supabase) {
            setCommissions(DEMO_COMMISSIONS);
            setLoading(false);
            return;
        }
        const { data, error } = await supabase
            .from('commissions')
            .select('*')
            .order('date', { ascending: false });
        if (error) console.error('Error fetching commissions:', error);
        setCommissions((data as Commission[]) || []);
        setLoading(false);
    }

    async function fetchGuides() {
        if (!supabase) {
            setGuides([
                { id: '1', name: 'Carlos R.' },
                { id: '2', name: 'Andrea M.' },
                { id: '3', name: 'Sofia L.' },
            ]);
            return;
        }
        const { data } = await supabase
            .from('team_members')
            .select('id, name, image_url')
            .eq('is_active', true)
            .order('name');
        if (data) setGuides(data as { id: string; name: string; image_url?: string }[]);
    }

    async function fetchToursList() {
        if (!supabase) {
            setTourOptions([
                { id: '1', name_en: 'ATV', name_es: 'ATV' },
                { id: '2', name_en: 'Jetski', name_es: 'Jetski' },
                { id: '3', name_en: 'Mulas', name_es: 'Mulas' },
                { id: '4', name_en: 'Surf', name_es: 'Surf' },
                { id: '5', name_en: 'Flyboard', name_es: 'Flyboard' },
                { id: '6', name_en: 'Slingshot', name_es: 'Slingshot' },
            ]);
            return;
        }
        const { data } = await supabase
            .from('tours')
            .select('id, name_en, name_es')
            .eq('is_active', true)
            .order('name_en');
        if (data) setTourOptions(data as { id: string; name_en: string; name_es: string }[]);
    }

    async function handleRefresh() {
        setRefreshing(true);
        await fetchCommissions();
        setRefreshing(false);
    }

    function openNewModal() {
        setEditingCommission(null);
        setFormDate(new Date().toISOString().split('T')[0]);
        setFormTour('');
        setFormCustomer('');
        setFormTime('');
        setFormMachines('');
        setFormPax('');
        setFormDiscount('');
        setFormPrice('');
        setFormGuide('');
        setFormCommission10('');
        setFormProvider('');
        setFormCommission20('');
        setFormTax('');
        setFormLocation('');
        setFormPaymentMethod('Cash');
        setFormError('');
        setDialogOpen(true);
    }

    function openEditModal(c: Commission) {
        setEditingCommission(c);
        setOriginalCommission({ ...c });
        setFormDate(c.date);
        setFormTour(c.tour_name);
        setFormCustomer(c.customer_name);
        setFormTime(c.time);
        setFormMachines(c.machines.toString());
        setFormPax(c.pax.toString());
        setFormDiscount(c.discount.toString());
        setFormPrice(c.price.toString());
        setFormGuide(c.guide_name);
        setFormCommission10(c.commission_10.toString());
        setFormProvider(c.provider_name);
        setFormCommission20(c.commission_20.toString());
        setFormTax(c.tax.toString());
        setFormLocation(c.location || '');
        setFormPaymentMethod(c.payment_method);
        setFormError('');
        setDialogOpen(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!formTour || !formCustomer || !formDate) {
            setFormError(lang === 'en' ? 'Tour, customer and date are required' : 'Tour, cliente y fecha son obligatorios');
            return;
        }
        setFormSaving(true);

        const machines = parseInt(formMachines) || 0;
        const pax = parseInt(formPax) || 1;
        const discount = parseFloat(formDiscount) || 0;
        const price = parseFloat(formPrice) || 0;

        const payload: Record<string, any> = {
            date: formDate,
            tour_name: formTour,
            customer_name: formCustomer,
            time: formTime,
            machines,
            pax,
            discount,
            price,
            guide_name: formGuide,
            commission_10: parseFloat(formCommission10) || 0,
            provider_name: formProvider,
            commission_20: parseFloat(formCommission20) || 0,
            tax: parseFloat(formTax) || 0,
            payment_method: formPaymentMethod,
        };
        if (formLocation) payload.location = formLocation;

        if (isDemo) {
            if (editingCommission) {
                setCommissions(prev => prev.map(c => c.id === editingCommission.id ? { ...c, ...payload } : c));
            } else {
                const newEntry: Commission = {
                    id: Date.now().toString(),
                    ...payload,
                    created_at: new Date().toISOString(),
                } as Commission;
                setCommissions(prev => [newEntry, ...prev]);
            }
            onToast?.(lang === 'en' ? 'Commission saved' : 'Comisión guardada');
            setFormSaving(false);
            setDialogOpen(false);
            return;
        }

        if (!supabase) return;
        let error;
        let newId: string | undefined;
        if (editingCommission) {
            ({ error } = await supabase.from('commissions').update(payload).eq('id', editingCommission.id));
        } else {
            const { data, error: insertError } = await supabase.from('commissions').insert([payload]).select();
            error = insertError;
            newId = data?.[0]?.id;
        }
        if (error) {
            setFormError(error.message);
        } else {
            if (editingCommission) {
                const changes: string[] = [];
                const changesJson: Record<string, { old: any; new: any }> = {};
                const orig = originalCommission as any;
                const fieldLabels: Record<string, string> = {
                    location: lang === 'en' ? 'Location' : 'Ubicación',
                    machines: '#M',
                    pax: lang === 'en' ? 'Pax' : 'Pax',
                    discount: lang === 'en' ? 'Discount' : 'Descuento',
                    price: lang === 'en' ? 'Price' : 'Precio',
                    guide_name: lang === 'en' ? 'Guide' : 'Guía',
                    commission_10: '10%',
                    provider_name: lang === 'en' ? 'Provider' : 'Proveedor',
                    commission_20: '20%',
                    tax: lang === 'en' ? 'Tax' : 'Impuesto',
                    payment_method: lang === 'en' ? 'Payment' : 'Pago',
                    date: lang === 'en' ? 'Date' : 'Fecha',
                    tour_name: lang === 'en' ? 'Tour' : 'Tour',
                    customer_name: lang === 'en' ? 'Customer' : 'Cliente',
                    time: lang === 'en' ? 'Time' : 'Hora',
                };
                for (const key of Object.keys(payload)) {
                    const oldVal = orig?.[key];
                    const newVal = payload[key];
                    if (String(oldVal) !== String(newVal)) {
                        const label = fieldLabels[key] || key;
                        changes.push(`${label}: ${oldVal ?? '\u2014'} \u2192 ${newVal ?? '\u2014'}`);
                        changesJson[key] = { old: oldVal, new: newVal };
                    }
                }
                await logAudit({
                    action: 'update',
                    table_name: 'commissions',
                    record_id: editingCommission.id,
                    summary: changes.length > 0 ? changes.join('; ') : `Updated commission: ${formTour} - ${formCustomer}`,
                    changes: changesJson,
                });
            } else if (newId) {
                await logAudit({
                    action: 'create',
                    table_name: 'commissions',
                    record_id: newId,
                    summary: `Created commission: ${formTour} - ${formCustomer}`
                });
            }
            onToast?.(lang === 'en' ? 'Commission saved' : 'Comisión guardada');
            setDialogOpen(false);
            fetchCommissions();
        }
        setFormSaving(false);
    }

    function handleDeleteClick(c: Commission) {
        setDeleteTarget(c);
    }

    async function confirmDelete() {
        if (!deleteTarget) return;
        const id = deleteTarget.id;
        setDeleteTarget(null);
        if (isDemo) {
            setCommissions(prev => prev.filter(c => c.id !== id));
            onToast?.(lang === 'en' ? 'Commission deleted' : 'Comisión eliminada');
            return;
        }
        if (!supabase) return;
        const { error } = await supabase.from('commissions').delete().eq('id', id);
        if (!error) {
            await logAudit({
                action: 'delete',
                table_name: 'commissions',
                record_id: id,
                summary: `Deleted commission: ${deleteTarget.tour_name} - ${deleteTarget.customer_name}`
            });
            fetchCommissions();
            onToast?.(lang === 'en' ? 'Commission deleted' : 'Comisión eliminada');
        }
    }

    function exportToCSV() {
        const headers = [
            lang === 'en' ? 'Date' : 'Fecha',
            lang === 'en' ? 'Tour' : 'Tour',
            lang === 'en' ? 'Customer' : 'Cliente',
            lang === 'en' ? 'Time' : 'Hora',
            '# M',
            '# PAX',
            lang === 'en' ? 'Location' : 'Ubicación',
            lang === 'en' ? 'Discount' : 'Descuento',
            lang === 'en' ? 'Price' : 'Precio',
            lang === 'en' ? 'Guide' : 'Guía',
            '10%',
            lang === 'en' ? 'Provider' : 'Proveedor',
            '20%',
            'IVA',
            lang === 'en' ? 'Payment' : 'Pago',
        ];
        const rows = filtered.map(c => [
            c.date, c.tour_name, c.customer_name, c.time, c.location,
            c.machines, c.pax, c.discount, c.price, c.guide_name, c.commission_10,
            c.provider_name, c.commission_20, c.tax, c.payment_method,
        ]);
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `commissions_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        onToast?.(lang === 'en' ? `Exported ${filtered.length} commissions` : `Exportadas ${filtered.length} comisiones`);
    }

    const filtered = commissions.filter(c => {
        const matchesSearch = !searchQuery ||
            c.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.tour_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.guide_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDateFrom = !dateFrom || new Date(c.date) >= new Date(dateFrom);
        const matchesDateTo = !dateTo || new Date(c.date) <= new Date(dateTo);
        const matchesGuide = guideFilter === '__all__' || c.guide_name === guideFilter;
        const matchesLocation = locationFilter === '__all__' || c.location === locationFilter;
        return matchesSearch && matchesDateFrom && matchesDateTo && matchesGuide && matchesLocation;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

    const totalPrice = filtered.reduce((sum, c) => sum + c.price, 0);
    const totalCommission10 = filtered.reduce((sum, c) => sum + c.commission_10, 0);
    const totalCommission20 = filtered.reduce((sum, c) => sum + c.commission_20, 0);

    const guideStats = Object.entries(
        commissions.reduce<Record<string, { count: number; revenue: number; commission: number }>>((acc, c) => {
            if (!c.guide_name) return acc;
            if (!acc[c.guide_name]) acc[c.guide_name] = { count: 0, revenue: 0, commission: 0 };
            acc[c.guide_name].count++;
            acc[c.guide_name].revenue += c.price;
            acc[c.guide_name].commission += c.commission_10;
            return acc;
        }, {})
    ).sort((a, b) => b[1].revenue - a[1].revenue);

    const t = adminTranslations[$language];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">
                        {lang === 'en' ? 'Control Dashboard' : 'Dashboard de Control'}
                    </p>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">
                        {lang === 'en' ? 'Guide Commissions & Payments' : 'Comisiones de guías y pagos'}
                    </h2>
                </div>
                <Button onClick={openNewModal} className="gap-2 shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4" />
                    {lang === 'en' ? 'Add Entry' : 'Agregar Entrada'}
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-5 card-hover">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>+12.4%</span>
                        </div>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                        {lang === 'en' ? 'Total Revenue' : 'Ingreso Total'}
                    </p>
                    <p className="text-3xl font-black text-foreground">${totalPrice.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-5 card-hover">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <PiggyBank className="h-5 w-5 text-emerald-500" />
                        </div>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                        {lang === 'en' ? 'Guide Commission (10%)' : 'Comisión Guías (10%)'}
                    </p>
                    <p className="text-3xl font-black text-emerald-500">${totalCommission10.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-5 card-hover">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                            <Landmark className="h-5 w-5 text-orange-500" />
                        </div>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                        {lang === 'en' ? 'Provider Payment (20%)' : 'Pago Proveedores (20%)'}
                    </p>
                    <p className="text-3xl font-black text-orange-500">${totalCommission20.toLocaleString()}</p>
                </div>
            </div>

            {/* Guide Performance */}
            <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-5 card-hover">
                <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    {lang === 'en' ? 'Guide Performance' : 'Rendimiento por Guía'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {guideStats.length === 0 ? (
                        <p className="text-sm text-muted-foreground col-span-full">
                            {lang === 'en' ? 'No guide data available' : 'No hay datos de guías'}
                        </p>
                    ) : guideStats.map(([name, stats]) => (
                        <div key={name} className="rounded-xl border border-border/40 bg-background/80 p-4 card-hover group relative overflow-hidden">
                            <div className="flex items-center gap-3 relative z-10">
                                <div className={`w-11 h-11 rounded-full ${guideImageMap[name] ? 'overflow-hidden ring-2 ring-border/60' : `bg-gradient-to-br ${getAvatarColor(name)}`} flex items-center justify-center text-white text-sm font-bold shadow-lg shrink-0`}>
                                    {guideImageMap[name] ? (
                                        <img src={guideImageMap[name]} alt={name} className="w-full h-full object-cover" />
                                    ) : (
                                        getInitials(name)
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground text-sm">{name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.count} {lang === 'en' ? 'tours completed' : 'tours realizados'}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between relative z-10">
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{lang === 'en' ? 'Revenue' : 'Ganancias'}</p>
                                    <p className="text-base font-bold text-foreground">${stats.revenue.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{lang === 'en' ? 'Commission' : 'Comisión'}</p>
                                    <p className="text-sm font-semibold text-emerald-500">${stats.commission.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                                <User className="h-20 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={lang === 'en' ? 'Search transaction...' : 'Buscar transacción...'}
                        className="pl-9 bg-background/80"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Select value={guideFilter} onValueChange={(v) => { setGuideFilter(v); setCurrentPage(1); }}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder={lang === 'en' ? 'All guides' : 'Todos los guías'} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__all__">{lang === 'en' ? 'All guides' : 'Todos los guías'}</SelectItem>
                            {guides.map(g => (
                                <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={locationFilter} onValueChange={(v) => { setLocationFilter(v); setCurrentPage(1); }}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder={lang === 'en' ? 'Location' : 'Ubicación'} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__all__">{lang === 'en' ? 'All locations' : 'Todas'}</SelectItem>
                            {LOCATION_OPTIONS.filter(Boolean).map(l => (
                                <SelectItem key={l} value={l}>{l}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex items-center gap-1 bg-background/80 border border-border/60 rounded-lg p-1">
                        <Input
                            type="date"
                            value={dateFrom}
                            onChange={e => { setDateFrom(e.target.value); setCurrentPage(1); }}
                            className="w-32 border-0 bg-transparent h-8 text-xs"
                        />
                        <span className="text-muted-foreground text-xs px-0.5">{lang === 'en' ? 'to' : 'al'}</span>
                        <Input
                            type="date"
                            value={dateTo}
                            onChange={e => { setDateTo(e.target.value); setCurrentPage(1); }}
                            className="w-32 border-0 bg-transparent h-8 text-xs"
                        />
                        {(dateFrom || dateTo) && (
                            <button onClick={() => { setDateFrom(''); setDateTo(''); setCurrentPage(1); }}
                                className="p-1 hover:bg-muted rounded transition-colors">
                                <X className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                        )}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-2">
                        <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                        {lang === 'en' ? 'Refresh' : 'Actualizar'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportToCSV} disabled={filtered.length === 0} className="gap-2">
                        <Download className="h-3.5 w-3.5" />
                        {lang === 'en' ? 'Export' : 'Exportar'}
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-6 space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0">
                                <div className="w-24 h-4 bg-muted rounded animate-pulse" />
                                <div className="w-40 h-4 bg-muted rounded animate-pulse" />
                                <div className="w-32 h-4 bg-muted rounded animate-pulse" />
                                <div className="w-16 h-4 bg-muted rounded animate-pulse" />
                                <div className="w-20 h-4 bg-muted rounded animate-pulse" />
                                <div className="w-16 h-4 bg-muted rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-16 text-center">
                        <PiggyBank className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">
                            {lang === 'en' ? 'No commissions found' : 'No se encontraron comisiones'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border/60">
                                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap">{lang === 'en' ? 'Date' : 'Fecha'}</th>
                                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap">{lang === 'en' ? 'Tour' : 'Tour'}</th>
                                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap">{lang === 'en' ? 'Customer' : 'Cliente'}</th>
                                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap">{lang === 'en' ? 'Time' : 'Hora'}</th>
                                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap">{lang === 'en' ? 'Location' : 'Ubicación'}</th>
                                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap text-center"># M</th>
                                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap text-center"># PAX</th>
                                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap text-center">{lang === 'en' ? 'Disc. %' : 'Desc. %'}</th>
                                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap text-right">{lang === 'en' ? 'Price' : 'Precio'}</th>
                                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap">{lang === 'en' ? 'Guide' : 'Guía'}</th>
                                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap text-right">10%</th>
                                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap">{lang === 'en' ? 'Provider' : 'Proveedor'}</th>
                                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap text-right">20%</th>
                                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap text-right">IVA</th>
                                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap">{lang === 'en' ? 'Payment' : 'Pago'}</th>
                                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap text-right">{lang === 'en' ? 'Actions' : 'Acciones'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {paginated.map((c) => (
                                    <tr key={c.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-4 py-4 text-sm text-foreground whitespace-nowrap">
                                            {new Date(c.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm shrink-0">
                                                    {TOUR_ICONS[c.tour_name] || (
                                                        <MapPin className="h-4 w-4 text-primary" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-foreground">{c.tour_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm text-foreground">{c.customer_name}</p>
                                            <p className="text-[11px] text-muted-foreground">ID: #{c.id.slice(0, 4)}</p>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-muted-foreground">{c.time || '\u2014'}</td>
                                        <td className="px-4 py-4">
                                            {c.location ? (
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                    c.location === 'Madrigales'
                                                        ? 'bg-amber-500/15 text-amber-500 border-amber-500/25'
                                                        : 'bg-blue-500/15 text-blue-500 border-blue-500/25'
                                                }`}>
                                                    {c.location}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">\u2014</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-center text-sm font-bold text-foreground">{c.machines}</td>
                                        <td className="px-4 py-4 text-center text-sm font-bold text-foreground">{c.pax}</td>
                                        <td className="px-4 py-4 text-center text-sm font-bold text-destructive">
                                            {c.discount > 0 ? `${c.discount}%` : '\u2014'}
                                        </td>
                                        <td className="px-4 py-4 text-right text-base font-bold text-foreground">${c.price.toLocaleString()}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-full ${guideImageMap[c.guide_name] ? 'overflow-hidden ring-1 ring-border/40' : `bg-gradient-to-br ${getAvatarColor(c.guide_name)}`} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                                                    {guideImageMap[c.guide_name] ? (
                                                        <img src={guideImageMap[c.guide_name]} alt={c.guide_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        getInitials(c.guide_name)
                                                    )}
                                                </div>
                                                <span className="text-sm text-foreground">{c.guide_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm font-bold text-emerald-500">${c.commission_10.toFixed(2)}</td>
                                        <td className="px-4 py-4 text-sm text-muted-foreground">{c.provider_name || '\u2014'}</td>
                                        <td className="px-4 py-4 text-right text-sm font-bold text-orange-500">${c.commission_20.toFixed(2)}</td>
                                        <td className="px-4 py-4 text-right text-sm text-muted-foreground">${c.tax.toFixed(2)}</td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                c.payment_method === 'Cash'
                                                    ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/25'
                                                    : c.payment_method === 'Card'
                                                    ? 'bg-blue-500/15 text-blue-500 border-blue-500/25'
                                                    : c.payment_method === 'Transfer'
                                                    ? 'bg-purple-500/15 text-purple-500 border-purple-500/25'
                                                    : 'bg-muted/50 text-muted-foreground border-border/40'
                                            }`}>
                                                {c.payment_method.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <AuditInfo recordId={c.id} />
                                                <button onClick={() => openEditModal(c)}
                                                    className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                                <button onClick={() => handleDeleteClick(c)}
                                                    className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {filtered.length > 0 && (
                    <div className="px-5 py-3.5 bg-muted/30 border-t border-border/40 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                            {lang === 'en'
                                ? `Showing ${(safePage - 1) * pageSize + 1}-${Math.min(safePage * pageSize, filtered.length)} of ${filtered.length} transactions`
                                : `Mostrando ${(safePage - 1) * pageSize + 1}-${Math.min(safePage * pageSize, filtered.length)} de ${filtered.length} transacciones`}
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={safePage <= 1}
                                className="p-1.5 rounded-lg border border-border/40 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                            </button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let pageNum: number;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (safePage <= 3) {
                                    pageNum = i + 1;
                                } else if (safePage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = safePage - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                                            safePage === pageNum
                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                : 'hover:bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            {totalPages > 5 && safePage < totalPages - 2 && (
                                <span className="px-1 text-xs text-muted-foreground">...</span>
                            )}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={safePage >= totalPages}
                                className="p-1.5 rounded-lg border border-border/40 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {lang === 'en' ? 'Delete Commission' : 'Eliminar Comisión'}
                        </DialogTitle>
                    </DialogHeader>
                    {deleteTarget && (
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                {lang === 'en'
                                    ? 'Are you sure you want to delete this commission entry? This action cannot be undone.'
                                    : '¿Estás seguro de eliminar esta comisión? Esta acción no se puede deshacer.'}
                            </p>
                            <div className="rounded-lg border bg-muted/50 p-4 space-y-1 text-sm">
                                <p><span className="font-medium">{lang === 'en' ? 'Customer' : 'Cliente'}:</span> {deleteTarget.customer_name}</p>
                                <p><span className="font-medium">{lang === 'en' ? 'Tour' : 'Tour'}:</span> {deleteTarget.tour_name}</p>
                                <p><span className="font-medium">{lang === 'en' ? 'Date' : 'Fecha'}:</span> {new Date(deleteTarget.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            {lang === 'en' ? 'Cancel' : 'Cancelar'}
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            <Trash2 className="h-4 w-4" />
                            {lang === 'en' ? 'Delete' : 'Eliminar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCommission
                                ? (lang === 'en' ? 'Edit Commission' : 'Editar Comisión')
                                : (lang === 'en' ? 'New Commission' : 'Nueva Comisión')}
                        </DialogTitle>
                    </DialogHeader>

                    {formError && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-sm">
                            {formError}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>{lang === 'en' ? 'Date' : 'Fecha'} *</Label>
                                <Input type="date" required value={formDate} onChange={e => setFormDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>{lang === 'en' ? 'Time' : 'Hora'}</Label>
                                <Input type="time" value={formTime} onChange={e => setFormTime(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>{lang === 'en' ? 'Location' : 'Ubicación'}</Label>
                                <Select value={formLocation} onValueChange={setFormLocation}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={lang === 'en' ? 'Select location' : 'Seleccionar ubicación'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LOCATION_OPTIONS.filter(Boolean).map(l => (
                                            <SelectItem key={l} value={l}>{l}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{lang === 'en' ? 'Tour Name' : 'Nombre del Tour'} *</Label>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Select value={formTour} onValueChange={setFormTour}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={lang === 'en' ? 'Select tour' : 'Seleccionar tour'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tourOptions.map(t => (
                                                <SelectItem key={t.id} value={lang === 'en' ? t.name_en : t.name_es}>
                                                    {lang === 'en' ? t.name_en : t.name_es}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {formTour && !tourOptions.some(t => (lang === 'en' ? t.name_en : t.name_es) === formTour) && (
                                    <Input
                                        value={formTour}
                                        onChange={e => setFormTour(e.target.value)}
                                        className="flex-1"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{lang === 'en' ? 'Customer Name' : 'Nombre del Cliente'} *</Label>
                            <Input type="text" required value={formCustomer} onChange={e => setFormCustomer(e.target.value)} />
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label># M</Label>
                                <Input type="number" min={0} value={formMachines} onChange={e => setFormMachines(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label># PAX</Label>
                                <Input type="number" min={1} value={formPax} onChange={e => setFormPax(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>{lang === 'en' ? 'Discount' : 'Descuento'} (%)</Label>
                                <Input type="number" min={0} max={100} step="1" value={formDiscount} onChange={e => setFormDiscount(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>{lang === 'en' ? 'Price' : 'Precio'} ($)</Label>
                                <Input type="number" min={0} step="0.01" value={formPrice} onChange={e => setFormPrice(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{lang === 'en' ? 'Guide Name' : 'Nombre del Guía'}</Label>
                                <Select value={formGuide} onValueChange={setFormGuide}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={lang === 'en' ? 'Select guide' : 'Seleccionar guía'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {guides.map(g => (
                                            <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>10% {lang === 'en' ? 'Guide' : 'Guía'} ($)</Label>
                                <Input type="number" min={0} step="0.01" value={formCommission10} onChange={e => setFormCommission10(e.target.value)} placeholder="0.00" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{lang === 'en' ? 'Provider' : 'Proveedor'}</Label>
                                <Input type="text" value={formProvider} onChange={e => setFormProvider(e.target.value)} placeholder={lang === 'en' ? 'Provider name...' : 'Nombre del proveedor...'} />
                            </div>
                            <div className="space-y-2">
                                <Label>20% {lang === 'en' ? 'Provider' : 'Proveedor'} ($)</Label>
                                <Input type="number" min={0} step="0.01" value={formCommission20} onChange={e => setFormCommission20(e.target.value)} placeholder="0.00" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{lang === 'en' ? 'Payment Method' : 'Método de Pago'}</Label>
                                <Select value={formPaymentMethod} onValueChange={setFormPaymentMethod}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PAYMENT_OPTIONS.map(p => (
                                            <SelectItem key={p} value={p}>{p}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>IVA ($)</Label>
                                <Input type="number" min={0} step="0.01" value={formTax} onChange={e => setFormTax(e.target.value)} placeholder="0.00" />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={formSaving}>
                                {lang === 'en' ? 'Cancel' : 'Cancelar'}
                            </Button>
                            <Button type="submit" disabled={formSaving}>
                                {formSaving
                                    ? (lang === 'en' ? 'Saving...' : 'Guardando...')
                                    : (lang === 'en' ? 'Save' : 'Guardar')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <style>{`
                .card-hover {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .card-hover:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }
            `}</style>
        </div>
    );
}
