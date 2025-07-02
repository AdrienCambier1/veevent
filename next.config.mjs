/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration des images
  images: {
    domains: [
      'lh3.googleusercontent.com', // Images de profil Google
      'lh4.googleusercontent.com',
      'lh5.googleusercontent.com',
      'lh6.googleusercontent.com',
      'graph.facebook.com', // Images de profil Facebook
      'platform-lookaside.fbsbx.com',
      'images.unsplash.com', // Images Unsplash
      'via.placeholder.com', // Images de placeholder
      'picsum.photos', // Images Lorem Picsum
      'cdn.pixabay.com', // Images Pixabay
      'images.pexels.com', // Images Pexels
    ],
    formats: ["image/webp", "image/avif"],
    // Configuration pour les images distantes avec patterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh*.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'graph.facebook.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Configuration Sass
  sassOptions: {
    includePaths: ["./src/assets/styles"],
  },

  // Configuration webpack pour les SVG
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // TEMPORAIRE : Désactiver le cache pour résoudre le problème
    // config.cache = false;

    return config;
  },

  // Configuration expérimentale
  experimental: {
    optimizePackageImports: ["iconoir-react"],
    // Désactiver le worker webpack temporairement
    // webpackBuildWorker: false,
  },

  // Optimisations de production
  poweredByHeader: false,
  compress: true,

  // Configuration des en-têtes de sécurité
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // CSP très permissif en développement pour résoudre le problème
          ...(isDevelopment ? [{
            key: "Content-Security-Policy",
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src 'self' http://localhost:* https://localhost:* ws://localhost:* wss://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:;",
          }] : []),
        ],
      },
    ];
  },
};

export default nextConfig;
