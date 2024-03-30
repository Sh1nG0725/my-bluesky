/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["cdn.bsky.app"],
        formats: ["image/webp"],
    },
};

module.exports = nextConfig;
