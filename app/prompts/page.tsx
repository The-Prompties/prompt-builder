'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import PromptList from '../components/PromptList';
import CreatePromptForm from '../components/CreatePromptForm';

export default function PromptsPage() {
  const { data: session } = useSession();
  const [key, setKey] = useState(0);

  const handlePromptCreated = () => {
    setKey(prev => prev + 1);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Please sign in to access prompts
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
            Prompts
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Create and manage your prompts
          </p>
        </div>

        <div className="mb-12">
          <CreatePromptForm onPromptCreated={handlePromptCreated} />
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Prompts</h3>
          <PromptList key={key} />
        </div>
      </div>
    </div>
  );
} 