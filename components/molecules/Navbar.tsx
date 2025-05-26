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
            </div>
            <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                    <>
                        <Link href="/user">
                            <span className="text-gray-700 hover:text-blue-600 cursor-pointer">
                                {(session?.user as any)?.login || 'User'}
                            </span>
                        </Link>
                        <Link href="/prompt/add">
                            <Button variant="secondary">Add Prompt</Button>
                        </Link>
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