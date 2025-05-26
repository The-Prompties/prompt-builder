// app/page.tsx
'use client';

import { Button } from '@/components';
import { Link } from '@/components';
import { useEffect, useState } from 'react';

interface Prompt {
    id: number;
    title: string;
    description: string;
    user: {
        login: string;
    };
}

export default function HomePage() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const response = await fetch('/api/prompts/latest');
                if (!response.ok) {
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
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="text-center my-16">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                    Your prompt database
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    Feel free to use it on your own
                </p>
                <div className="mt-8 space-x-4">
                    <Link href="/order">
                        <Button variant="primary">Look for prompt</Button>
                    </Link>
                </div>
            </section>

            <section className="my-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Newest prompts
                </h2>
                {loading ? (
                    <div className="text-center text-gray-600">Loading prompts...</div>
                ) : error ? (
                    <div className="text-center text-red-600">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {prompts.map((prompt) => (
                            <div key={prompt.id} className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow">
                                <h3 className="text-xl font-semibold text-blue-600 mt-4">
                                    {prompt.title}
                                </h3>
                                <p className="text-gray-700 mt-2 line-clamp-3">
                                    {prompt.description}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Author: {prompt.user.login}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
                {!loading && !error && prompts.length === 0 && (
                    <p className="text-center text-gray-600">No prompts available yet. Check back later!</p>
                )}
            </section>

            <section className="my-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Most popular prompts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {prompts.map((prompt) => (
                        <div key={prompt.id} className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-semibold text-blue-600 mt-4">
                                {prompt.title}
                            </h3>
                            <p className="text-gray-700 mt-2 line-clamp-3">
                                {prompt.description}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Author: {prompt.user.login}
                            </p>
                        </div>
                    ))}
                </div>
                {prompts.length === 0 && (
                    <p className="text-center text-gray-600">No prompts available yet. Check back later!</p>
                )}
            </section>
        </div>
    );
}