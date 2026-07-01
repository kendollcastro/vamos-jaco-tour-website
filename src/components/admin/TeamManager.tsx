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
import { Plus, X, User, Image as ImageIcon, Camera, Instagram, Linkedin, Trash2 } from 'lucide-react';
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
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import ImagePicker from './ImagePicker';

export default function TeamManager() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);

    const [name, setName] = useState('');
    const [positionEn, setPositionEn] = useState('');
    const [positionEs, setPositionEs] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [socialInstagram, setSocialInstagram] = useState('');
    const [socialLinkedin, setSocialLinkedin] = useState('');
    const [socialTwitter, setSocialTwitter] = useState('');
    const [displayOrder, setDisplayOrder] = useState<number>(0);
    const [isActive, setIsActive] = useState(true);

    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);

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
        try {
            setLoading(true);
            await deleteTeamMember(id);
            await fetchMembers();
            setDeleteTarget(null);
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
                <Button
                    onClick={() => handleOpenEditor()}
                >
                    <Plus className="w-5 h-5" />
                    Add Member
                </Button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm mb-6">
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-dark-soft border border-border/40 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-border/40 bg-muted/30">
                            <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</TableHead>
                            <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Position</TableHead>
                            <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</TableHead>
                            <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</TableHead>
                            <TableHead className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border/30">
                        {members.map(member => (
                            <TableRow key={member.id} className="hover:bg-accent/50 transition-colors group">
                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-dark overflow-hidden ring-2 ring-gray-200 dark:ring-white/10 shrink-0">
                                            {member.image_url ? (
                                                <img src={member.image_url} alt={member.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                    <User className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900 dark:text-white">{member.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {member.social_instagram && 'IG '}
                                                {member.social_linkedin && 'IN '}
                                                {member.social_twitter && 'TW'}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">{member.position_en || '-'}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{member.position_es || '-'}</div>
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${member.is_active ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
                                        {member.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-medium">
                                    {member.display_order}
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Button
                                        variant="link"
                                        onClick={() => handleOpenEditor(member)}
                                        className="text-brand-teal hover:text-brand-teal/80 dark:hover:text-white mr-3"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="link"
                                        onClick={() => setDeleteTarget(member)}
                                        className="text-red-400 hover:text-white"
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {members.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                                    No team members found. Click "Add Member" to create one.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/80 z-50 flex justify-end">
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => !loading && handleCloseEditor()}
                    />
                    <div className="relative z-50 w-full max-w-2xl bg-white dark:bg-dark border-l border-gray-200 dark:border-white/10 h-full overflow-y-auto shadow-2xl transition-colors duration-300">
                        <div className="sticky top-0 bg-white/95 dark:bg-dark/95 backdrop-blur-sm border-b border-border/40 px-6 py-4 flex items-center justify-between z-10 transition-colors duration-300">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {currentMember ? 'Edit Team Member' : 'New Team Member'}
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCloseEditor}
                                disabled={loading}
                                className="rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Basic Info</h3>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name">Name *</Label>
                                        <Input
                                            id="name"
                                            required
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="e.g., Carlos Rodríguez"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="positionEn">Position (EN) *</Label>
                                            <Input
                                                id="positionEn"
                                                required
                                                value={positionEn}
                                                onChange={e => setPositionEn(e.target.value)}
                                                placeholder="e.g., Lead Guide"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="positionEs">Position (ES) *</Label>
                                            <Input
                                                id="positionEs"
                                                required
                                                value={positionEs}
                                                onChange={e => setPositionEs(e.target.value)}
                                                placeholder="e.g., Guía Principal"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-border/40">
                                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Image</h3>
                                    <div className="flex items-start gap-4">
                                        <div className="w-24 h-24 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                                            {imageUrl ? (
                                                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <Camera className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="space-y-1.5">
                                                <Label>Select Image from Gallery</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setIsImagePickerOpen(true)}
                                                >
                                                    <ImageIcon className="w-4 h-4" />
                                                    Open Image Gallery
                                                </Button>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="imageUrl">Or Image URL</Label>
                                                <Input
                                                    id="imageUrl"
                                                    value={imageUrl}
                                                    onChange={e => setImageUrl(e.target.value)}
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-border/40">
                                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Social Links (Optional)</h3>
                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Instagram className="w-4 h-4 text-brand-orange" />
                                                <Label htmlFor="instagram">Instagram URL</Label>
                                            </div>
                                            <Input
                                                id="instagram"
                                                value={socialInstagram}
                                                onChange={e => setSocialInstagram(e.target.value)}
                                                placeholder="https://instagram.com/..."
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Linkedin className="w-4 h-4 text-brand-teal" />
                                                <Label htmlFor="linkedin">LinkedIn URL</Label>
                                            </div>
                                            <Input
                                                id="linkedin"
                                                value={socialLinkedin}
                                                onChange={e => setSocialLinkedin(e.target.value)}
                                                placeholder="https://linkedin.com/in/..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-border/40">
                                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Settings</h3>
                                    <div className="flex gap-6">
                                        <div className="flex-1 space-y-1.5">
                                            <Label htmlFor="displayOrder">Display Order</Label>
                                            <Input
                                                id="displayOrder"
                                                type="number"
                                                value={displayOrder}
                                                onChange={e => setDisplayOrder(parseInt(e.target.value) || 0)}
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
                                                    <div className={`block w-14 h-8 rounded-full transition-colors ${isActive ? 'bg-primary' : 'bg-gray-600'}`} />
                                                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isActive ? 'translate-x-6' : ''}`} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">Active Member</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border/40 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-dark py-4 transition-colors duration-300">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleCloseEditor}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Member'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Team Member</DialogTitle>
                    </DialogHeader>
                    {deleteTarget && (
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
                            </p>
                            <div className="rounded-lg border border-border/40 bg-muted/50 p-4 space-y-1 text-sm">
                                <p><span className="font-medium">Name:</span> {deleteTarget.name}</p>
                                <p><span className="font-medium">Position:</span> {deleteTarget.position_en || '-'}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => deleteTarget && handleDelete(deleteTarget.id)}>
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <ImagePicker
                isOpen={isImagePickerOpen}
                onClose={() => setIsImagePickerOpen(false)}
                onSelect={handleImageSelect}
                multiple={false}
            />
        </div>
    );
}
