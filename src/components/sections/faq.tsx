import { faq } from "@/content/site";
import { SectionLabel } from "../brand";
import { FredoSays } from "../fredo-says";
import { Reveal } from "../reveal";
import { ButtonLink } from "../ui";

/** Seção: dúvidas frequentes do restaurante (abre/fecha sem JavaScript). */
export function Faq() {
  return (
    <section id="duvidas" aria-labelledby="duvidas-title" className="py-16 sm:py-24 md:py-32">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col items-start gap-6 lg:col-span-4">
          <Reveal as="header" className="flex flex-col gap-4">
            <SectionLabel>{faq.eyebrow}</SectionLabel>
            <h2 id="duvidas-title" className="text-balance text-h3 font-bold md:text-h2">
              {faq.title}
            </h2>
          </Reveal>
          <FredoSays>{faq.says}</FredoSays>
          <div className="hidden lg:block">
            <ButtonLink href={faq.cta.href} variant="secondary" withArrow>
              {faq.cta.label}
            </ButtonLink>
          </div>
        </div>

        <div className="flex flex-col border-t border-ink/10 lg:col-span-7 lg:col-start-6">
          {faq.items.map((f) => (
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
          <div className="mt-8 lg:hidden">
            <ButtonLink href={faq.cta.href} variant="secondary" withArrow className="w-full">
              {faq.cta.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
