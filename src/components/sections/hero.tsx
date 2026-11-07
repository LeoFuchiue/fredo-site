import { hero } from "@/content/site";
import { Signature } from "../brand";
import { FredoProductHero } from "../fredo-product-hero";
import { ButtonLink } from "../ui";

/**
 * Seção 1: Rapidez. Precisão. Economia.
 * Fundo off-white da marca, Fred.o animado como protagonista.
 * Os textos entram com animação CSS (aparecem antes da hidratação, melhor para o LCP).
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-cream pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28"
    >
      {/* Profundidade: luz branca suave atrás do produto */}
      <div
        aria-hidden="true"
        className="absolute top-[8%] right-[-20%] size-[80rem] max-w-none rounded-full bg-[radial-gradient(circle,#ffffff_0%,rgb(255_255_255/0.6)_35%,transparent_65%)] lg:right-[-25%]"
      />

      <div className="container-page relative grid items-center gap-10 md:grid-cols-12 md:gap-6 lg:gap-8">
        <div className="order-1 md:order-2 md:col-span-5 lg:col-span-6">
          <FredoProductHero
            tone="light"
            priority
            className="max-w-[15rem] sm:max-w-[18rem] md:max-w-[19rem] lg:max-w-[30rem] xl:max-w-[34rem]"
          />
        </div>

        <div className="order-2 flex flex-col items-start gap-6 md:order-1 md:col-span-7 lg:col-span-6 lg:gap-8">
          <Signature className="animate-fade-in text-small md:text-body" />

          <h1
            id="hero-title"
            className="animate-fade-up text-balance text-[2.5rem] leading-[1.08] font-bold [animation-delay:80ms] sm:text-[3rem] md:text-[2.75rem] lg:text-[3.5rem] xl:text-h1"
          >
            Automatize a pesagem do seu restaurante com o{" "}
            <span className="whitespace-nowrap">
              Fred<span className="text-terracotta">.</span>o.
            </span>
          </h1>

          <p className="animate-fade-up max-w-xl text-pretty text-body text-graphite/80 [animation-delay:160ms]">
            {hero.subtitle}
          </p>

          <div className="animate-fade-up flex w-full flex-col gap-4 [animation-delay:240ms] sm:w-auto sm:flex-row sm:flex-wrap">
            <ButtonLink href={hero.primaryCta.href} withArrow>
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="secondary" whatsapp>
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
