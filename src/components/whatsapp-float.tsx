"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { externalLinkProps } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./whatsapp-icon";

/**
 * Botão flutuante "Encontre uma revenda" (canto inferior direito), leva à busca por CEP.
 * Some enquanto o formulário de contato está na tela, para não cobrir o envio.
 */
type FloatCta = { href: string; label: string };

/**
 * No celular o topo não tem espaço para o botão de destaque, então ele fica aqui,
 * na área do polegar. A partir de 640px o botão aparece no topo e este some.
 */
export function WhatsAppFloat({ cta = { href: "/fredo/revendas", label: "Encontre uma revenda" } }: { cta?: FloatCta } = {}) {
  const externo = /^https?:\/\//.test(cta.href);
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
          className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 sm:hidden"
        >
          <Link
            href={cta.href}
            {...(externo ? externalLinkProps : {})}
            className="flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full bg-terracotta px-5 text-small font-semibold text-paper shadow-lift ring-1 ring-paper/30 transition-colors duration-300 ease-soft active:bg-graphite"
          >
            {externo ? (
              <WhatsAppIcon className="size-5" />
            ) : (
              <MapPin className="size-5" strokeWidth={1.75} aria-hidden="true" />
            )}
            <span>{cta.label}</span>
            {externo && <span className="sr-only"> (abre o WhatsApp em nova aba)</span>}
          </Link>
        </m.div>
      )}
    </AnimatePresence>
  );
}
