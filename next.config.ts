import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["image.tmdb.org", "placehold.co"], // Add the domain here
    dangerouslyAllowSVG: true,
  },

  dangerouslyAllowSVG: true
};

export default nextConfig;
