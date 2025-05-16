// components/atoms/Logo.tsx
import * as React from 'react';
import { Link } from './Link';

export const Logo: React.FC = () => {
    return (
        <Link href="/" className="text-xl font-bold text-blue-600 hover:no-underline">
            Promptie
        </Link>
    );
};