/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/ui/s3",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
