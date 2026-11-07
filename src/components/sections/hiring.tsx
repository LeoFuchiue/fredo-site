import { hiring } from "@/content/site";
import { SectionLabel } from "../brand";
import { Reveal, RevealGroup, RevealItem } from "../reveal";
import { ButtonLink } from "../ui";

/** Seção 8: modelo Hardware as a Service, sem preços nem prazos. */
export function Hiring() {
  return (
    <section id="contratacao" aria-labelledby="contratacao-title" className="py-24 md:py-32">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-card bg-graphite px-6 py-14 text-paper md:px-14 md:py-20">
          {/* Círculos finos da linguagem da marca */}
          <div aria-hidden="true" className="absolute -top-40 -right-40 size-[28rem] rounded-full border border-paper/10" />
          <div aria-hidden="true" className="absolute -top-20 -right-20 size-[16rem] rounded-full border border-paper/10" />

          <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col items-start gap-6 lg:col-span-6">
              <Reveal as="header" className="flex flex-col gap-4">
                <SectionLabel inverted>{hiring.eyebrow}</SectionLabel>
                <h2 id="contratacao-title" className="text-balance text-h3 font-bold md:text-h2">
                  {hiring.title}
                </h2>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="max-w-lg text-pretty text-body text-paper/75">{hiring.text}</p>
              </Reveal>
              <Reveal delay={0.1}>
                <ButtonLink href={hiring.cta.href} variant="inverse" whatsapp>
                  {hiring.cta.label}
                </ButtonLink>
              </Reveal>
            </div>

            <div className="flex flex-col gap-8 lg:col-span-6">
              <RevealGroup as="ul" className="grid gap-px overflow-hidden rounded-card bg-paper/10">
                {hiring.points.map((p) => (
                  <RevealItem as="li" key={p.title} className="bg-graphite p-6 md:p-7">
                    <h3 className="text-body font-semibold">{p.title}</h3>
                    <p className="mt-1 text-small text-paper/65">{p.text}</p>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
