import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { externalLinkProps } from "@/lib/whatsapp";
import { Reveal } from "./reveal";
import { WhatsAppIcon } from "./whatsapp-icon";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Logotipo oficial fred.o (arquivos em /public). */
export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG vetorial, não precisa de otimização
    <img
      src={inverted ? "/logo-fredo-white.svg" : "/logo-fredo.svg"}
      alt="fred.o"
      width={246}
      height={132}
      className={cn("h-12 w-auto shrink-0 self-start md:h-14", className)}
    />
  );
}

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof buttonVariants;
  className?: string;
  withArrow?: boolean;
  /** Mostra o ícone do WhatsApp antes do texto. */
  whatsapp?: boolean;
};

export const buttonBase =
  "group inline-flex min-h-13 items-center justify-center gap-2 rounded-button px-7 py-3 text-center text-body leading-tight font-semibold sm:whitespace-nowrap sm:leading-none transition-[background-color,color,border-color,transform] duration-300 ease-soft";

export const buttonVariants = {
  primary: "bg-ink text-paper hover:bg-graphite",
  secondary: "border border-ink bg-paper text-ink hover:bg-ink hover:text-paper",
  /** Para fundos escuros. */
  inverse: "bg-paper text-ink hover:bg-terracotta hover:text-paper",
  /** Contorno para fundos escuros. */
  outlineInverse: "border border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink",
} as const;

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  withArrow,
  whatsapp,
}: ButtonProps) {
  const classes = cn(buttonBase, buttonVariants[variant], className);
  const content = (
    <>
      {whatsapp && <WhatsAppIcon className="size-5 shrink-0" />}
      {children}
      {withArrow && (
        <ArrowRight
          aria-hidden="true"
          strokeWidth={1.5}
          className="size-5 transition-transform duration-300 ease-soft group-hover:translate-x-0.5"
        />
      )}
    </>
  );

  // Links externos (ex.: WhatsApp) abrem em nova aba, com rel de segurança.
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} {...externalLinkProps} className={classes}>
        {content}
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-small font-medium text-muted">
      <span aria-hidden="true" className="size-2 rounded-full bg-terracotta" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  id: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal
      as="header"
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center" ? "mx-auto items-center text-center" : "items-start",
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="text-balance text-h3 font-bold text-ink md:text-h2">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-pretty text-body text-muted">{description}</p>
      )}
    </Reveal>
  );
}
