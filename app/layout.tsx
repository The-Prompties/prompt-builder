import './global.css';
import { Navbar } from '@/components';
import { Footer } from '@/components';
import { Providers } from './providers';

export const metadata = {
    title: 'Prompt Builder',
    description: 'Your prompt database',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="flex flex-col min-h-screen">
            <Providers>
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    {children}
                </main>
                <Footer />
            </Providers>
        </body>
        </html>
    );
}