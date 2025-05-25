// app/order/page.tsx
"use client"; // Mark as Client Component

import { useState } from 'react';
import { Button, FormField } from '@/components';
import { useRouter } from 'next/navigation';

export default function AddPromptPage() {
    const [formData, setFormData] = useState({ theme: '', description: '', referenceFile: '' });
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const themes = ['generate logo', 'make visualization']; // Define allowed themes

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null); // Clear error on input change
        setSuccessMessage(null); // Clear success on input change
    };

    // Handle Select change (for theme) - Need a Select component or use plain select
    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, theme: e.target.value });
        setError(null);
        setSuccessMessage(null);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (!formData.theme || !formData.description) {
            setError('Theme and description are required.');
            setLoading(false);
            return;
        }

        if (!themes.includes(formData.theme)) {
            setError('Invalid theme selected.');
            setLoading(false);
            return;
        }


        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create order');
            }

            // Optionally get the created order details
            const createdOrder = await response.json();

            setSuccessMessage('Order placed successfully!');
            setFormData({ theme: '', description: '', referenceFile: '' }); // Clear form
            // Optionally redirect to user panel or order details page
            // router.push('/user');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"> {/* Adjust height */}
            <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Place New Order</h2>
                <form onSubmit={handleSubmit}>
                    {/* Theme Select */}
                    <div className="mb-4">
                        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                            Theme
                        </label>
                        <select
                            id="theme"
                            name="theme"
                            value={formData.theme}
                            onChange={handleThemeChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select a theme</option>
                            {themes.map(theme => (
                                <option key={theme} value={theme}>{theme}</option>
                            ))}
                        </select>
                    </div>


                    {/* Description Textarea */}
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>


                    {/* Reference File (Simplified Input) */}
                    <FormField
                        label="Reference File (Optional URL/Path)"
                        name="referenceFile"
                        type="text" // Or type="file" with more complex handling
                        value={formData.referenceFile}
                        onChange={handleChange}
                    />

                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                    {successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}


                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </Button>
                </form>
            </div>
        </div>
    );
}