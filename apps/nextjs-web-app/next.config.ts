import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io"
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh"
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com"
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      },
      {
        protocol: "https",
        hostname: "x4d3bo63jl.ufs.sh"
      }
    ]
  },
  output: "standalone"
};

export default nextConfig;
