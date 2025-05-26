'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Prompt {
  id: number;
  title: string;
  description: string;
  content: string;
  createdAt: string;
  userId: string;
}

export default function PromptList() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    const fetchPrompts = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        console.log('Session state:', { session, status });

        const response = await fetch('/api/prompts', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched prompts:', data);
          setPrompts(data);
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch prompts:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          });
          setError(errorData.error || 'Failed to fetch prompts');
        }
      } catch (error) {
        console.error('Error fetching prompts:', error);
        setError('Error fetching prompts');
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [isAuthenticated, session]);

  if (status === 'loading') {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div className="text-center p-4">Please sign in to view prompts</div>;
  }

  if (loading) {
    return <div className="text-center p-4">Loading prompts...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  if (prompts.length === 0) {
    return <div className="text-center p-4">No prompts found. Create your first one!</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt) => (
        <div key={prompt.id} className="p-4 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">{prompt.title}</h3>
          <p className="text-gray-600 mb-2">{prompt.description}</p>
          <p className="text-sm text-gray-500">
            Created: {new Date(prompt.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
} 