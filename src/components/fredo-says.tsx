"use client";

import Image from "next/image";
import { m, useReducedMotion } from "motion/react";
import { cn } from "./ui";

/**
 * O fred.o "falando" ao longo da página: rosto do robô + balão curto.
 * Aparece com um pequeno salto quando entra na tela (sem salto com "reduzir movimento").
 */
export function FredoSays({
  children,
  className,
  inverted,
}: {
  children: React.ReactNode;
  className?: string;
  /** Para fundos escuros. */
  inverted?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={cn("flex items-end gap-3", className)}
      initial={{ opacity: 0, y: reduce ? 0 : 10, scale: reduce ? 1 : 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.15 }}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative block size-12 shrink-0 overflow-hidden rounded-full border shadow-soft",
          inverted ? "border-paper/20 bg-paper" : "border-line bg-paper",
        )}
      >
        <Image src="/fredo/visor/fredo-tela-olhos.webp" alt="" fill sizes="3rem" className="scale-[1.35] object-contain" />
      </span>
      <p
        className={cn(
          "relative max-w-xs rounded-2xl rounded-bl-sm px-4 py-2.5 text-small font-medium",
          inverted ? "bg-paper text-ink" : "bg-ink text-paper",
        )}
      >
        <span className="sr-only">fred.o diz: </span>
        {children}
      </p>
    </m.div>
  );
}
