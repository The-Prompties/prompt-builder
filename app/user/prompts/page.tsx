'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/components';
import { Button } from '@/components';
import { useSession } from 'next-auth/react';
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

export default function MyPromptsPage() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push('/auth/signin');
            return;
        }

        const fetchPrompts = async () => {
            try {
                const response = await fetch('/api/user/prompts');
                if (!response.ok) {
                    if (response.status === 401) {
                        router.push('/auth/signin');
                        return;
                    }
                    throw new Error('Failed to fetch prompts');
                }
                const data = await response.json();
                setPrompts(data);
            } catch (err) {
                setError('Failed to load prompts');
                console.error('Error fetching prompts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPrompts();
    }, [session, router]);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Prompts</h1>
            {prompts.length === 0 ? (
                <div className="text-center text-gray-600">
                    You haven't created any prompts yet.
                </div>
            ) : (
                <div className="grid gap-6">
                    {prompts.map((prompt) => (
                        <div key={prompt.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold text-blue-600 mb-2">
                                        {prompt.title}
                                    </h2>
                                    <p className="text-gray-600 mb-4">{prompt.description}</p>
                                    <div className="text-sm text-gray-500">
                                        Created: {new Date(prompt.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <Link href={`/prompt/edit/${prompt.id}`}>
                                    <Button variant="secondary" className="text-sm px-3 py-1">
                                        Edit
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 