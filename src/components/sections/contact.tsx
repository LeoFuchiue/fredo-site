import { Search } from "lucide-react";
import { revendas } from "@/content/revendas";
import { contact } from "@/content/site";
import { externalLinkProps } from "@/lib/whatsapp";
import { SectionLabel } from "../brand";
import { FredoSays } from "../fredo-says";
import { Reveal } from "../reveal";
import { buttonBase, buttonVariants, cn } from "../ui";

/**
 * Seção 9: encontre uma revenda. O formulário envia o CEP para /fredo/revendas?cep=…,
 * que mostra as revendas mais próximas (funciona mesmo sem JavaScript).
 */
export function Contact() {
  return (
    <section id="contato" aria-labelledby="contato-title" className="bg-cream py-16 sm:py-20 md:py-28 lg:py-32">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
        <Reveal className="flex flex-col items-start gap-6 lg:col-span-5">
          <SectionLabel>{contact.eyebrow}</SectionLabel>
          <h2 id="contato-title" className="text-balance text-h3 font-bold md:text-h2">
            {contact.title}
          </h2>
          <p className="max-w-md text-pretty text-body text-graphite/85">{contact.description}</p>
          <FredoSays>{contact.says}</FredoSays>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="rounded-card border border-line bg-paper p-6 shadow-soft md:p-12">
            <form action="/fredo/revendas" method="get" className="flex flex-col gap-4" role="search">
              <label htmlFor="cep-inicio" className="text-small font-medium text-ink">
                CEP do restaurante
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="cep-inicio"
                  name="cep"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="00000-000"
                  required
                  pattern="\d{5}-?\d{3}"
                  title="Digite os 8 números do CEP"
                  maxLength={9}
                  className="min-h-13 flex-1 rounded-field border border-line bg-paper px-5 text-body text-ink tabular-nums placeholder:text-muted/80 outline-none transition-[border-color,box-shadow] duration-300 focus:border-terracotta focus:shadow-[0_0_0_3px_rgb(197_106_55/0.15)]"
                />
                <button type="submit" className={cn(buttonBase, buttonVariants.primary)}>
                  <Search className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  Buscar revenda
                </button>
              </div>
              <p className="text-sm text-muted">
                Mostramos as revendas autorizadas mais próximas, com WhatsApp, endereço e site.
              </p>
              {revendas.length > 0 && (
                <p className="text-sm text-graphite">
                  <span className="font-semibold text-ink">Revendas autorizadas em: </span>
                  {[...new Set(revendas.map((r) => `${r.cidade}/${r.uf}`))].join(" · ")}
                </p>
              )}
            </form>

            <p className="mt-8 border-t border-line pt-6 text-sm text-graphite">
              Não sabe o CEP ou quer ajuda?{" "}
              <a
                href={contact.cta.href}
                {...externalLinkProps}
                className="font-semibold text-ink underline decoration-terracotta underline-offset-4 transition-colors duration-300 hover:text-terracotta"
              >
                {contact.cta.label}
                <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
