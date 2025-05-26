// app/user/page.tsx
"use client"; // Mark as Client Component

import { useEffect, useState } from 'react';
import { Link } from '@/components';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { useSession } from 'next-auth/react';

interface Order {
    id: number;
    theme: string;
    description: string;
    createdAt: string; // API will return Date as string
}

interface UserStats {
    promptCount: number;
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<Order[] | null>(null); // null initially, then array or empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<UserStats>({ promptCount: 0 });
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/user/orders'); // Fetch user's orders

                if (response.status === 401) { // Not authenticated
                    router.push('/signin?message=Please login to view your orders.'); // Redirect to login
                    return;
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch orders');
                }

                const data = await response.json();
                setOrders(data.orders);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchStats = async () => {
            try {
                const response = await fetch('/api/user/stats');
                if (!response.ok) {
                    throw new Error('Failed to fetch stats');
                }
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchOrders();
        fetchStats();
    }, [router]); // Re-run effect if router changes (though unlikely here)

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">Error: {error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Hello, {(session?.user as any)?.login || 'User'}!
                </h2>
                <p className="text-gray-600">
                    You have created {stats.promptCount} prompts so far.
                </p>
            </div>
        </div>
    );
}