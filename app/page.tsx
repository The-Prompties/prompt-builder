// app/page.tsx
import { Button } from '@/components';
import { Link } from '@/components';

export default function HomePage() {
    // Placeholder for gallery images
    const galleryImages = [
        '/gallery/img1.jpg',
        '/gallery/img2.jpg',
        '/gallery/img3.jpg',
        // Add more image paths
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className="text-center my-16">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                    Generate Content On Demand Using AI
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    Turn your ideas into stunning visuals and text effortlessly.
                </p>
                <div className="mt-8 space-x-4">
                    <Link href="/order">
                        <Button variant="primary" size="lg">Start an Order</Button> {/* Assuming Button supports size */}
                    </Link>
                    {/* Maybe another button like "Learn More" */}
                </div>
            </section>

            {/* Gallery Section */}
            <section className="my-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Our Work
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryImages.map((src, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg shadow-lg">
                            <img
                                src={src}
                                alt={`Gallery image ${index + 1}`}
                                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                    ))}
                </div>
                {galleryImages.length === 0 && (
                    <p className="text-center text-gray-600">No gallery images yet. Check back later!</p>
                )}
            </section>

            {/* Footer is handled by the layout */}
        </div>
    );
}