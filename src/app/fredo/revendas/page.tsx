import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/brand";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Reveal } from "@/components/reveal";
import { FredoSays } from "@/components/fredo-says";
import { LeadForm } from "@/components/lead-form";

const path = "/fredo/revendas";
const title = "Fale com uma revenda fred.o";
const description =
  "Peça o contato de uma revenda autorizada fred.o (Fredo) perto do seu restaurante para ver o robô de pesagem funcionando, conhecer as condições e instalar.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { type: "website", url: path, title, description },
  twitter: { card: "summary_large_image", title, description },
};

/** Página "Encontre uma revenda": busca pelo CEP e mostra as revendas mais próximas. */
export default function RevendasPage() {
  return (
    <>
      <Header cta={{ href: "/fredo/parceiro", label: "Seja parceiro" }} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <section
          aria-labelledby="revendas-title"
          className="relative bg-cream pt-24 pb-14 md:pt-36 md:pb-20 lg:pt-40"
        >
          {/* Círculos da marca num recorte próprio, para o texto da esquerda poder ficar fixo na rolagem */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 size-[34rem] rounded-full border border-ink/5" />
            <div className="absolute -top-16 -right-16 size-[20rem] rounded-full border border-ink/5" />
          </div>

          <div className="container-page relative grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col items-start gap-6 lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
              <span className="animate-fade-in">
                <SectionLabel>Revendas autorizadas</SectionLabel>
              </span>
              <h1
                id="revendas-title"
                className="animate-fade-up text-balance text-[2.25rem] leading-[1.08] font-bold [animation-delay:80ms] sm:text-[2.75rem] lg:text-[3rem]"
              >
                Fale com uma revenda{" "}
                <span className="whitespace-nowrap">
                  fred<span className="text-terracotta">.</span>o
                </span>{" "}
                perto de você.
              </h1>
              <p className="animate-fade-up text-pretty text-body text-graphite/80 [animation-delay:160ms]">
                Preencha os dados do seu restaurante. A nossa equipe encaminha para a revenda autorizada da sua região, que
                entra em contato para mostrar o fred.o funcionando.
              </p>
              <ol className="animate-fade-up hidden flex-col gap-3 text-small lg:flex text-graphite [animation-delay:220ms]">
                {[
                  "Você preenche e envia pelo WhatsApp",
                  "A gente encaminha para a revenda da sua região",
                  "A revenda fala com você e agenda a demonstração",
                ].map((passo, i) => (
                  <li key={passo} className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-ink/15 text-sm font-semibold text-ink">
                      {i + 1}
                    </span>
                    {passo}
                  </li>
                ))}
              </ol>
              <div className="hidden lg:block">
                <FredoSays>Leva menos de 2 minutos!</FredoSays>
              </div>
            </div>
            <div className="animate-fade-up [animation-delay:200ms] lg:col-span-8">
              <LeadForm />
            </div>
          </div>
        </section>

        <section aria-labelledby="seja-parceiro-title" className="py-16 md:py-24">
          <div className="container-page">
            <Reveal className="flex flex-col items-start justify-between gap-6 rounded-card bg-graphite px-6 py-10 text-paper md:flex-row md:items-center md:px-12">
              <div className="flex flex-col gap-2">
                <h2 id="seja-parceiro-title" className="text-h4 font-bold">
                  Tem uma empresa de automação comercial?
                </h2>
                <p className="text-small text-paper/70">
                  Seja uma revenda fred.o e ganhe uma comissão que se repete todo mês.
                </p>
              </div>
              <Link
                href="/fredo/parceiro"
                className="inline-flex min-h-13 w-full items-center justify-center rounded-button bg-paper px-7 sm:w-auto font-semibold text-ink transition-colors duration-300 hover:bg-terracotta hover:text-paper"
              >
                Quero ser parceiro
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
