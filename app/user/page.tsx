// app/user/page.tsx
"use client"; // Mark as Client Component

import { useEffect, useState } from 'react';
import { Link } from '@/components';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';

interface Order {
    id: number;
    theme: string;
    description: string;
    createdAt: string; // API will return Date as string
}


export default function UserPanelPage() {
    const [orders, setOrders] = useState<Order[] | null>(null); // null initially, then array or empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

        fetchOrders();
    }, [router]); // Re-run effect if router changes (though unlikely here)


    if (loading) {
        return <div className="text-center text-gray-600">Loading orders...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">Error: {error}</div>;
    }


    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Orders</h1>

            {orders && orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-4 rounded shadow-md">
                            <h2 className="text-xl font-semibold text-blue-600">{order.theme}</h2>
                            <p className="text-gray-700 mt-2">{order.description}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            {/* Optionally add a link to view order details if you create a details page */}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-600 p-8 border border-gray-200 rounded">
                    <p className="text-lg mb-4">No orders placed yet.</p>
                    <Link href="/order">
                        <Button variant="primary">Place Your First Order</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}