import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { Hiring } from "@/components/sections/hiring";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Integration } from "@/components/sections/integration";
import { Pillars } from "@/components/sections/pillars";
import { VideoShowcase } from "@/components/sections/video-showcase";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { site, videoShowcase } from "@/content/site";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/**
 * Dados estruturados (Schema.org) — só informações confirmadas.
 * Sem Product: o Google exige preço, avaliação ou nota para esse tipo,
 * e nenhum desses dados existe/está confirmado. Sem LocalBusiness: não há
 * endereço de atendimento confirmado.
 */
const url = site.url;
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${url}/#organization`,
      name: site.name,
      url,
      logo: { "@type": "ImageObject", url: `${url}/logo-fredo.png`, width: 512, height: 512 },
      slogan: "Rapidez. Precisão. Economia.",
      description: site.description,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: WHATSAPP_DISPLAY.replace(/\s/g, "-"), // +55-11-97784-2164
        availableLanguage: ["Portuguese"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${url}/#website`,
      url,
      name: site.name,
      description: site.description,
      inLanguage: "pt-BR",
      publisher: { "@id": `${url}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${url}/#webpage`,
      url,
      name: site.title,
      description: site.description,
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${url}/#website` },
      about: { "@id": `${url}/#organization` },
      primaryImageOfPage: { "@type": "ImageObject", url: `${url}/fredo/fredo-estudio-claro.jpg` },
      video: { "@id": `${url}/#video` },
    },
    {
      "@type": "VideoObject",
      "@id": `${url}/#video`,
      name: "Fred.o em ação: pesagem autônoma no self-service",
      description:
        "Vídeo oficial do Fred.o: o cliente pesa o prato, o Fred.o lê o peso, pede para bipar a comanda e envia o valor para o caixa integrado ao PDV.",
      thumbnailUrl: [`${url}${videoShowcase.poster}`],
      contentUrl: `${url}${videoShowcase.src}`,
      uploadDate: "2026-11-07",
      duration: "PT19S", // 18,5 s
      inLanguage: "pt-BR",
      publisher: { "@id": `${url}/#organization` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Features />
        <HowItWorks />
        <Pillars />
        <VideoShowcase />
        <Integration />
        <Hiring />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
