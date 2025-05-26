'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/components';
import { Button } from '@/components';

interface Prompt {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    user: {
        login: string;
        id: string;
    };
}

export default function AllPromptsPage() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        fetchPrompts();
    }, [page]);

    const fetchPrompts = async () => {
        try {
            setIsLoadingMore(true);
            const response = await fetch(`/api/prompts?page=${page}&limit=10`);
            if (!response.ok) {
                throw new Error('Failed to fetch prompts');
            }
            const data = await response.json();
            
            if (page === 1) {
                setPrompts(data.prompts);
            } else {
                setPrompts(prev => [...prev, ...data.prompts]);
            }
            
            setHasMore(data.hasMore);
        } catch (err) {
            setError('Failed to load prompts');
            console.error('Error fetching prompts:', err);
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    };

    const loadMore = () => {
        setPage(prev => prev + 1);
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">All Prompts</h1>
            
            {prompts.length === 0 ? (
                <div className="text-center text-gray-600">
                    No prompts found.
                </div>
            ) : (
                <div className="space-y-6">
                    {prompts.map((prompt) => (
                        <div key={prompt.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Link href={`/prompt/${prompt.id}`}>
                                        <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800 mb-2">
                                            {prompt.title}
                                        </h2>
                                    </Link>
                                    <p className="text-gray-600 mb-4">{prompt.description}</p>
                                    <div className="text-sm text-gray-500">
                                        <span>By {prompt.user.login}</span>
                                        <span className="mx-2">•</span>
                                        <span>Created: {new Date(prompt.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {hasMore && (
                <div className="mt-8 text-center">
                    <Button
                        variant="secondary"
                        onClick={loadMore}
                        disabled={isLoadingMore}
                    >
                        {isLoadingMore ? 'Loading...' : 'Load More'}
                    </Button>
                </div>
            )}
        </div>
    );
} 