// components/atoms/Link.tsx
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import * as React from 'react';

interface LinkProps extends NextLinkProps {
    children: React.ReactNode;
    className?: string;
}

export const Link: React.FC<LinkProps> = ({ children, className, ...props }) => {
    return (
        <NextLink className={`text-blue-600 hover:underline ${className}`} {...props}>
            {children}
        </NextLink>
    );
};