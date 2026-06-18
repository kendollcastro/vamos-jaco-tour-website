import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
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
    created_at: string;
}

const DEMO_COMMISSIONS: Commission[] = [
    { id: '1', date: new Date().toISOString().split('T')[0], tour_name: 'ATV Mountain Adventure', customer_name: 'Sarah Johnson', time: '09:00', machines: 2, pax: 2, discount: 0, price: 180, guide_name: 'Carlos R.', commission_10: 18, provider_name: 'ATV Rentals CR', commission_20: 36, tax: 27.14, payment_method: 'Cash', created_at: new Date().toISOString() },
    { id: '2', date: new Date().toISOString().split('T')[0], tour_name: 'Jet Ski Ocean Thrill', customer_name: 'Mike Chen', time: '11:00', machines: 2, pax: 2, discount: 10, price: 230, guide_name: 'Andrea M.', commission_10: 23, provider_name: 'Jet Ski Jacó', commission_20: 46, tax: 34.56, payment_method: 'Card', created_at: new Date().toISOString() },
    { id: '3', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], tour_name: 'Side by Side Buggy', customer_name: 'Ana García', time: '14:00', machines: 2, pax: 4, discount: 0, price: 600, guide_name: 'Carlos R.', commission_10: 60, provider_name: 'Buggy Tours CR', commission_20: 120, tax: 90.72, payment_method: 'Transfer', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: '4', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], tour_name: 'Surf Lessons', customer_name: 'James Wilson', time: '08:00', machines: 1, pax: 1, discount: 0, price: 70, guide_name: 'Sofia L.', commission_10: 7, provider_name: '', commission_20: 0, tax: 10.58, payment_method: 'Cash', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '5', date: new Date(Date.now() - 172800000).toISOString().split('T')[0], tour_name: 'Flyboard Experience', customer_name: 'Laura Rodríguez', time: '15:00', machines: 2, pax: 2, discount: 0, price: 160, guide_name: 'Andrea M.', commission_10: 16, provider_name: 'Flyboard CR', commission_20: 32, tax: 24.19, payment_method: 'Card', created_at: new Date(Date.now() - 172800000).toISOString() },
    { id: '6', date: new Date().toISOString().split('T')[0], tour_name: 'Slingshot Rental', customer_name: 'Carlos Méndez', time: '10:00', machines: 1, pax: 1, discount: 15, price: 335, guide_name: 'Carlos R.', commission_10: 33.50, provider_name: 'Slingshot Jacó', commission_20: 67, tax: 50.56, payment_method: 'Cash', created_at: new Date(Date.now() - 7200000).toISOString() },
];

const PAYMENT_OPTIONS = ['Cash', 'Card', 'Transfer', 'Synapay', 'Tilopay'];

