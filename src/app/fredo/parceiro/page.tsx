import type { Metadata } from "next";
import { Check } from "lucide-react";
import { SectionLabel } from "@/components/brand";
import { Footer } from "@/components/footer";
import { FredoProductHero } from "@/components/fredo-product-hero";
import { Header } from "@/components/header";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { FredoSays } from "@/components/fredo-says";
import { PartnerForm } from "@/components/partner-form";
import { ButtonLink } from "@/components/ui";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import {
  partnerBenefits,
  partnerContact,
  partnerFaq,
  partnerHero,
  partnerMeta,
  partnerProfile,
  partnerSteps,
} from "@/content/parceiro";
import { site } from "@/content/site";
import { revendas } from "@/content/revendas";
import { WHATSAPP_DISPLAY, externalLinkProps } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: partnerMeta.title,
  description: partnerMeta.description,
  alternates: { canonical: partnerMeta.path },
  openGraph: {
    type: "website",
    url: partnerMeta.path,
    title: partnerMeta.title,
    description: partnerMeta.description,
  },
  twitter: { card: "summary_large_image", title: partnerMeta.title, description: partnerMeta.description },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${site.url}${partnerMeta.path}#faq`,
  mainEntity: partnerFaq.items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/** Página "Seja um parceiro fred.o": mesma identidade visual da página principal. */
export default function PartnerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <Header cta={partnerHero.primaryCta} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <PartnerHero />
        <Benefits />
        <Steps />
        <Profile />
        <Faq />
        <PartnerContact />
      </main>
      <Footer />
      <WhatsAppFloat cta={partnerHero.primaryCta} />
    </>
  );
}

