"use client";

import { m, type Variants } from "motion/react";

const ease = [0.25, 0.1, 0.25, 1] as const;

/** Fade Up: sobe 16 px enquanto aparece (350 ms). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease } },
};

/** Fade In: apenas aparece (300 ms). */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3, ease } },
};

const variantsByName = { "fade-up": fadeUp, "fade-in": fadeIn } as const;
type Effect = keyof typeof variantsByName;

const viewport = { once: true, margin: "0px 0px -10% 0px" } as const;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  effect?: Effect;
  as?: "div" | "li" | "section" | "header";
};

/** Scroll Reveal: anima o conteúdo uma vez, ao entrar na tela. */
export function Reveal({
  children,
  className,
  delay = 0,
  effect = "fade-up",
  as = "div",
}: RevealProps) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={variantsByName[effect]}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}

/** Escalona a entrada dos <RevealItem> filhos. */
export function RevealGroup({
  children,
  className,
  as = "div",
  stagger = 0.06,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
  stagger?: number;
}) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const Comp = m[as];
  return (
    <Comp className={className} variants={fadeUp}>
      {children}
    </Comp>
  );
}
