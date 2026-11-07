import { ArrowRight } from "lucide-react";
import { features } from "@/content/site";
import { RealScreen, SectionLabel } from "../brand";
import { Reveal, RevealGroup, RevealItem } from "../reveal";
import { cn } from "../ui";

type Item = (typeof features.items)[number];

/** Cada funcionalidade usa uma tela real do Fred.o (fotos tratadas). */
function Visual({ item }: { item: Item }) {
  switch (item.id) {
    case "peso-valor":
      return (
        <RealScreen
          src={item.screen}
          alt={item.screenAlt}
          aspect="aspect-[590/500]"
          className="w-full max-w-[17rem]"
          sizes="17rem"
        />
      );
    case "pdv":
      return (
        <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5 md:flex-col lg:flex-row">
          <RealScreen src={item.screen} alt={item.screenAlt} className="w-full max-w-[16rem] lg:max-w-[18rem]" sizes="18rem" />
          <ArrowRight className="size-6 shrink-0 rotate-90 text-terracotta sm:rotate-0 md:rotate-90 lg:rotate-0" strokeWidth={1.5} aria-hidden="true" />
          <div className="shrink-0 rounded-[10px] border border-line bg-paper px-4 py-3 text-center shadow-soft">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">Sistema</p>
            <p className="text-small font-bold text-ink">PDV</p>
          </div>
        </div>
      );
    default:
      return <RealScreen src={item.screen} alt={item.screenAlt} className="w-full max-w-[22rem] lg:max-w-[26rem]" sizes="(min-width: 1024px) 26rem, 22rem" />;
  }
}

const layout: Record<Item["id"], string> = {
  pesagem: "lg:col-span-7 bg-paper",
  "peso-valor": "lg:col-span-5 bg-paper",
  comanda: "lg:col-span-5 bg-ink text-paper",
  pdv: "lg:col-span-7 bg-paper",
};

/** Seção 3: as quatro funcionalidades, cada uma com a tela real correspondente. */
export function Features() {
  return (
    <section id="funcionalidades" aria-labelledby="funcionalidades-title" className="bg-cream py-24 md:py-32">
      <div className="container-page">
        <Reveal as="header" className="flex max-w-3xl flex-col gap-4">
          <SectionLabel>{features.eyebrow}</SectionLabel>
          <h2 id="funcionalidades-title" className="text-balance text-h3 font-bold md:text-h2">
            {features.title}
          </h2>
        </Reveal>

        <RevealGroup as="ol" className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2 md:gap-6 lg:grid-cols-12">
          {features.items.map((item, i) => {
            const dark = item.id === "comanda";
            return (
              <RevealItem
                as="li"
                key={item.id}
                className={cn(
                  "group flex flex-col overflow-hidden rounded-card border",
                  dark ? "border-ink" : "border-line",
                  layout[item.id],
                )}
              >
                <div className="flex min-h-52 items-center justify-center px-5 pt-8 pb-5 sm:px-6 sm:pt-10 sm:pb-6 transition-transform duration-300 ease-soft group-hover:scale-[1.02] motion-reduce:group-hover:scale-100 md:min-h-72">
                  <Visual item={item} />
                </div>
                <div className="mt-auto flex gap-4 px-6 pb-8 md:px-8">
                  <span className="text-small font-bold text-terracotta tabular-nums">0{i + 1}</span>
                  <div>
                    <h3 className="text-[1.375rem] leading-snug font-semibold md:text-h4">{item.title}</h3>
                    <p className={cn("mt-2 max-w-md text-small", dark ? "text-paper/70" : "text-muted")}>{item.text}</p>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
