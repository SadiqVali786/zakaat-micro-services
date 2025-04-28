import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io"
        // port: ""
        // pathname: "**"
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
      }
    ]
  },
  output: "standalone"
  // experimental: {
  //   serverActions: {
  //     allowedOrigins: ["localhost:3000", "192.168.1.7:3000"]
  //   }
  // },
  // env: {
  //   NEXTAUTH_URL: process.env.NEXTAUTH_URL
  // }
};

export default nextConfig;
