'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components';

interface Prompt {
    id: number;
    title: string;
    description: string;
    content: string;
}

export default function EditPromptPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchPrompt = async () => {
            try {
                const response = await fetch(`/api/prompts/${resolvedParams.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch prompt');
                }
                const data = await response.json();
                setPrompt(data);
                setTitle(data.title);
                setDescription(data.description);
                setContent(data.content);
            } catch (error) {
                console.error('Error fetching prompt:', error);
                setError('Failed to load prompt');
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchPrompt();
        }
    }, [resolvedParams.id, session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;

        setIsSubmitting(true);
        setError(null);
        try {
            const response = await fetch(`/api/prompts/${resolvedParams.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    content,
                }),
            });

            if (response.ok) {
                router.push('/user/prompts');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to update prompt');
            }
        } catch (error) {
            console.error('Error updating prompt:', error);
            setError('An error occurred while updating the prompt');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!session) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Please sign in to edit prompts
                        </h2>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Loading...
                        </h2>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-red-600 sm:text-4xl">
                            {error}
                        </h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Edit Prompt
                    </h2>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Update your prompt
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <input
                                type="text"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                Content
                            </label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={6}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => router.push('/user/prompts')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                variant="primary"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 