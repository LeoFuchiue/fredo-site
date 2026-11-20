import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Endereço antigo da Vercel → domínio oficial (evita conteúdo duplicado no Google).
  async redirects() {
    return [
      // Atalhos para a página de parceiros.
      { source: "/parceiro", destination: "/fredo/parceiro", permanent: true },
      { source: "/fredo", destination: "/fredo/parceiro", permanent: false },
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
