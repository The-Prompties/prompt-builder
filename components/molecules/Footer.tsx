// components/molecules/Footer.tsx
import * as React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white p-6 text-center mt-auto">
            <p>&copy; {new Date().getFullYear()} Prompt Builder. All rights reserved.</p>
        </footer>
    );
};