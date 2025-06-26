/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'localhost',
    ],
  },
  // Désactiver les fonctionnalités expérimentales qui causent des problèmes
  experimental: {
    // Aucune option expérimentale pour le moment
  }
}

module.exports = nextConfig 