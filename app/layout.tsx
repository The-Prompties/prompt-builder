// app/layout.tsx
import './global.css'; // Import Tailwind CSS
import { Navbar } from '@/components'; // Use alias if configured or relative path
import { Footer } from '@/components'; // Use alias

export const metadata = {
    title: 'Promptie',
    description: 'Generate content on demand using AI',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
            {children}
        </main>
        <Footer />
        </body>
        </html>
    );
}