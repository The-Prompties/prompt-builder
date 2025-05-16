// app/signin/page.tsx
"use client"; // Mark as Client Component

import { useState } from 'react';
import { Button, FormField, Link } from '@/components';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
    const [formData, setFormData] = useState({ login: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null); // Clear error on input change
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            // Handle successful login (e.g., store token/session info - SIMPLIFIED for demo)
            // In a real app, you'd handle session cookies or tokens here.
            // For this demo, we'll just redirect on success.
            router.push('/user'); // Redirect to user panel

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"> {/* Adjust height as needed */}
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <FormField
                        label="Login"
                        name="login"
                        type="text"
                        value={formData.login}
                        onChange={handleChange}
                        // error={...} // Add validation errors if needed
                    />
                    <FormField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        // error={...} // Add validation errors if needed
                    />

                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <p className="text-center mt-4 text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}