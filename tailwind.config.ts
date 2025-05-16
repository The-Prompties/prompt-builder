// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config = { // No explicit type annotation here
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // Add custom theme configurations here if needed
        },
    },
    plugins: [],
} satisfies Config; // Use 'satisfies' to check against the type

export default config;