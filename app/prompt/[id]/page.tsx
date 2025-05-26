'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components';
import { useRouter } from 'next/navigation';

interface Prompt {
    id: number;
    title: string;
    description: string;
    content: string;
    createdAt: string;
    userId: string;
    user: {
        login: string;
        id: string;
    };
}

export default function PromptDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
            } catch (error) {
                console.error('Error fetching prompt:', error);
                setError('Failed to load prompt');
            } finally {
                setLoading(false);
            }
        };

        fetchPrompt();
    }, [resolvedParams.id]);

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

    if (error || !prompt) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-red-600 sm:text-4xl">
                            {error || 'Prompt not found'}
                        </h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">{prompt.title}</h1>
                        {session?.user?.id === prompt.userId && (
                            <Button
                                variant="secondary"
                                onClick={() => router.push(`/prompt/edit/${prompt.id}`)}
                            >
                                Edit Prompt
                            </Button>
                        )}
                    </div>
                    
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Description</h2>
                        <p className="text-gray-600">{prompt.description}</p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Content</h2>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <pre className="whitespace-pre-wrap text-gray-800">{prompt.content}</pre>
                        </div>
                    </div>

                    <div className="border-t pt-4 mt-6">
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Created by: {prompt.user.login}</span>
                            <span>Created: {new Date(prompt.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 