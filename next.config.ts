import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Endereço antigo da Vercel → domínio oficial (evita conteúdo duplicado no Google).
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "fredo-site-one.vercel.app" }],
        destination: "https://jiltech.com.br/:path*",
        permanent: true,
      },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
