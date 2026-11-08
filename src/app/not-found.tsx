import type { Metadata } from "next";
import Link from "next/link";
import { FredoScreen } from "@/components/brand";
import { ButtonLink, Logo } from "@/components/ui";
import { whatsappHref } from "@/lib/whatsapp";

// O Next já marca esta página com noindex e responde com status 404.
export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "A página que você procurou não existe no site do Fred.o.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col bg-cream">
      <header className="container-page flex h-16 items-center md:h-20">
        <Link href="/" aria-label="Fred.o, página inicial" className="rounded-button">
          <Logo />
        </Link>
      </header>
      <section className="container-page flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
        <FredoScreen src="/fredo/visor/fredo-tela-olhos.webp" alt="" className="w-40" sizes="10rem" />
        <p className="text-small font-bold tracking-[0.22em] text-terracotta uppercase">Erro 404</p>
        <h1 className="text-balance text-h3 font-bold md:text-h2">Página não encontrada.</h1>
        <p className="max-w-md text-pretty text-body text-muted">
          O endereço pode ter mudado ou não existe mais. Volte para o início e conheça o Fred.o.
        </p>
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <ButtonLink href="/" withArrow>
            Ir para o início
          </ButtonLink>
          <ButtonLink href={whatsappHref("demo")} variant="secondary" whatsapp>
            Falar com a equipe
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
