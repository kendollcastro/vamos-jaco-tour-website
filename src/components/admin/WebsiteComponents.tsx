import React, { useState, useEffect } from 'react';
import { getWebsiteComponent, updateWebsiteComponent } from '../../lib/supabase-components';
import { Save, Plus, Trash2, MoveUp, MoveDown, LayoutTemplate, ShieldCheck, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import ImagePicker from './ImagePicker';

interface TrustBarItem {
    id: string;
    name: string;
    name_es: string;
    icon: string;
    color: string;
    image?: string;
}

const AVAILABLE_ICONS = [
    'Award', 'ShieldCheck', 'FileCheck', 'UserCheck', 'Shield', 'Lock',
    'Plane', 'Map', 'Heart', 'Globe', 'Compass', 'Star'
];

const AVAILABLE_COLORS = [
    { label: 'Green', value: 'text-green-500' },
    { label: 'Blue', value: 'text-blue-500' },
    { label: 'Indigo', value: 'text-indigo-500' },
    { label: 'Orange', value: 'text-brand-orange' },
    { label: 'Teal', value: 'text-brand-teal' },
    { label: 'Red', value: 'text-red-500' },
    { label: 'Yellow', value: 'text-brand-yellow' },
    { label: 'Primary (Red)', value: 'text-primary' },
    { label: 'White', value: 'text-white' },
];

export default function WebsiteComponents() {
    const [activeComponent, setActiveComponent] = useState<string | null>(null);
    const [trustBarItems, setTrustBarItems] = useState<TrustBarItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [imagePickerIndex, setImagePickerIndex] = useState<number | null>(null);

    const COMPONENTS_LIST = [
        {
            id: 'trust_bar',
            name: 'Trust Bar',
            description: 'Logos and text moving horizontally below the hero section.',
            icon: ShieldCheck,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        }
    ];

    useEffect(() => {
        if (activeComponent === 'trust_bar') {
            loadTrustBarData();
        }
    }, [activeComponent]);

    async function loadTrustBarData() {
        setIsLoading(true);
        const data = await getWebsiteComponent('trust_bar');
        if (data && data.data && Array.isArray(data.data)) {
            setTrustBarItems(data.data);
        } else {
            setSaveStatus({ type: 'error', message: 'Trust Bar data not found or invalid format.' });
        }
        setIsLoading(false);
    }

    async function handleSave() {
        setIsSaving(true);
        setSaveStatus(null);
        const success = await updateWebsiteComponent('trust_bar', trustBarItems);
        if (success) {
            setSaveStatus({ type: 'success', message: 'Trust Bar updated successfully!' });
            setTimeout(() => setSaveStatus(null), 3000);
        } else {
            setSaveStatus({ type: 'error', message: 'Failed to update Trust Bar.' });
        }
        setIsSaving(false);
    }

    function handleAddItem() {
        const newItem: TrustBarItem = {
            id: Date.now().toString(),
            name: 'New Item',
            name_es: 'Nuevo Elemento',
            icon: 'Shield',
            color: 'text-primary'
        };
        setTrustBarItems([...trustBarItems, newItem]);
    }

    function handleRemoveItem(index: number) {
        const newItems = [...trustBarItems];
        newItems.splice(index, 1);
        setTrustBarItems(newItems);
    }

    function moveItem(index: number, direction: -1 | 1) {
        if ((direction === -1 && index === 0) || (direction === 1 && index === trustBarItems.length - 1)) return;
        
        const newItems = [...trustBarItems];
        const temp = newItems[index];
        newItems[index] = newItems[index + direction];
        newItems[index + direction] = temp;
        setTrustBarItems(newItems);
    }

    function updateItem(index: number, field: keyof TrustBarItem, value: string) {
        const newItems = [...trustBarItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setTrustBarItems(newItems);
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // ─── GRID VIEW ───
    if (!activeComponent) {
        return (
            <div className="max-w-6xl mx-auto pb-20">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <LayoutTemplate className="w-6 h-6 text-primary" />
                        Website Components
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Select a component to manage its content.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {COMPONENTS_LIST.map(comp => (
                        <button
                            key={comp.id}
                            onClick={() => setActiveComponent(comp.id)}
                            className="text-left bg-white dark:bg-dark-soft rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/5 hover:border-primary dark:hover:border-primary transition-all group flex flex-col gap-4"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${comp.bg}`}>
                                <comp.icon className={`w-6 h-6 ${comp.color}`} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{comp.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{comp.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // ─── EDITOR VIEW ───
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <button 
                        onClick={() => setActiveComponent(null)}
                        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white mb-2 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to components
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {activeComponent === 'trust_bar' ? 'Edit Trust Bar' : activeComponent}
                    </h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-medium shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {saveStatus && (
                <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${saveStatus.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                    <div dangerouslySetInnerHTML={{ __html: saveStatus.type === 'success' ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' }} />
                    <p className="font-medium">{saveStatus.message}</p>
                </div>
            )}

            {/* Trust Bar Editor */}
            {activeComponent === 'trust_bar' && (
                <div className="bg-white dark:bg-dark-soft rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-black/20">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Trust Bar Items</h2>
                            <p className="text-sm text-gray-500">Manage the items displayed in the Trust Bar.</p>
                        </div>
                        <button
                            onClick={handleAddItem}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-dark rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Item
                        </button>
                    </div>
                    
                    <div className="p-6">
                        <div className="space-y-4">
                            {trustBarItems.map((item, index) => (
                                <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-100 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5 relative group">
                                    
                                    {/* Controls */}
                                    <div className="flex flex-row md:flex-col gap-1 items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/10 pb-4 md:pb-0 md:pr-4">
                                        <button 
                                            onClick={() => moveItem(index, -1)}
                                            disabled={index === 0}
                                            className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30"
                                        >
                                            <MoveUp className="w-4 h-4" />
                                        </button>
                                        <span className="text-xs font-bold text-gray-300 dark:text-gray-600 w-4 text-center">{index + 1}</span>
                                        <button 
                                            onClick={() => moveItem(index, 1)}
                                            disabled={index === trustBarItems.length - 1}
                                            className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30"
                                        >
                                            <MoveDown className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Name (English)</label>
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={(e) => updateItem(index, 'name', e.target.value)}
                                                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Name (Spanish)</label>
                                            <input
                                                type="text"
                                                value={item.name_es || ''}
                                                onChange={(e) => updateItem(index, 'name_es', e.target.value)}
                                                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Icon (Fallback)</label>
                                            <select
                                                value={item.icon}
                                                onChange={(e) => updateItem(index, 'icon', e.target.value)}
                                                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                                            >
                                                {AVAILABLE_ICONS.map(icon => (
                                                    <option key={icon} value={icon}>{icon}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Color Class</label>
                                            <select
                                                value={item.color}
                                                onChange={(e) => updateItem(index, 'color', e.target.value)}
                                                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                                            >
                                                {AVAILABLE_COLORS.map(color => (
                                                    <option key={color.value} value={color.value}>{color.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Custom Image (Overrides Icon)</label>
                                            <div className="flex items-center gap-3">
                                                {item.image ? (
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={() => updateItem(index, 'image', '')}
                                                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 text-white transition-opacity"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-400">
                                                        <ImageIcon className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => setImagePickerIndex(index)}
                                                    className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                                >
                                                    {item.image ? 'Change Image' : 'Select Image'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delete */}
                                    <div className="flex items-center justify-center md:items-start md:justify-end pl-0 md:pl-2">
                                        <button 
                                            onClick={() => handleRemoveItem(index)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                            title="Remove Item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            {trustBarItems.length === 0 && (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/20">
                                    No items in the Trust Bar. Click "Add Item" to create one.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <ImagePicker
                isOpen={imagePickerIndex !== null}
                onClose={() => setImagePickerIndex(null)}
                onSelect={(path) => {
                    if (imagePickerIndex !== null) {
                        updateItem(imagePickerIndex, 'image', path);
                    }
                }}
            />
        </div>
    );
}
