import type { MetadataRoute } from "next";
import { site, videoShowcase } from "@/content/site";

/**
 * Só URLs públicas, canônicas e indexáveis. Hoje: a página principal e a página de parceiros.
 * As imagens e o vídeo são fotos/vídeo reais do fred.o (sitemap de imagens e de vídeo do Google).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const u = site.url;
  return [
    {
      url: u,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [
        `${u}/fredo/fredo-estudio-claro.jpg`,
        `${u}/fredo/telas/fredo-tela-balanca.webp`,
        `${u}/fredo/telas/fredo-tela-comanda.webp`,
        `${u}/fredo/telas/fredo-tela-processando.webp`,
        `${u}/fredo/telas/fredo-tela-concluido.webp`,
      ],
      videos: [
        {
          title: "fred.o em ação: pesagem autônoma no self-service",
          description:
            "Vídeo oficial do fred.o: o cliente pesa o prato, o fred.o lê o peso, pede para bipar a comanda e envia o valor para o caixa integrado ao PDV.",
          thumbnail_loc: `${u}${videoShowcase.poster}`,
          content_loc: `${u}${videoShowcase.src}`,
          duration: 19,
          publication_date: "2026-11-07",
          family_friendly: "yes",
        },
      ],
    },
    {
      url: `${u}/fredo/parceiro`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
