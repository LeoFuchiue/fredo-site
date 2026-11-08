"use client";

import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { FredoAnimated } from "./fredo-animated";
import { cn } from "./ui";

const ease = [0.25, 0.1, 0.25, 1] as const;

type Props = {
  /** "dark" para o cenário escuro do hero; "light" para seções claras. */
  tone?: "dark" | "light";
  /** Mostra os cartões flutuantes de informação (desktop). */
  chips?: { label: string; value: string }[];
  /** Carrega a imagem com prioridade (use só na primeira dobra). */
  priority?: boolean;
  className?: string;
};

/**
 * Apresentação animada do Fredo.
 * - o robô é a animação extraída do vídeo oficial (ver FredoAnimated)
 * - entrada: aparece subindo levemente
 * - brilho de fundo que respira devagar
 * - profundidade na rolagem (o produto desce mais devagar que a página)
 * Com "reduzir movimento" ativo, fica só o fade de entrada.
 */
export function FredoProductHero({ tone = "dark", chips = [], priority, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const dark = tone === "dark";

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const productY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const productScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.94]);
  const backdropY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);

  return (
    <div ref={ref} className={cn("relative mx-auto aspect-[4/5] w-full max-w-[34rem]", className)}>
      {/* Fundo: brilho e círculos finos (movem mais devagar = profundidade) */}
      <m.div aria-hidden="true" style={{ y: backdropY }} className="absolute inset-0">
        <m.div
          className={cn(
            "absolute top-[38%] left-1/2 size-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl",
            dark
              ? "bg-[radial-gradient(circle,rgb(197_106_55/0.28),rgb(255_255_255/0.06)_45%,transparent_70%)]"
              : "bg-[radial-gradient(circle,rgb(255_255_255/1),rgb(247_246_242/0.8)_50%,transparent_70%)]",
          )}
          initial={{ opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { opacity: [0.75, 1, 0.75] }}
          transition={
            reduce
              ? { duration: 0.6 }
              : { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.4 }
          }
        />
        <m.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease, delay: 0.15 }}
        >
          <div
            className={cn(
              "absolute top-[44%] left-1/2 aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border",
              dark ? "border-paper/10" : "border-line",
            )}
          />
          <div
            className={cn(
              "absolute top-[44%] left-1/2 aspect-square w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed",
              dark ? "border-paper/[0.07]" : "border-line",
            )}
          />
          {/* Linha do "chão" */}
          <div
            className={cn(
              "absolute right-[-10%] bottom-[7%] left-[-10%] h-px",
              dark
                ? "bg-gradient-to-r from-transparent via-paper/20 to-transparent"
                : "bg-gradient-to-r from-transparent via-line to-transparent",
            )}
          />
        </m.div>
      </m.div>

      {/* Produto + sombra de apoio */}
      <m.div style={{ y: productY, scale: productScale }} className="absolute inset-x-[14%] top-[4%] bottom-[7%]">
        {/* Sombra: encolhe quando o produto sobe na flutuação */}
        <m.div
          aria-hidden="true"
          className={cn(
            "absolute bottom-[-1.5%] left-1/2 h-[4%] w-[62%] -translate-x-1/2 rounded-[50%] blur-md",
            dark ? "bg-black/70" : "bg-black/20",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
        <m.div
          className="relative h-full w-full"
          // Sem começar invisível: a capa já conta como o elemento principal (LCP)
          initial={{ y: reduce ? 0 : 24 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
        >
          {/* O robô já flutua e a tela anima dentro do próprio vídeo */}
          <FredoAnimated
            alt="Fred.o, robô de pesagem autônoma: a tela mostra olhos, a leitura do peso do prato e o valor enviado ao PDV"
            priority={priority}
            sizes="(min-width: 1024px) 26rem, (min-width: 640px) 22rem, 70vw"
          />
        </m.div>
      </m.div>

      {/* Cartões de informação */}
      {chips.map((c, i) => (
        <m.div
          key={c.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease, delay: 0.9 + i * 0.12 }}
          className={cn(
            "absolute z-10 hidden rounded-card border px-5 py-4 backdrop-blur-md sm:block",
            i % 2 === 0 ? "top-[22%] -left-4" : "-right-4 bottom-[24%]",
            dark ? "border-paper/10 bg-paper/[0.06]" : "border-line bg-paper shadow-lift",
          )}
        >
          <p className={cn("text-small", dark ? "text-paper/60" : "text-muted")}>{c.label}</p>
          <p className={cn("flex items-center gap-2 text-small font-semibold", dark ? "text-paper" : "text-ink")}>
            <span className="size-2 rounded-full bg-terracotta" aria-hidden="true" />
            {c.value}
          </p>
        </m.div>
      ))}
    </div>
  );
}
