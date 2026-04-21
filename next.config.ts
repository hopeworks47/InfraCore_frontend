import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['198.18.0.73'],  
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;