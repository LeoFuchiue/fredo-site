"use client";

import { useId, useState } from "react";
import { savings } from "@/content/site";
import { track } from "@/lib/analytics";
import { SectionLabel } from "../brand";
import { FredoSays } from "../fredo-says";
import { Reveal } from "../reveal";
import { ButtonLink, cn } from "../ui";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

/** Aceita "3.500", "3500,00", "R$ 3.500" etc. */
function lerValor(v: string): number {
  const limpo = v.replace(/[^\d,]/g, "").replace(",", ".");
  const n = Number.parseFloat(limpo);
  return Number.isFinite(n) ? n : 0;
}

function mascaraReais(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 7);
  return d ? Number(d).toLocaleString("pt-BR") : "";
}

/**
 * Calculadora de economia: o restaurante informa o custo mensal de quem fica na balança
 * e quantas pessoas se revezam nela. Mostra o total por mês e por ano.
 * Não mostra o preço do fred.o: a comparação é feita com a revenda.
 */
export function Savings() {
  const id = useId();
  const [custo, setCusto] = useState("3.500");
  const [pessoas, setPessoas] = useState(1);
  const [contou, setContou] = useState(false);

  const mensal = lerValor(custo) * pessoas;
  const anual = mensal * 12;

  function registrar() {
    if (contou) return;
    setContou(true);
    track("calculadora_usada");
  }

  return (
    <section id="economia" aria-labelledby="economia-title" className="py-16 sm:py-24 md:py-32">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="flex flex-col items-start gap-6 lg:col-span-5">
          <Reveal as="header" className="flex flex-col gap-4">
            <SectionLabel>{savings.eyebrow}</SectionLabel>
            <h2 id="economia-title" className="text-balance text-h3 font-bold md:text-h2">
              {savings.title}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="max-w-md text-pretty text-body text-graphite/85">{savings.text}</p>
          </Reveal>
          <FredoSays>{savings.says}</FredoSays>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="grid overflow-hidden rounded-card border border-line shadow-soft md:grid-cols-2">
            <div className="flex flex-col gap-6 bg-paper p-6 md:p-8">
              <div className="flex flex-col gap-2">
                <label htmlFor={`${id}-custo`} className="text-small font-medium text-ink">
                  Custo mensal de uma pessoa na balança
                </label>
                <div className="flex min-h-13 items-center rounded-field border border-line bg-paper px-4 transition-[border-color,box-shadow] duration-300 focus-within:border-terracotta focus-within:shadow-[0_0_0_3px_rgb(197_106_55/0.15)]">
                  <span className="text-body text-muted">R$</span>
                  <input
                    id={`${id}-custo`}
                    inputMode="numeric"
                    value={custo}
                    onChange={(e) => {
                      setCusto(mascaraReais(e.target.value));
                      registrar();
                    }}
                    aria-describedby={`${id}-custo-ajuda`}
                    className="w-full bg-transparent px-2 text-body font-semibold text-ink tabular-nums outline-none"
                  />
                </div>
                <p id={`${id}-custo-ajuda`} className="text-sm text-muted">
                  Valor de exemplo: troque pelo seu. Some salário, encargos e benefícios (vale-transporte, refeição…).
                </p>
              </div>

              <fieldset className="flex flex-col gap-2">
                <legend className="text-small font-medium text-ink">Quantas pessoas se revezam na balança?</legend>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={pessoas === n}
                      onClick={() => {
                        setPessoas(n);
                        registrar();
                      }}
                      className={cn(
                        "min-h-12 rounded-field border text-small font-semibold transition-colors duration-300",
                        pessoas === n ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink hover:border-muted/50",
                      )}
                    >
                      {n === 3 ? "3 ou mais" : n}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="flex flex-col justify-between gap-6 bg-ink p-6 text-paper md:p-8" aria-live="polite">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-small text-paper/70">Por mês, na balança</p>
                  <p className="text-h3 leading-tight font-bold tabular-nums">{brl.format(mensal)}</p>
                </div>
                <div className="border-t border-paper/15 pt-5">
                  <p className="text-small text-paper/70">Em um ano</p>
                  <p className="text-h2 leading-tight font-bold text-paper tabular-nums">
                    {brl.format(anual)}
                    <span className="text-terracotta">.</span>
                  </p>
                </div>
                <p className="text-sm text-paper/60">{savings.note}</p>
              </div>
              <ButtonLink href={savings.cta.href} variant="inverse" withArrow className="w-full">
                {savings.cta.label}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
