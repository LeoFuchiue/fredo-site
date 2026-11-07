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
import { about, site } from "@/content/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: `${site.url}/logo-fredo.svg`,
      slogan: "Rapidez. Precisão. Economia.",
    },
    {
      "@type": "Product",
      name: "Fred.o",
      description: about.text,
      brand: { "@type": "Brand", name: site.name },
      image: `${site.url}/fredo/fredo-estudio-claro.jpg`,
      category: "Equipamento para restaurantes self-service por quilo",
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
