import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['198.18.1.110'],  
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
        hostname: "198.18.1.110",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;