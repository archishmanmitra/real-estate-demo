import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  distDir: "out",
  // ❌ remove these two lines — only needed for GitHub Pages subdirectory hosting
  // basePath: "/real-estate-demo",
  // assetPrefix: "/real-estate-demo",
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  experimental: {
    optimizePackageImports: ["gsap"],
  },
};

export default config;
