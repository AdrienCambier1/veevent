import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration des images
  images: {
    domains: [
      "lh3.googleusercontent.com", // Images de profil Google
      "lh4.googleusercontent.com",
      "lh5.googleusercontent.com",
      "lh6.googleusercontent.com",
      "res.cloudinary.com",
      "example.com", // Images de test
    ],
    formats: ["image/webp", "image/avif"],
    // Configuration pour les images distantes avec patterns
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh*.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "graph.facebook.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Configuration Sass
  sassOptions: {
    includePaths: ["./src/assets/styles"],
  },

  // Configuration webpack pour les SVG
  webpack: (config, { dev }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    if (dev) {
      // Optimiser la résolution des modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

      // Optimiser les watchOptions pour macOS
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ["**/node_modules", "**/.git", "**/.next"],
      };
    }

    return config;
  },

  // Configuration expérimentale
  experimental: {
    // Réactiver le worker webpack pour améliorer les performances
    webpackBuildWorker: true,
    // Optimisations de compilation
    optimizePackageImports: [
      "iconoir-react",
      "framer-motion",
      "@fortawesome/fontawesome-svg-core",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/free-brands-svg-icons",
      "swiper",
      "embla-carousel-react",
    ],
  },

  // Configuration Turbopack (stable)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Optimisations de production
  poweredByHeader: false,
  compress: true,

  // Configuration des en-têtes de sécurité
  async headers() {
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
          {
            key: "Content-Security-Policy",
            value:
              `default-src 'self' https://maps.googleapis.com https://maps.gstatic.com; ` +
              `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com; ` +
              `style-src 'self' 'unsafe-inline'; ` +
              `img-src 'self' data: blob: https:; ` +
              `font-src 'self' data:; ` +
              `connect-src 'self' http://localhost:* https://localhost:* ws://localhost:* wss://localhost:* https://maps.googleapis.com https://maps.googleapis.com https://maps.gstatic.com https://veevent-backend.onrender.com;`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
