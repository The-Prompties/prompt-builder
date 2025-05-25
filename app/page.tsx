// app/page.tsx
import { Button } from '@/components';
import { Link } from '@/components';

export default function HomePage() {
    const promptsExamples = [
        {
            title: "Prompt title 1",
            description: "Prompt description 1",
            author: "Author name 1"
        },
        {
            title: "Prompt title 2",
            description: "Prompt description 2",
            author: "Author name 2"
        },
        {
            title: "Prompt title 3",
            description: "Prompt description 3",
            author: "Author name 3"
        },
        {
            title: "Prompt title 4",
            description: "Prompt description 4",
            author: "Author name 4"
        },
        {
            title: "Prompt title 5",
            description: "Prompt description 5",
            author: "Author name 5"
        },
        {
            title: "Prompt title 6",
            description: "Prompt description 6",
            author: "Author name 6"
        },
        {
            title: "Prompt title 7",
            description: "Prompt description 7",
            author: "Author name 7"
        },
        {
            title: "Prompt title 8",
            description: "Prompt description 8",
            author: "Author name 8"
        },
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className="text-center my-16">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                    Your prompt database
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    Feel free to use it on your own
                </p>
                <div className="mt-8 space-x-4">
                    <Link href="/order">
                        <Button variant="primary">Look for prompt</Button> {/* Assuming Button supports size */}
                    </Link>
                </div>
            </section>

            <section className="my-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Newest prompts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {promptsExamples.map((prompt, index) => (
                        <div key={index} className="bg-white p-4 rounded shadow-md">
                            <h3 className="text-xl font-semibold text-blue-600 mt-4">
                                {prompt.title || 'Prompt title'}
                            </h3>
                            <p className="text-gray-700 mt-2">
                                {prompt.description || 'Prompt description'}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Author: {prompt.author || 'Author name'}
                            </p>
                        </div>
                    ))}
                </div>
                {promptsExamples.length === 0 && (
                    <p className="text-center text-gray-600">No gallery images yet. Check back later!</p>
                )}
            </section>

            <section className="my-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Most popular prompts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {promptsExamples.map((prompt, index) => (
                        <div key={index} className="bg-white p-4 rounded shadow-md">
                            <h3 className="text-xl font-semibold text-blue-600 mt-4">
                                {prompt.title || 'Prompt title'}
                            </h3>
                            <p className="text-gray-700 mt-2">
                                {prompt.description || 'Prompt description'}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Author: {prompt.author || 'Author name'}
                            </p>
                        </div>
                    ))}
                </div>
                {promptsExamples.length === 0 && (
                    <p className="text-center text-gray-600">No gallery images yet. Check back later!</p>
                )}
            </section>
        </div>
    );
}