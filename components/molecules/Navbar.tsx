'use client';

import * as React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Logo } from '../atoms/Logo';
import { Button } from '../atoms/Button';
import { Link } from '../atoms/Link';

export const Navbar: React.FC = () => {
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';

    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <Logo />
                {isAuthenticated && (
                    <Link href="/prompts">
                        <Button variant="secondary">Prompts</Button>
                    </Link>
                )}
            </div>
            <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                    <>
                        <span className="text-gray-700">
                            Welcome, {(session?.user as any)?.login || 'User'}
                        </span>
                        <Button 
                            variant="primary" 
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            Sign Out
                        </Button>
                    </>
                ) : (
                    <>
                        <Link href="/signin">
                            <Button variant="primary">Login</Button>
                        </Link>
                        <Link href="/signup">
                            <Button variant="secondary">Sign Up</Button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};