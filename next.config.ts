import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            new URL('https://res.cloudinary.com/**'),
            new URL('http://res.cloudinary.com/**')
        ]
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '30mb'
        }
    }
};

export default nextConfig;
