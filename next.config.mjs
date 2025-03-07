/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  webpack(config, { isServer }) {
    if (!isServer) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      });
    }
    return config;
  },
};

export default nextConfig;
