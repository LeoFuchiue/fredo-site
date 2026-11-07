import { pillars } from "@/content/site";
import { SectionLabel } from "../brand";
import { Reveal, RevealGroup, RevealItem } from "../reveal";

/** Seção 5: os três pilares da marca, em composição tipográfica. */
export function Pillars() {
  return (
    <section id="diferenciais" aria-labelledby="diferenciais-title" className="bg-ink py-24 text-paper md:py-32">
      <div className="container-page">
        <Reveal as="header" className="flex max-w-3xl flex-col gap-4">
          <SectionLabel inverted>{pillars.eyebrow}</SectionLabel>
          <h2 id="diferenciais-title" className="text-balance text-h3 font-bold md:text-h2">
            {pillars.title}
          </h2>
        </Reveal>

        <RevealGroup as="ol" className="mt-14 grid border-t border-paper/15 md:mt-20 lg:grid-cols-3" stagger={0.1}>
          {pillars.items.map((p, i) => (
            <RevealItem
              as="li"
              key={p.title}
              className="group grid gap-4 border-b border-paper/15 py-10 md:grid-cols-[3rem_1fr_1fr] md:items-baseline md:gap-8 lg:flex lg:flex-col lg:gap-4 lg:border-b-0 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0"
            >
              <span className="text-small font-medium text-paper/50 tabular-nums">0{i + 1}</span>
              <h3 className="text-[2.75rem] leading-none font-bold tracking-tight sm:text-[3rem] lg:text-[3.25rem] xl:text-[4rem]">
                {p.title}
                <span className="text-terracotta transition-colors duration-300">.</span>
              </h3>
              <p className="max-w-xs text-small text-paper/70">{p.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
