'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Link } from '@/components';

export default function UserPanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div className="text-center p-4">Loading...</div>;
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 min-h-screen bg-white shadow-md">
                    <div className="p-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">User Panel</h2>
                        <nav className="space-y-2">
                            <Link href="/user" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                                Dashboard
                            </Link>
                            <Link href="/user/prompts" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                                My Prompts
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    {children}
                </div>
            </div>
        </div>
    );
} 