"use client";

import { useRef } from "react";
import { m, useReducedMotion, useScroll, useSpring } from "motion/react";
import { steps } from "@/content/site";
import { RealScreen, SectionLabel } from "../brand";
import { Reveal } from "../reveal";

/**
 * Seção 4: fluxo da pesagem em 4 passos (sequência das telas reais do equipamento).
 * Uma linha terracota se preenche conforme a rolagem.
 */
export function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section id="como-funciona" aria-labelledby="como-funciona-title" className="py-24 md:py-32">
      <div className="container-page">
        <Reveal as="header" className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <SectionLabel>{steps.eyebrow}</SectionLabel>
          <h2 id="como-funciona-title" className="text-balance text-h3 font-bold md:text-h2">
            {steps.title}
          </h2>
        </Reveal>

        <ol ref={listRef} className="relative mt-16 grid gap-12 md:mt-20 md:grid-cols-2 md:gap-x-8 md:gap-y-14 lg:grid-cols-4 lg:gap-6">
          {/* Linha de progresso: horizontal no desktop, vertical no celular */}
          <div aria-hidden="true" className="absolute top-0 bottom-0 left-5 w-px bg-line md:hidden">
            <m.div className="h-full w-full origin-top bg-terracotta" style={reduce ? undefined : { scaleY: progress }} />
          </div>
          <div aria-hidden="true" className="absolute top-5 right-[12.5%] left-[12.5%] hidden h-px bg-line lg:block">
            <m.div className="h-full w-full origin-left bg-terracotta" style={reduce ? undefined : { scaleX: progress }} />
          </div>

          {steps.items.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08} className="relative flex gap-6 lg:flex-col lg:items-center lg:text-center">
              <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-small font-bold text-paper ring-8 ring-paper">
                {i + 1}
              </span>
              <div className="flex flex-col gap-5 lg:items-center">
                <RealScreen
                  src={s.screen}
                  alt={`Tela real do Fred.o: ${s.title}`}
                  className="w-full max-w-[16rem] transition-transform lg:max-w-[17rem] duration-300 ease-soft hover:scale-[1.02] motion-reduce:hover:scale-100"
                  sizes="17rem"
                />
                <div>
                  <h3 className="text-[1.375rem] leading-snug font-semibold md:text-h4">{s.title}</h3>
                  <p className="mt-2 max-w-xs text-small text-muted">{s.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
