'use client';

import { useState, useEffect } from 'react';

interface Review {
    id: string;
    author_name: string;
    rating: number;
    title: string | null;
    text: string;
    created_at: string;
}

interface ReviewStats {
    average: number;
    count: number;
}

interface ReviewsProps {
    tourId: string;
    initialStats?: ReviewStats;
}

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
    const sizeClass = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    return (
        <div className={`flex ${sizeClass} gap-0.5`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={star <= rating ? 'text-yellow-400' : 'text-gray-600'}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l.09.15a1 1 0 11-1.14 1.11l-.142-.15a.97.97 0 00-.28-.05 9.002 9.002 0 00-3.58 0 1 1 0 00-.28.05l-.142.15a1 1 0 11-1.14-1.11l.09-.15c.3-.921 1.603-.921 1.902 0zM12 5.5a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 0112 5.5zM9 10a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1zm5 0a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1zM6.75 14a1 1 0 00-1 1v2.25a2.5 2.5 0 005 0V15a1 1 0 001 1h-4zm-2-6a1 1 0 011-1h1.5a1 1 0 110 2H7.75a1 1 0 01-1-1z" />
                </svg>
            ))}
        </div>
    );
}

function ReviewCard({ review }: { review: Review }) {
    const date = new Date(review.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-brand-orange flex items-center justify-center text-white font-bold text-sm">
                        {review.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-white font-medium">{review.author_name}</p>
                        <p className="text-gray-500 text-xs">{date}</p>
                    </div>
                </div>
                <StarRating rating={review.rating} size="sm" />
            </div>
            {review.title && (
                <h4 className="text-white font-semibold mb-2">{review.title}</h4>
            )}
            <p className="text-gray-300 text-sm leading-relaxed">{review.text}</p>
        </div>
    );
}

export default function TourReviews({ tourId, initialStats }: ReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats>(initialStats || { average: 0, count: 0 });
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        author_name: '',
        author_email: '',
        rating: 5,
        title: '',
        text: '',
    });

    useEffect(() => {
        fetchReviews();
    }, [tourId]);

    async function fetchReviews() {
        try {
            const res = await fetch(`/api/reviews?tour_id=${tourId}&limit=6`);
            const data = await res.json();
            if (data.reviews) {
                setReviews(data.reviews);
                setStats(data.stats);
            }
        } catch (e) {
            console.error('Failed to fetch reviews:', e);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, tour_id: tourId }),
            });

            if (res.ok) {
                setSubmitted(true);
            }
        } catch (e) {
            console.error('Failed to submit review:', e);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-white/5 rounded w-32 mb-4"></div>
                <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
                <svg className="w-12 h-12 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-white font-bold text-lg mb-2">Thank You!</h3>
                <p className="text-gray-300">Your review has been submitted and will be published after moderation.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <StarRating rating={Math.round(stats.average)} size="lg" />
                        <span className="text-2xl font-bold text-white">{stats.average.toFixed(1)}</span>
                        <span className="text-gray-400">({stats.count} reviews)</span>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="text-brand-orange hover:text-white text-sm font-medium transition-colors"
                >
                    Write a Review
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                    <h3 className="text-white font-bold mb-4">Share Your Experience</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Your Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.author_name}
                                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Email (optional)</label>
                            <input
                                type="email"
                                value={formData.author_email}
                                onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm mb-2">Your Rating *</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className="transition-transform hover:scale-110"
                                >
                                    <svg
                                        className={`w-8 h-8 ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l.09.15a1 1 0 11-1.14 1.11l-.142-.15a.97.97 0 00-.28-.05 9.002 9.002 0 00-3.58 0 1 1 0 00-.28.05l-.142.15a1 1 0 11-1.14-1.11l.09-.15c.3-.921 1.603-.921 1.902 0z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm mb-1">Review Title (optional)</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                            placeholder="Amazing adventure!"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm mb-1">Your Review *</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none resize-none"
                            placeholder="Tell us about your experience..."
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-primary to-brand-orange text-white font-bold py-3 rounded-lg hover:shadow-[0_0_30px_rgba(220,53,34,0.4)] transition-all disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            )}

            {reviews.length > 0 ? (
                <div className="grid gap-4">
                    {reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border border-dashed border-white/20 rounded-xl">
                    <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-gray-400">No reviews yet. Be the first to share your experience!</p>
                </div>
            )}
        </div>
    );
}