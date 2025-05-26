// app/signup/page.tsx
"use client"; // Mark as Client Component

import { useState } from 'react';
import { Button, FormField, Link } from '@/components';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SignUpPage() {
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

        if (!formData.login || !formData.password) {
            setError('Login and password are required.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Check for specific Prisma errors (e.g., unique constraint failed)
                if (response.status === 409) { // Use 409 for conflict (e.g., login already exists)
                    setError(errorData.error || 'Login already exists.');
                } else {
                    throw new Error(errorData.error || 'Registration failed');
                }
                return;
            }

            const result = await signIn('credentials', {
                login: formData.login,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push('/prompts');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"> {/* Adjust height as needed */}
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <FormField
                        label="Login"
                        name="login"
                        type="text"
                        value={formData.login}
                        onChange={handleChange}
                    />
                    <FormField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </Button>
                </form>

                <p className="text-center mt-4 text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/signin">Login</Link>
                </p>
            </div>
        </div>
    );
}