import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    eslint: {
        // 忽略构建阶段的 ESLint 错误（例如在 Vercel 构建时不因 ESLint 报错而失败）
        ignoreDuringBuilds: true,
    },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.pexels.com",
            },
            {
                protocol: "https",
                hostname: "img.clerk.com",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
    },
};

export default nextConfig;
