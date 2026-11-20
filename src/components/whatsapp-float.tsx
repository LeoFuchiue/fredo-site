"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { MapPin } from "lucide-react";

/**
 * Botão flutuante "Encontre uma revenda" (canto inferior direito), leva à busca por CEP.
 * Some enquanto o formulário de contato está na tela, para não cobrir o envio.
 */
export function WhatsAppFloat() {
  const [formVisible, setFormVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const form = document.getElementById("contato");
    if (!form) return;
    const io = new IntersectionObserver(([e]) => setFormVisible(e.isIntersecting), {
      rootMargin: "0px 0px -30% 0px",
    });
    io.observe(form);
    return () => io.disconnect();
  }, []);

  // Só aparece depois que a pessoa começa a rolar (não cobre o título do topo no celular).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.3);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {scrolled && !formVisible && (
        <m.div
          key="wa-float"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } }}
          exit={{ opacity: 0, y: 16, scale: 0.96, transition: { duration: 0.25 } }}
          className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 md:right-6 md:bottom-6"
        >
          <Link
            href="/fredo/revendas"
            className="group flex items-center gap-2.5 rounded-full bg-ink py-1.5 pr-4 pl-1.5 text-sm font-semibold sm:gap-3 sm:py-2 sm:pr-5 sm:pl-2 sm:text-small text-paper shadow-lift transition-[background-color,transform] duration-300 ease-soft hover:scale-[1.02] hover:bg-graphite motion-reduce:hover:scale-100"
          >
          <span className="flex size-9 items-center justify-center rounded-full bg-terracotta text-paper sm:size-10">
            <MapPin className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <span>Encontre uma revenda</span>
          </Link>
        </m.div>
      )}
    </AnimatePresence>
  );
}
