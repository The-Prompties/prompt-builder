/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
        // Add this configuration to exclude problematic packages
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                os: false,
                net: false,
                tls: false,
                child_process: false,
            };

            // Exclude the node-pre-gyp module from client-side bundling
            config.module.rules.push({
                test: /node_modules\/@mapbox\/node-pre-gyp/,
                use: 'null-loader',
            });
        }

        return config;
    },
};

module.exports = nextConfig;