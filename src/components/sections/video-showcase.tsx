"use client";

import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { videoShowcase } from "@/content/site";
import { Reveal } from "../reveal";
import { SectionLabel } from "../brand";
import { ButtonLink, cn } from "../ui";

const controlBtn =
  "flex size-9 items-center justify-center rounded-full border border-paper/15 bg-ink/50 text-paper backdrop-blur-md transition-[background-color,border-color] duration-300 hover:border-paper/40 hover:bg-ink/70 md:size-11";

/**
 * Vídeo do Fred.o em destaque.
 * - cresce conforme a seção entra na tela (efeito cinema)
 * - toca sozinho, sem som, só enquanto está visível; pausa fora da tela
 * - o vídeo só é baixado quando a seção se aproxima (preload="none")
 * - com "reduzir movimento", não toca sozinho: mostra a capa e o botão de play
 */
export function VideoShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const userPaused = useRef(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.92, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [reduce ? 16 : 32, 16]);

  // Toca quando está visível, pausa quando sai da tela.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !reduce && !userPaused.current) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.45 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  }

  function toggleSound() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) v.play().catch(() => {});
  }

  function fullscreen() {
    const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
    else v.webkitEnterFullscreen?.(); // iPhone
  }

  return (
    <section
      ref={sectionRef}
      id="video"
      aria-labelledby="video-title"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div className="container-page">
        <Reveal as="header" className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-4 text-center md:mb-16">
          <SectionLabel>{videoShowcase.eyebrow}</SectionLabel>
          <h2 id="video-title" className="text-balance text-h3 font-bold md:text-h2">
            {videoShowcase.title}
          </h2>
        </Reveal>

        <div className="relative">
          <m.figure
            style={{ scale, borderRadius: radius }}
            className="relative mx-auto aspect-video w-full max-w-[1280px] overflow-hidden border border-line bg-[#0d1a3a] shadow-lift"
          >
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={videoShowcase.src}
              poster={videoShowcase.poster}
              muted
              loop
              playsInline
              preload="none"
              aria-describedby="video-descricao"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration) setProgress(v.currentTime / v.duration);
              }}
              onClick={togglePlay}
            />

            {/* Play grande quando parado */}
            {!playing && (
              <button
                type="button"
                onClick={togglePlay}
                aria-label="Reproduzir vídeo"
                className="absolute inset-0 m-auto flex size-20 items-center justify-center rounded-full bg-paper text-ink shadow-lift transition-transform duration-300 ease-soft hover:scale-[1.04] md:size-24"
              >
                <Play className="ml-1 size-8 fill-current" strokeWidth={1.5} aria-hidden="true" />
              </button>
            )}

            {/* Controles */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 md:bottom-6 md:left-5">
                <button type="button" onClick={togglePlay} aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"} className={controlBtn}>
                  {playing ? (
                    <Pause className="size-4 fill-current" strokeWidth={1.5} aria-hidden="true" />
                  ) : (
                    <Play className="ml-0.5 size-4 fill-current" strokeWidth={1.5} aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={toggleSound}
                  aria-label={muted ? "Ativar som" : "Desativar som"}
                  aria-pressed={!muted}
                  className={cn(controlBtn, "w-auto gap-2 px-3 text-sm font-medium md:w-auto md:px-4")}
                >
                  {muted ? (
                    <VolumeX className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  ) : (
                    <Volume2 className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  )}
                  <span className="hidden sm:inline">{muted ? "Ativar som" : "Som ativado"}</span>
                </button>
            </div>
            <button
              type="button"
              onClick={fullscreen}
              aria-label="Ver em tela cheia"
              className={cn(controlBtn, "absolute top-3 right-3 md:top-5 md:right-5")}
            >
              <Maximize2 className="size-4" strokeWidth={1.5} aria-hidden="true" />
            </button>

            {/* Barra de progresso */}
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-paper/10">
              <div
                className="h-full origin-left bg-terracotta transition-transform duration-300 ease-linear"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>

            <figcaption id="video-descricao" className="sr-only">
              {videoShowcase.transcript}
            </figcaption>
          </m.figure>
        </div>

        <Reveal className="mt-12 flex flex-col items-center gap-4 text-center md:mt-16">
          <ButtonLink href={videoShowcase.cta.href} whatsapp className="w-full sm:w-auto">
            {videoShowcase.cta.label}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
