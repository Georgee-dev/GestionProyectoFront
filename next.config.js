/** @type {import('next').NextConfig} */
const nextConfig = {
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost/GestionProyectoAPI/:path*',
      },
    ];
  },
  
  reactStrictMode: true,
};

module.exports = nextConfig;