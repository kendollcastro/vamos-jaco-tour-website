import { useState, useEffect } from 'react';
import {
    getTeamMembers,
    getAllTeamMembersAdmin,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    type TeamMember,
    type TeamMemberInput
} from '../../lib/supabase-team';
import { supabase } from '../../lib/supabase';
import ImagePicker from './ImagePicker';

export default function TeamManager() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal State
    const [isEditing, setIsEditing] = useState(false);
    const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [positionEn, setPositionEn] = useState('');
    const [positionEs, setPositionEs] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [socialInstagram, setSocialInstagram] = useState('');
    const [socialLinkedin, setSocialLinkedin] = useState('');
    const [socialTwitter, setSocialTwitter] = useState('');
    const [displayOrder, setDisplayOrder] = useState<number>(0);
    const [isActive, setIsActive] = useState(true);

    // Image Picker State
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const data = await getAllTeamMembersAdmin();
            setMembers(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch team members');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEditor = (member?: TeamMember) => {
        if (member) {
            setCurrentMember(member);
            setName(member.name);
            setPositionEn(member.position_en || '');
            setPositionEs(member.position_es || '');
            setImageUrl(member.image_url || '');
            setSocialInstagram(member.social_instagram || '');
            setSocialLinkedin(member.social_linkedin || '');
            setSocialTwitter(member.social_twitter || '');
            setDisplayOrder(member.display_order || 0);
            setIsActive(member.is_active);
        } else {
            setCurrentMember(null);
            setName('');
            setPositionEn('');
            setPositionEs('');
            setImageUrl('');
            setSocialInstagram('');
            setSocialLinkedin('');
            setSocialTwitter('');
            setDisplayOrder(members.length > 0 ? Math.max(...members.map(m => m.display_order || 0)) + 1 : 0);
            setIsActive(true);
        }
        setIsEditing(true);
        setError(null);
    };

    const handleCloseEditor = () => {
        setIsEditing(false);
        setCurrentMember(null);
    };

    // Handle Image Selection
    const handleImageSelect = (path: string) => {
        setImageUrl(path);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const memberData: TeamMemberInput = {
                name,
                position_en: positionEn,
                position_es: positionEs,
                image_url: imageUrl,
                social_instagram: socialInstagram,
                social_linkedin: socialLinkedin,
                social_twitter: socialTwitter,
                display_order: displayOrder,
                is_active: isActive
            };

            if (currentMember) {
                await updateTeamMember(currentMember.id, memberData);
            } else {
                await createTeamMember(memberData);
            }

            await fetchMembers();
            handleCloseEditor();
        } catch (err: any) {
            setError(err.message || 'Failed to save team member');
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this team member?')) return;

        try {
            setLoading(true);
            await deleteTeamMember(id);
            await fetchMembers();
        } catch (err: any) {
            setError(err.message || 'Failed to delete team member');
            setLoading(false);
        }
    };

    if (loading && members.length === 0) {
        return <div className="text-gray-400 text-center py-12">Loading team members...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Members</h2>
                <button
                    onClick={() => handleOpenEditor()}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Member
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm mb-6">
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-dark-soft border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 transition-colors">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Position</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {members.map(member => (
                                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-dark overflow-hidden ring-2 ring-gray-200 dark:ring-white/10 shrink-0">
                                                {member.image_url ? (
                                                    <img src={member.image_url} alt={member.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900 dark:text-white">{member.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {member.social_instagram && 'IG '}
                                                    {member.social_linkedin && 'IN '}
                                                    {member.social_twitter && 'TW'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700 dark:text-gray-300">{member.position_en || '-'}</div>
                                        <div className="text-xs text-gray-500">{member.position_es || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${member.is_active ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
                                            {member.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-medium">
                                        {member.display_order}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleOpenEditor(member)}
                                            className="text-brand-teal hover:text-brand-teal/80 dark:hover:text-white transition-colors mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(member.id)}
                                            className="text-red-400 hover:text-white transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {members.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                                        No team members found. Click "Add Member" to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Editor Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/80 z-50 flex justify-end">
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => !loading && handleCloseEditor()}
                    />
                    <div className="relative z-50 w-full max-w-2xl bg-white dark:bg-dark border-l border-gray-200 dark:border-white/10 h-full overflow-y-auto animate-slide-left shadow-2xl transition-colors duration-300">
                        <div className="sticky top-0 bg-white/95 dark:bg-dark/95 backdrop-blur-sm border-b border-gray-100 dark:border-white/5 px-6 py-4 flex items-center justify-between z-10 transition-colors duration-300">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {currentMember ? 'Edit Team Member' : 'New Team Member'}
                            </h2>
                            <button
                                onClick={handleCloseEditor}
                                disabled={loading}
                                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 transition disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSave} className="space-y-6">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Basic Info</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                            placeholder="e.g., Carlos Rodríguez"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Position (EN) *</label>
                                            <input
                                                type="text"
                                                required
                                                value={positionEn}
                                                onChange={e => setPositionEn(e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                                placeholder="e.g., Lead Guide"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Position (ES) *</label>
                                            <input
                                                type="text"
                                                required
                                                value={positionEs}
                                                onChange={e => setPositionEs(e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                                placeholder="e.g., Guía Principal"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Image */}
                                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Image</h3>
                                    <div className="flex items-start gap-4">
                                        <div className="w-24 h-24 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                                            {imageUrl ? (
                                                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Select Image from Gallery</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsImagePickerOpen(true)}
                                                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-white text-sm font-medium rounded-xl transition-colors"
                                                >
                                                    Open Image Gallery
                                                </button>
                                            </div>
                                            <div>
                                                <label className="block border-t border-gray-100 dark:border-white/5 pt-3 mt-3 text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Or Image URL</label>
                                                <input
                                                    type="text"
                                                    value={imageUrl}
                                                    onChange={e => setImageUrl(e.target.value)}
                                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Social Links (Optional)</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <svg className="w-4 h-4 text-brand-orange" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                                </svg>
                                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Instagram URL</label>
                                            </div>
                                            <input
                                                type="url"
                                                value={socialInstagram}
                                                onChange={e => setSocialInstagram(e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors text-sm"
                                                placeholder="https://instagram.com/..."
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <svg className="w-4 h-4 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                </svg>
                                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">LinkedIn URL</label>
                                            </div>
                                            <input
                                                type="url"
                                                value={socialLinkedin}
                                                onChange={e => setSocialLinkedin(e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors text-sm"
                                                placeholder="https://linkedin.com/in/..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Settings */}
                                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Settings</h3>
                                    <div className="flex gap-6">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Display Order</label>
                                            <input
                                                type="number"
                                                value={displayOrder}
                                                onChange={e => setDisplayOrder(parseInt(e.target.value) || 0)}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div className="flex-1 flex items-center mt-6">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only"
                                                        checked={isActive}
                                                        onChange={(e) => setIsActive(e.target.checked)}
                                                    />
                                                    <div className={`block w-14 h-8 rounded-full transition-colors ${isActive ? 'bg-primary' : 'bg-gray-600'}`}></div>
                                                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isActive ? 'transform translate-x-6' : ''}`}></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">Active Member</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-dark py-4 transition-colors duration-300">
                                    <button
                                        type="button"
                                        onClick={handleCloseEditor}
                                        disabled={loading}
                                        className="px-6 py-2.5 rounded-full text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-primary hover:bg-primary-dark text-white px-8 py-2.5 rounded-full text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:shadow-primary/40"
                                    >
                                        {loading ? 'Saving...' : 'Save Member'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {/* Image Picker */}
            <ImagePicker
                isOpen={isImagePickerOpen}
                onClose={() => setIsImagePickerOpen(false)}
                onSelect={handleImageSelect}
                multiple={false}
            />
        </div>
    );
}
