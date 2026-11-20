import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/brand";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Reveal } from "@/components/reveal";
import { ResellerFinder } from "@/components/reseller-finder";

const path = "/fredo/revendas";
const title = "Encontre uma revenda fred.o";
const description =
  "Digite o CEP do seu restaurante e encontre a revenda autorizada fred.o mais próxima para ver o robô de pesagem funcionando, contratar e instalar.";

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
          className="relative overflow-hidden bg-cream pt-28 pb-16 md:pt-36 md:pb-20 lg:pt-40"
        >
          <div aria-hidden="true" className="absolute -top-40 -right-40 size-[34rem] rounded-full border border-ink/5" />
          <div aria-hidden="true" className="absolute -top-16 -right-16 size-[20rem] rounded-full border border-ink/5" />

          <div className="container-page relative flex flex-col items-start gap-6">
            <span className="animate-fade-in">
              <SectionLabel>Revendas autorizadas</SectionLabel>
            </span>
            <h1
              id="revendas-title"
              className="animate-fade-up max-w-3xl text-balance text-[2.5rem] leading-[1.08] font-bold [animation-delay:80ms] sm:text-[3rem] lg:text-[3.5rem]"
            >
              Encontre a revenda{" "}
              <span className="whitespace-nowrap">
                fred<span className="text-terracotta">.</span>o
              </span>{" "}
              mais perto de você.
            </h1>
            <p className="animate-fade-up max-w-2xl text-pretty text-body text-graphite/80 [animation-delay:160ms]">
              Digite o CEP do seu restaurante. A revenda da sua região mostra o fred.o funcionando, tira suas
              dúvidas, apresenta as condições de locação, faz a instalação e cuida do seu atendimento.
            </p>
          </div>
        </section>

        <section aria-label="Busca de revendas" className="py-14 md:py-20">
          <div className="container-page">
            <ResellerFinder />
            <p className="mt-10 max-w-2xl text-sm text-muted">
              Usamos o CEP só para encontrar as revendas próximas. Ele é consultado em um serviço público de CEP e
              não fica salvo no site.
            </p>
          </div>
        </section>

        <section aria-labelledby="seja-parceiro-title" className="pb-24 md:pb-32">
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
                className="inline-flex min-h-13 items-center rounded-button bg-paper px-7 font-semibold text-ink transition-colors duration-300 hover:bg-terracotta hover:text-paper"
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
