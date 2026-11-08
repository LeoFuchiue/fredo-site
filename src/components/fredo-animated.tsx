"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import poster from "../../public/fredo/animacao/fredo-animado-poster.png";
import { cn } from "./ui";

const WEBM = "/fredo/animacao/fredo-animado.webm"; // Chrome, Edge, Firefox, Android (com transparência)
const WEBP = "/fredo/animacao/fredo-animado.webp"; // Safari / iPhone (não tocam WebM transparente)

/** Navegadores com motor WebKit (Safari e todos os navegadores do iPhone). */
function isWebKit() {
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const safari = /^((?!chrome|chromium|crios|fxios|edg|android).)*safari/i.test(ua);
  return iOS || safari;
}

/**
 * Fred.o animado, extraído do vídeo institucional (a tela mostra olhos →
 * leitura do peso → valor enviado ao PDV, em loop).
 *
 * 1. Mostra na hora a capa (primeiro quadro), que entra no LCP.
 * 2. Depois que a página carrega, troca pela animação com transparência:
 *    WebM nos navegadores que suportam, WebP animado no Safari/iPhone.
 * 3. Pausa quando sai da tela. Com "reduzir movimento", fica só a capa.
 */
export function FredoAnimated({
  alt,
  priority,
  sizes,
  className,
}: {
  alt: string;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<"poster" | "webm" | "webp">("poster");
  const [ready, setReady] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Escolhe o formato só depois do carregamento da página (não atrasa o topo).
  useEffect(() => {
    if (reduce) return;
    const choose = () => setMode(isWebKit() ? "webp" : "webm");
    if (document.readyState === "complete") choose();
    else window.addEventListener("load", choose, { once: true });
    return () => window.removeEventListener("load", choose);
  }, [reduce]);

  // Pausa o vídeo fora da tela (economiza bateria e processamento).
  useEffect(() => {
    if (mode !== "webm" || !wrapRef.current) return;
    const io = new IntersectionObserver(([e]) => {
      const v = videoRef.current;
      if (!v) return;
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, [mode]);

  const layer = "absolute inset-0 h-full w-full object-contain object-bottom";

  return (
    // Caixa com a mesma proporção do robô (470×852): capa e vídeo ocupam a mesma área,
    // então o vídeo não "substitui" a capa como maior elemento da tela (LCP).
    <div ref={wrapRef} className={cn("relative mx-auto aspect-[470/852] h-full max-w-full", className)}>
      <Image
        src={poster}
        alt={alt}
        preload={priority}
        sizes={sizes}
        className={cn(layer, "transition-opacity duration-300", ready && "opacity-0")}
      />
      {mode === "webm" && (
        <video
          ref={videoRef}
          src={WEBM}
          muted
          loop
          autoPlay
          playsInline
          aria-hidden="true"
          onPlaying={() => setReady(true)}
          className={cn(layer, "transition-opacity duration-300", ready ? "opacity-100" : "opacity-0")}
        />
      )}
      {mode === "webp" && (
        // eslint-disable-next-line @next/next/no-img-element -- WebP animado: o otimizador do Next não preserva a animação
        <img
          src={WEBP}
          alt=""
          aria-hidden="true"
          onLoad={() => setReady(true)}
          className={cn(layer, "transition-opacity duration-300", ready ? "opacity-100" : "opacity-0")}
        />
      )}
    </div>
  );
}
