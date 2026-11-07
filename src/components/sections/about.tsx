import Image from "next/image";
import { Check } from "lucide-react";
import { about } from "@/content/site";
import studio from "../../../public/fredo/fredo-estudio-claro.jpg";
import { FredoScreen, SectionLabel } from "../brand";
import { Reveal, RevealGroup, RevealItem } from "../reveal";
import { ButtonLink } from "../ui";

/** Seção 2: o que é o Fred.o. Foto real em estúdio + texto curto. */
export function About() {
  return (
    <section id="conheca" aria-labelledby="conheca-title" className="py-24 md:py-32">
      <div className="container-page grid items-center gap-12 md:grid-cols-12 md:gap-8">
        <Reveal effect="fade-in" className="relative md:col-span-5 lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-cream md:aspect-[4/5]">
            <Image
              src={studio}
              alt="Fred.o em estúdio: robô branco com tela, corpo em formato de smoking com gravata-borboleta e o logo fred.o"
              sizes="(min-width: 1024px) 40rem, (min-width: 768px) 42vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Detalhe real: a tela "sorrindo" */}
          <div className="absolute -bottom-6 left-4 w-32 rounded-card border border-line bg-paper p-2.5 shadow-lift sm:w-40 md:-left-4 md:w-36 lg:-left-6 lg:w-44 lg:p-3">
            <FredoScreen src="/fredo/visor/fredo-tela-olhos.webp" alt="" sizes="11rem" />
            <p className="mt-2 text-center text-sm font-medium text-graphite">Oi! Eu sou o Fred.o</p>
          </div>
        </Reveal>

        <div className="flex flex-col items-start gap-6 md:col-span-7 lg:col-span-5 lg:col-start-8">
          <Reveal as="header" className="flex flex-col gap-4">
            <SectionLabel>{about.eyebrow}</SectionLabel>
            <h2 id="conheca-title" className="text-balance text-h3 font-bold md:text-h2">
              {about.title}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-pretty text-body text-graphite/85">{about.text}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="border-l-2 border-terracotta pl-4 text-pretty text-body text-muted italic">
              {about.personality}
            </p>
          </Reveal>
          <RevealGroup as="ul" className="grid w-full gap-3 sm:grid-cols-2">
            {about.facts.map((f) => (
              <RevealItem as="li" key={f} className="flex items-start gap-3 text-small text-graphite">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-line text-terracotta">
                  <Check className="size-3.5" strokeWidth={2} aria-hidden="true" />
                </span>
                {f}
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal delay={0.15}>
            <ButtonLink href="#funcionalidades" variant="secondary" withArrow>
              Ver funcionalidades
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
