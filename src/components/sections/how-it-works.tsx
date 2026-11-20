"use client";

import { useRef } from "react";
import { m, useReducedMotion, useScroll, useSpring } from "motion/react";
import { steps } from "@/content/site";
import { RealScreen, SectionLabel } from "../brand";
import { FredoSays } from "../fredo-says";
import { Reveal } from "../reveal";
import { ButtonLink } from "../ui";

/**
 * Seção 4: como funciona, do prato ao caixa (telas reais do equipamento)
 * + ligação com o PDV. Junta o que antes eram três seções (funcionalidades,
 * como funciona e integração). Uma linha terracota se preenche conforme a rolagem.
 */
export function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section id="como-funciona" aria-labelledby="como-funciona-title" className="bg-cream py-16 sm:py-24 md:py-32">
      <div className="container-page">
        <Reveal as="header" className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <SectionLabel>{steps.eyebrow}</SectionLabel>
          <h2 id="como-funciona-title" className="text-balance text-h3 font-bold md:text-h2">
            {steps.title}
          </h2>
        </Reveal>
        <FredoSays className="mx-auto mt-6 w-fit">{steps.says}</FredoSays>

        <ol
          ref={listRef}
          className="relative mt-10 grid gap-10 sm:mt-16 sm:gap-12 md:mt-20 md:grid-cols-2 md:gap-x-8 md:gap-y-14 lg:grid-cols-4 lg:gap-6"
        >
          {/* Linha de progresso: horizontal no desktop, vertical no celular */}
          <div aria-hidden="true" className="absolute top-0 bottom-0 left-5 w-px bg-line md:hidden">
            <m.div className="h-full w-full origin-top bg-terracotta" style={reduce ? undefined : { scaleY: progress }} />
          </div>
          <div aria-hidden="true" className="absolute top-5 right-[12.5%] left-[12.5%] hidden h-px bg-line lg:block">
            <m.div className="h-full w-full origin-left bg-terracotta" style={reduce ? undefined : { scaleX: progress }} />
          </div>

          {steps.items.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08} className="relative flex gap-5 sm:gap-6 lg:flex-col lg:items-center lg:text-center">
              <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-small font-bold text-paper ring-8 ring-cream">
                {i + 1}
              </span>
              <div className="flex flex-col gap-4 sm:gap-5 lg:items-center">
                <RealScreen
                  src={s.screen}
                  alt={`Tela real do fred.o: ${s.title}`}
                  className="w-full max-w-[13rem] transition-transform duration-300 ease-soft hover:scale-[1.02] motion-reduce:hover:scale-100 sm:max-w-[16rem] lg:max-w-[17rem]"
                  sizes="(min-width: 640px) 17rem, 13rem"
                />
                <div>
                  <h3 className="text-[1.375rem] leading-snug font-semibold md:text-h4">{s.title}</h3>
                  <p className="mt-2 max-w-xs text-small text-muted">{s.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* Ligação com o caixa (antes era a seção "Integração") */}
        <Reveal className="mt-14 grid gap-6 rounded-card border border-line bg-paper p-6 md:mt-20 md:grid-cols-[1fr_auto] md:items-center md:gap-10 md:p-10">
          <div className="flex flex-col gap-3">
            <h3 className="text-h4 font-bold text-ink">{steps.integration.title}</h3>
            <p className="max-w-2xl text-pretty text-small text-graphite/85">{steps.integration.text}</p>
            <ul aria-label="Caminho da pesagem" className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
              {["Balança", "fred.o", "Comanda", "PDV homologado"].map((etapa, i) => (
                <li key={etapa} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-terracotta">
                      →
                    </span>
                  )}
                  <span className={i === 1 ? "rounded-full bg-ink px-3 py-1 text-paper" : "rounded-full bg-cream px-3 py-1"}>
                    {etapa}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <ButtonLink href={steps.integration.cta.href} variant="secondary" withArrow className="w-full md:w-auto">
            {steps.integration.cta.label}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
