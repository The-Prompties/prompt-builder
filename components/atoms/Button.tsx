// components/atoms/Button.tsx
import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
    const baseStyles = 'px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50';
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };
    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};