/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration des images
  images: {
    domains: [],
    formats: ["image/webp", "image/avif"],
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
};

module.exports = nextConfig;