export default function CommissionsTable({ onToast }: { onToast?: (message: string) => void }) {
    const $language = useStore(language);

    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCommission, setEditingCommission] = useState<Commission | null>(null);
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
    const [formPaymentMethod, setFormPaymentMethod] = useState('Cash');
    const [formSaving, setFormSaving] = useState(false);
    const [formError, setFormError] = useState('');

    const isDemo = !supabase;

    const [guides, setGuides] = useState<{ id: string; name: string }[]>([]);
    const [tourOptions, setTourOptions] = useState<{ id: string; name_en: string; name_es: string }[]>([]);

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
            .select('id, name')
            .eq('is_active', true)
            .order('name');
        if (data) setGuides(data as { id: string; name: string }[]);
    }

    async function fetchToursList() {
        if (!supabase) {
            setTourOptions([
                { id: '1', name_en: 'ATV Mountain Adventure', name_es: 'Aventura ATV Montaña' },
                { id: '2', name_en: 'Jet Ski Ocean Thrill', name_es: 'Jet Ski Emoción Oceánica' },
                { id: '3', name_en: 'Side by Side Buggy', name_es: 'Buggy Side by Side' },
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
        setFormPaymentMethod('Cash');
        setFormError('');
        setDialogOpen(true);
    }

    function openEditModal(c: Commission) {
        setEditingCommission(c);
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
        setFormPaymentMethod(c.payment_method);
        setFormError('');
        setDialogOpen(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!formTour || !formCustomer || !formDate) {
            setFormError($language === 'en' ? 'Tour, customer and date are required' : 'Tour, cliente y fecha son obligatorios');
            return;
        }
        setFormSaving(true);

        const machines = parseInt(formMachines) || 0;
        const pax = parseInt(formPax) || 1;
        const discount = parseFloat(formDiscount) || 0;
        const price = parseFloat(formPrice) || 0;

        const payload = {
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

        if (isDemo) {
            if (editingCommission) {
                setCommissions(prev => prev.map(c => c.id === editingCommission.id ? { ...c, ...payload } : c));
            } else {
                const newEntry: Commission = {
                    id: Date.now().toString(),
                    ...payload,
                    created_at: new Date().toISOString(),
                };
                setCommissions(prev => [newEntry, ...prev]);
            }
            onToast?.($language === 'en' ? 'Commission saved' : 'Comisión guardada');
            setFormSaving(false);
            setDialogOpen(false);
            return;
        }

        if (!supabase) return;
        let error;
        if (editingCommission) {
            ({ error } = await supabase.from('commissions').update(payload).eq('id', editingCommission.id));
        } else {
            ({ error } = await supabase.from('commissions').insert([payload]));
        }
        if (error) {
            setFormError(error.message);
        } else {
            onToast?.($language === 'en' ? 'Commission saved' : 'Comisión guardada');
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
            onToast?.($language === 'en' ? 'Commission deleted' : 'Comisión eliminada');
            return;
        }
        if (!supabase) return;
        const { error } = await supabase.from('commissions').delete().eq('id', id);
        if (!error) {
            fetchCommissions();
            onToast?.($language === 'en' ? 'Commission deleted' : 'Comisión eliminada');
        }
    }

    function exportToCSV() {
        const headers = [
            $language === 'en' ? 'Date' : 'Fecha',
            $language === 'en' ? 'Tour' : 'Tour',
            $language === 'en' ? 'Customer' : 'Cliente',
            $language === 'en' ? 'Time' : 'Hora',
            '# M',
            '# PAX',
            $language === 'en' ? 'Discount' : 'Descuento',
            $language === 'en' ? 'Price' : 'Precio',
            $language === 'en' ? 'Guide' : 'Guía',
            '10%',
            $language === 'en' ? 'Provider' : 'Proveedor',
            '20%',
            'IVA',
            $language === 'en' ? 'Payment' : 'Pago',
        ];
        const rows = filtered.map(c => [
            c.date, c.tour_name, c.customer_name, c.time, c.machines,
            c.pax, c.discount, c.price, c.guide_name, c.commission_10,
            c.provider_name, c.commission_20, c.tax, c.payment_method,
        ]);
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `commissions_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        onToast?.($language === 'en' ? `Exported ${filtered.length} commissions` : `Exportadas ${filtered.length} comisiones`);
    }

    const filtered = commissions.filter(c => {
        const matchesSearch = !searchQuery ||
            c.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.tour_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.guide_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDateFrom = !dateFrom || new Date(c.date) >= new Date(dateFrom);
        const matchesDateTo = !dateTo || new Date(c.date) <= new Date(dateTo);
        return matchesSearch && matchesDateFrom && matchesDateTo;
    });

    const totalPrice = filtered.reduce((sum, c) => sum + c.price, 0);
    const totalCommission10 = filtered.reduce((sum, c) => sum + c.commission_10, 0);
    const totalCommission20 = filtered.reduce((sum, c) => sum + c.commission_20, 0);

    const t = adminTranslations[$language];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">
                        {$language === 'en' ? 'Commissions' : 'Comisiones'}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {$language === 'en' ? 'Track guide commissions and provider payments' : 'Control de comisiones de guías y pagos a proveedores'}
                    </p>
                </div>
                <Button onClick={openNewModal}>
                    <Plus className="h-4 w-4" />
                    {$language === 'en' ? 'Add Entry' : 'Agregar Entrada'}
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <DollarSign className="h-4 w-4" />
                        <p className="text-xs font-bold uppercase tracking-wider">{$language === 'en' ? 'Total Revenue' : 'Ingreso Total'}</p>
                    </div>
                    <p className="text-2xl font-black">${totalPrice.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <PiggyBank className="h-4 w-4" />
                        <p className="text-xs font-bold uppercase tracking-wider">10% {$language === 'en' ? 'Guide' : 'Guía'}</p>
                    </div>
                    <p className="text-2xl font-black text-emerald-600">${totalCommission10.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Landmark className="h-4 w-4" />
                        <p className="text-xs font-bold uppercase tracking-wider">20% {$language === 'en' ? 'Provider' : 'Proveedor'}</p>
                    </div>
                    <p className="text-2xl font-black text-orange-600">${totalCommission20.toLocaleString()}</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={$language === 'en' ? 'Search customer, tour or guide...' : 'Buscar cliente, tour o guía...'}
                        className="pl-9"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        {$language === 'en' ? 'Refresh' : 'Actualizar'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportToCSV} disabled={filtered.length === 0}>
                        <Download className="h-4 w-4" />
                        {$language === 'en' ? 'Export' : 'Exportar'}
                    </Button>
                    <div className="flex items-center gap-2">
                        <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-36" />
                        <span className="text-muted-foreground">-</span>
                        <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-36" />
                        {(dateFrom || dateTo) && (
                            <Button variant="ghost" size="icon" onClick={() => { setDateFrom(''); setDateTo(''); }}>
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border bg-card shadow-sm">
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
                            {$language === 'en' ? 'No commissions found' : 'No se encontraron comisiones'}
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{$language === 'en' ? 'Date' : 'Fecha'}</TableHead>
                                <TableHead>{$language === 'en' ? 'Tour' : 'Tour'}</TableHead>
                                <TableHead>{$language === 'en' ? 'Customer' : 'Cliente'}</TableHead>
                                <TableHead>{$language === 'en' ? 'Time' : 'Hora'}</TableHead>
                                <TableHead># M</TableHead>
                                <TableHead># PAX</TableHead>
                                <TableHead>{$language === 'en' ? 'Price' : 'Precio'}</TableHead>
                                <TableHead>{$language === 'en' ? 'Guide' : 'Guía'}</TableHead>
                                <TableHead>10%</TableHead>
                                <TableHead>{$language === 'en' ? 'Provider' : 'Proveedor'}</TableHead>
                                <TableHead>20%</TableHead>
                                <TableHead>IVA</TableHead>
                                <TableHead>{$language === 'en' ? 'Payment' : 'Pago'}</TableHead>
                                <TableHead className="text-right">{$language === 'en' ? 'Actions' : 'Acciones'}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-medium">{new Date(c.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{c.tour_name}</TableCell>
                                    <TableCell>{c.customer_name}</TableCell>
                                    <TableCell className="text-muted-foreground">{c.time}</TableCell>
                                    <TableCell className="font-bold">{c.machines}</TableCell>
                                    <TableCell className="font-bold">{c.pax}</TableCell>
                                    <TableCell className="font-black">
                                        ${c.price.toLocaleString()}
                                        {c.discount > 0 && (
                                            <span className="ml-1 text-[10px] text-destructive">(-${c.discount})</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{c.guide_name}</TableCell>
                                    <TableCell className="font-bold text-emerald-600">${c.commission_10.toFixed(2)}</TableCell>
                                    <TableCell className="text-muted-foreground">{c.provider_name || '-'}</TableCell>
                                    <TableCell className="font-bold text-orange-600">${c.commission_20.toFixed(2)}</TableCell>
                                    <TableCell className="text-muted-foreground">${c.tax.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            c.payment_method === 'Cash'
                                                ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
                                                : c.payment_method === 'Card'
                                                ? 'bg-blue-500/20 text-blue-600 border border-blue-500/30'
                                                : 'bg-purple-500/20 text-purple-600 border border-purple-500/30'
                                        }`}>
                                            {c.payment_method}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => openEditModal(c)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(c)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {$language === 'en' ? 'Delete Commission' : 'Eliminar Comisión'}
                        </DialogTitle>
                    </DialogHeader>
                    {deleteTarget && (
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                {$language === 'en'
                                    ? 'Are you sure you want to delete this commission entry? This action cannot be undone.'
                                    : '¿Estás seguro de eliminar esta comisión? Esta acción no se puede deshacer.'}
                            </p>
                            <div className="rounded-lg border bg-muted/50 p-4 space-y-1 text-sm">
                                <p><span className="font-medium">{$language === 'en' ? 'Customer' : 'Cliente'}:</span> {deleteTarget.customer_name}</p>
                                <p><span className="font-medium">{$language === 'en' ? 'Tour' : 'Tour'}:</span> {deleteTarget.tour_name}</p>
                                <p><span className="font-medium">{$language === 'en' ? 'Date' : 'Fecha'}:</span> {new Date(deleteTarget.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            {$language === 'en' ? 'Cancel' : 'Cancelar'}
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            <Trash2 className="h-4 w-4" />
                            {$language === 'en' ? 'Delete' : 'Eliminar'}
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
                                ? ($language === 'en' ? 'Edit Commission' : 'Editar Comisión')
                                : ($language === 'en' ? 'New Commission' : 'Nueva Comisión')}
                        </DialogTitle>
                    </DialogHeader>

                    {formError && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-sm">
                            {formError}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{$language === 'en' ? 'Date' : 'Fecha'} *</Label>
                                <Input type="date" required value={formDate} onChange={e => setFormDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>{$language === 'en' ? 'Time' : 'Hora'}</Label>
                                <Input type="time" value={formTime} onChange={e => setFormTime(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{$language === 'en' ? 'Tour Name' : 'Nombre del Tour'} *</Label>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Select value={formTour} onValueChange={setFormTour}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={$language === 'en' ? 'Select tour' : 'Seleccionar tour'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tourOptions.map(t => (
                                                <SelectItem key={t.id} value={$language === 'en' ? t.name_en : t.name_es}>
                                                    {$language === 'en' ? t.name_en : t.name_es}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {formTour && !tourOptions.some(t => ($language === 'en' ? t.name_en : t.name_es) === formTour) && (
                                    <Input
                                        value={formTour}
                                        onChange={e => setFormTour(e.target.value)}
                                        className="flex-1"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{$language === 'en' ? 'Customer Name' : 'Nombre del Cliente'} *</Label>
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
                                <Label>{$language === 'en' ? 'Discount' : 'Descuento'} ($)</Label>
                                <Input type="number" min={0} step="0.01" value={formDiscount} onChange={e => setFormDiscount(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>{$language === 'en' ? 'Price' : 'Precio'} ($)</Label>
                                <Input type="number" min={0} step="0.01" value={formPrice} onChange={e => setFormPrice(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{$language === 'en' ? 'Guide Name' : 'Nombre del Guía'}</Label>
                                <Select value={formGuide} onValueChange={setFormGuide}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={$language === 'en' ? 'Select guide' : 'Seleccionar guía'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {guides.map(g => (
                                            <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>10% {$language === 'en' ? 'Guide' : 'Guía'} ($)</Label>
                                <Input type="number" min={0} step="0.01" value={formCommission10} onChange={e => setFormCommission10(e.target.value)} placeholder="0.00" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{$language === 'en' ? 'Provider' : 'Proveedor'}</Label>
                                <Input type="text" value={formProvider} onChange={e => setFormProvider(e.target.value)} placeholder={$language === 'en' ? 'Provider name...' : 'Nombre del proveedor...'} />
                            </div>
                            <div className="space-y-2">
                                <Label>20% {$language === 'en' ? 'Provider' : 'Proveedor'} ($)</Label>
                                <Input type="number" min={0} step="0.01" value={formCommission20} onChange={e => setFormCommission20(e.target.value)} placeholder="0.00" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{$language === 'en' ? 'Payment Method' : 'Método de Pago'}</Label>
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
                                {$language === 'en' ? 'Cancel' : 'Cancelar'}
                            </Button>
                            <Button type="submit" disabled={formSaving}>
                                {formSaving
                                    ? ($language === 'en' ? 'Saving...' : 'Guardando...')
                                    : ($language === 'en' ? 'Save' : 'Guardar')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
