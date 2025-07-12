/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "upload.wikimedia.org",
      },
      {
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