function PartnerHero() {
  return (
    <section
      aria-labelledby="parceiro-title"
      className="relative overflow-hidden bg-cream pt-24 pb-12 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28"
    >
      <div
        aria-hidden="true"
        className="absolute top-[8%] right-[-20%] size-[80rem] max-w-none rounded-full bg-[radial-gradient(circle,#ffffff_0%,rgb(255_255_255/0.6)_35%,transparent_65%)] lg:right-[-25%]"
      />

      <div className="container-page relative grid items-center gap-10 md:grid-cols-12 md:gap-6 lg:gap-8">
        <div className="order-2 md:col-span-5 lg:col-span-6">
          <FredoProductHero
            tone="light"
            priority
            className="max-w-[11rem] sm:max-w-[15rem] md:max-w-[19rem] lg:max-w-[28rem] xl:max-w-[32rem]"
          />
        </div>

        <div className="order-1 flex flex-col items-start gap-6 md:col-span-7 lg:col-span-6 lg:gap-8">
          <span className="animate-fade-in">
            <SectionLabel>{partnerHero.eyebrow}</SectionLabel>
          </span>

          <h1
            id="parceiro-title"
            className="animate-fade-up text-balance text-[2.5rem] leading-[1.08] font-bold [animation-delay:80ms] sm:text-[3rem] md:text-[2.75rem] lg:text-[3.5rem] xl:text-h1"
          >
            Seja um parceiro{" "}
            <span className="whitespace-nowrap">
              fred<span className="text-terracotta">.</span>o.
            </span>
          </h1>

          <p className="animate-fade-up max-w-xl text-pretty text-body text-graphite/80 [animation-delay:160ms]">
            {partnerHero.subtitle}
          </p>

          <div className="animate-fade-up flex flex-col gap-2 border-l-2 border-terracotta pl-4 [animation-delay:200ms] sm:flex-row sm:items-center sm:gap-4">
            <span className="text-h4 leading-none font-bold whitespace-nowrap text-ink sm:text-h3">{partnerHero.highlight.value}</span>
            <span className="max-w-xs text-small text-graphite/80">{partnerHero.highlight.label}</span>
          </div>

          <div className="animate-fade-up flex w-full flex-col gap-4 [animation-delay:240ms] sm:w-auto sm:flex-row sm:flex-wrap">
            <ButtonLink href={partnerHero.primaryCta.href} withArrow>
              {partnerHero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={partnerHero.secondaryCta.href} variant="secondary" withArrow>
              {partnerHero.secondaryCta.label}
            </ButtonLink>
          </div>

          {revendas.length > 0 && (
            <p className="animate-fade-up text-small text-graphite/80 [animation-delay:280ms]">
              <span className="font-semibold text-ink">Já fazem parte: </span>
              {revendas.map((r, i) => (
                <span key={r.id}>
                  {i > 0 && " · "}
                  {r.nome} ({r.cidade}/{r.uf})
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section id="beneficios" aria-labelledby="beneficios-title" className="py-16 sm:py-24 md:py-32">
      <div className="container-page">
        <Reveal as="header" className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <SectionLabel>{partnerBenefits.eyebrow}</SectionLabel>
          <h2 id="beneficios-title" className="text-balance text-h3 font-bold md:text-h2">
            {partnerBenefits.title}
          </h2>
        </Reveal>

        <RevealGroup as="ul" className="mt-10 grid sm:mt-14 gap-px overflow-hidden rounded-card border border-line bg-line md:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {partnerBenefits.items.map((b, i) => (
            <RevealItem as="li" key={b.title} className="flex flex-col gap-3 bg-paper p-7 md:p-9">
              <span className="text-small font-medium text-terracotta tabular-nums">0{i + 1}</span>
              <h3 className="text-[1.375rem] leading-snug font-semibold">{b.title}</h3>
              <p className="text-small text-muted">{b.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section id="como-funciona" aria-labelledby="passos-title" className="bg-ink py-16 text-paper sm:py-24 md:py-32">
      <div className="container-page">
        <Reveal as="header" className="flex max-w-3xl flex-col gap-4">
          <SectionLabel inverted>{partnerSteps.eyebrow}</SectionLabel>
          <h2 id="passos-title" className="text-balance text-h3 font-bold md:text-h2">
            {partnerSteps.title}
          </h2>
        </Reveal>

        <RevealGroup as="ol" className="mt-10 grid sm:mt-14 border-t border-paper/15 md:mt-20 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {partnerSteps.items.map((s, i) => (
            <RevealItem
              as="li"
              key={s.title}
              className="flex gap-5 border-b border-paper/15 py-8 md:pr-8"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-paper text-small font-bold text-ink">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[1.375rem] leading-snug font-semibold">
                  {s.title}
                  <span className="text-terracotta">.</span>
                </h3>
                <p className="mt-2 max-w-sm text-small text-paper/70">{s.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function Profile() {
  return (
    <section id="perfil" aria-labelledby="perfil-title" className="py-16 sm:py-24 md:py-32">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal as="header" className="flex flex-col items-start gap-4 lg:col-span-5">
          <SectionLabel>{partnerProfile.eyebrow}</SectionLabel>
          <h2 id="perfil-title" className="text-balance text-h3 font-bold md:text-h2">
            {partnerProfile.title}
          </h2>
          <p className="max-w-md text-pretty text-body text-graphite/85">{partnerProfile.text}</p>
        </Reveal>

        <RevealGroup as="ul" className="grid gap-3 sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:self-center">
          {partnerProfile.items.map((p) => (
            <RevealItem
              as="li"
              key={p}
              className="flex items-start gap-3 rounded-card border border-line p-5 text-small text-graphite"
            >
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-line text-terracotta">
                <Check className="size-3.5" strokeWidth={2} aria-hidden="true" />
              </span>
              {p}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="duvidas" aria-labelledby="duvidas-title" className="bg-cream py-16 sm:py-24 md:py-32">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal as="header" className="flex flex-col items-start gap-4 lg:col-span-4">
          <SectionLabel>{partnerFaq.eyebrow}</SectionLabel>
          <h2 id="duvidas-title" className="text-balance text-h3 font-bold md:text-h2">
            {partnerFaq.title}
          </h2>
        </Reveal>

        <div className="flex flex-col border-t border-ink/10 lg:col-span-7 lg:col-start-6">
          {partnerFaq.items.map((f) => (
            <details key={f.q} className="group border-b border-ink/10">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-body font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-ink/15 text-terracotta transition-transform duration-300 ease-soft group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-6 text-pretty text-small text-graphite/85">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerContact() {
  return (
    <section id="contato" aria-labelledby="contato-title" className="py-16 sm:py-24 md:py-32">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-card bg-graphite px-6 py-12 text-paper md:px-12 md:py-16">
          <div aria-hidden="true" className="absolute -top-40 -right-40 size-[28rem] rounded-full border border-paper/10" />
          <div aria-hidden="true" className="absolute -top-20 -right-20 size-[16rem] rounded-full border border-paper/10" />

          <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-12">
            <Reveal className="flex flex-col items-start gap-6 lg:col-span-5">
              <SectionLabel inverted>{partnerContact.eyebrow}</SectionLabel>
              <h2 id="contato-title" className="text-balance text-h3 font-bold md:text-h2">
                {partnerContact.title}
              </h2>
              <p className="text-pretty text-body text-paper/75">{partnerContact.description}</p>
              <FredoSays inverted>Bora vender comigo?</FredoSays>
              <p className="text-small text-paper/60">
                Prefere falar direto?{" "}
                <a
                  href={partnerContact.cta.href}
                  {...externalLinkProps}
                  className="font-semibold text-paper underline decoration-terracotta underline-offset-4 hover:text-terracotta"
                >
                  WhatsApp {WHATSAPP_DISPLAY}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </p>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-7">
              <PartnerForm inverted />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
