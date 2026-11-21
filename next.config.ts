import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Pre-Book (October 31) has ended. Any printed QR codes or saved links
      // to /prebook land on the homepage instead of a 404.
      { source: "/prebook", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
