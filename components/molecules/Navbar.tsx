// components/molecules/Navbar.tsx
import * as React from 'react';
import { Logo } from '../atoms/Logo';
import { Button } from '../atoms/Button';
import { Link } from '../atoms/Link';

// This component might need state/context later to show Sign Out vs Login/Order
export const Navbar: React.FC = () => {
    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <div>
                <Logo />
            </div>
            <div className="flex items-center space-x-4">
                <Link href="/order">
                    <Button variant="secondary">Order</Button>
                </Link>
                {/* In a real app, show Login/Signup or Logout based on auth state */}
                <Link href="/signin">
                    <Button variant="primary">Login</Button>
                </Link>
            </div>
        </nav>
    );
};