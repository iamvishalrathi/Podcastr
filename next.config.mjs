/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        // Enable ESLint
        ignoreDuringBuilds: true, // Ignore ESLint during production builds
        dirs: ['app', 'components'], // Specify the directories to lint
    },
    images: {
        domains: ['https://podcastr-two-rho.vercel.app'],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lovely-flamingo-139.convex.cloud'
            },
            {
                protocol: 'https',
                hostname: 'mild-aardvark-482.convex.cloud'
            },
            {
                protocol: 'https',
                hostname: 'img.clerk.com'
            },
        ]
    }
};

export default nextConfig;
