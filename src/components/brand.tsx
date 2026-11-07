import Image from "next/image";
import { site } from "@/content/site";
import { cn } from "./ui";

/** Assinatura da marca: RAPIDEZ. PRECISÃO. ECONOMIA. (pontos em terracota). */
export function Signature({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-x-3 gap-y-1 font-bold tracking-[0.22em] uppercase",
        inverted ? "text-paper" : "text-ink",
        className,
      )}
    >
      {site.signature.map((w) => (
        <span key={w}>
          {w}
          <span className="text-terracotta">.</span>
        </span>
      ))}
    </p>
  );
}

/** Rótulo de seção (bolinha terracota + texto). */
export function SectionLabel({ children, inverted }: { children: React.ReactNode; inverted?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-small font-medium",
        inverted ? "text-paper/70" : "text-muted",
      )}
    >
      <span aria-hidden="true" className="size-2 rounded-full bg-terracotta" />
      {children}
    </span>
  );
}

/**
 * Tela real do Fred.o (foto tratada), na moldura escura do aparelho.
 * `aspect` padrão 5:3, a proporção da tela.
 */
export function RealScreen({
  src,
  alt,
  className,
  aspect = "aspect-[5/3]",
  sizes = "(min-width: 1024px) 30rem, 90vw",
}: {
  src: string;
  alt: string;
  className?: string;
  aspect?: string;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[18px] bg-[#1d1d1d] p-[3.5%] shadow-[0_24px_50px_-24px_rgb(0_0_0/0.45)] ring-1 ring-black/5",
        className ?? "w-full",
      )}
    >
      <div className={cn("relative overflow-hidden rounded-[6px] bg-paper", aspect)}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}

/** Rosto do Fred.o (recorte do vídeo oficial), usado como elemento gráfico da marca. */
export function FredoScreen({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 28rem, 80vw",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={cn("relative aspect-[449/290]", className ?? "w-full")}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-contain drop-shadow-[0_18px_30px_rgb(0_0_0/0.12)]" />
    </div>
  );
}
