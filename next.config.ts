import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
      {
        hostname: "gautam-blogs.s3.amazonaws.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
