import { Fragment } from "react";
import { integration } from "@/content/site";
import { FredoScreen, SectionLabel } from "../brand";
import { Reveal, RevealGroup, RevealItem } from "../reveal";
import { ButtonLink, cn } from "../ui";

/** Ligação entre as etapas, com um ponto terracota percorrendo a linha. */
function FlowLink({ vertical }: { vertical?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative block shrink-0 bg-line", vertical ? "mx-auto h-8 w-px md:hidden" : "hidden h-px w-5 md:block lg:w-8")}
    >
      <span
        className={cn(
          "absolute size-1.5 rounded-full bg-terracotta",
          vertical ? "animate-flow-y left-1/2 -translate-x-1/2" : "animate-flow-x top-1/2 -translate-y-1/2",
        )}
      />
    </span>
  );
}

/** Seção 7: o conceito de integração com o PDV (sem citar sistemas homologados). */
export function Integration() {
  return (
    <section id="integracao" aria-labelledby="integracao-title" className="bg-cream py-24 md:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col items-start gap-6 lg:col-span-5">
          <Reveal as="header" className="flex flex-col gap-4">
            <SectionLabel>{integration.eyebrow}</SectionLabel>
            <h2 id="integracao-title" className="text-balance text-h3 font-bold md:text-h2">
              {integration.title}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-pretty text-body text-graphite/85">{integration.text}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-small text-muted">{integration.note}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <ButtonLink href={integration.cta.href} variant="secondary" withArrow>
              {integration.cta.label}
            </ButtonLink>
          </Reveal>
        </div>

        {/* Fluxo: Balança → Fred.o → Comanda → PDV compatível */}
        <RevealGroup
          as="ol"
          className="flex flex-col items-stretch self-center md:flex-row md:items-center md:gap-3 lg:col-span-7"
          stagger={0.1}
        >
          {integration.flow.map((step, i) => {
            const fredo = step === "Fred.o";
            return (
              <Fragment key={step}>
                {i > 0 && (
                  <li aria-hidden="true" className="contents">
                    <FlowLink vertical />
                    <FlowLink />
                  </li>
                )}
                <RevealItem
                  as="li"
                  className={cn(
                    "flex shrink-0 flex-col items-center justify-center gap-2 rounded-card border px-3 py-4 text-center md:shrink",
                    fredo ? "border-ink bg-paper shadow-lift md:min-w-0 md:flex-[1.3]" : "border-line bg-paper md:min-w-0 md:flex-1",
                  )}
                >
                  {fredo && <FredoScreen src="/fredo/visor/fredo-tela-olhos.webp" alt="" className="w-24" sizes="6rem" />}
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">Etapa {i + 1}</span>
                  <span className="text-small font-bold text-ink">{step}</span>
                </RevealItem>
              </Fragment>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
