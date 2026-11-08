"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_KEY, GA_ID, track, updateConsent, type ConsentChoice } from "@/lib/analytics";

/** Onde o botão está: cabeçalho, rodapé, botão flutuante ou a seção da página. */
function locationOf(el: Element): string {
  if (el.closest("header")) return "cabecalho";
  if (el.closest("footer")) return "rodape";
  if (el.getAttribute("aria-label")?.startsWith("Fale com nossa equipe")) return "botao_flutuante";
  const section = el.closest("section[id], section[aria-labelledby]");
  return section?.id || section?.getAttribute("aria-labelledby")?.replace("-title", "") || "pagina";
}

function readConsent(): ConsentChoice | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "aceito" || v === "recusado" ? v : null;
  } catch {
    return null;
  }
}

/**
 * GA4 + aviso de cookies (LGPD).
 * - Sem NEXT_PUBLIC_GA_ID: não renderiza nada e não carrega nenhum script.
 * - Com ID: Consent Mode v2 começa "negado"; só grava cookies de análise depois do "Aceitar".
 * - Eventos: cliques em links do WhatsApp (todos os botões comerciais) com texto e local.
 */
export function Analytics() {
  const [consent, setConsent] = useState<ConsentChoice | null>(null);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    // lê a escolha salva fora do ciclo síncrono do efeito (evita renderizações em cascata)
    queueMicrotask(() => {
      const saved = readConsent();
      setConsent(saved);
      setAsked(saved !== null);
    });

    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href*="wa.me"]');
      if (!link) return;
      const text = (link.textContent || link.getAttribute("aria-label") || "").replace(/\s+/g, " ").replace("(abre em nova aba)", "").trim();
      const where = locationOf(link);
      track("whatsapp_click", { cta_text: text.slice(0, 80), cta_location: where });
      if (/agendar demonstra/i.test(text)) track("agendar_demonstracao_click", { cta_location: where });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!GA_ID) return null;

  function choose(choice: ConsentChoice) {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {}
    setConsent(choice);
    setAsked(true);
    updateConsent(choice);
  }

  return (
    <>
      <Script id="ga-consent-default" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
var c=null;try{c=localStorage.getItem(${JSON.stringify(CONSENT_KEY)});}catch(e){}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:c==='aceito'?'granted':'denied'});
gtag('js',new Date());gtag('config',${JSON.stringify(GA_ID)},{anonymize_ip:true});`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />

      {!asked && consent === null && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Aviso de cookies"
          className="fixed inset-x-3 bottom-20 z-50 rounded-card border border-line bg-paper p-5 shadow-lift sm:right-auto sm:bottom-6 sm:left-6 sm:max-w-sm"
        >
          <p className="text-small text-graphite">
            Usamos cookies de análise para entender como o site é usado e melhorar a experiência. Você escolhe.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => choose("aceito")}
              className="rounded-button bg-ink px-4 py-2 text-small font-semibold text-paper transition-colors duration-300 hover:bg-graphite"
            >
              Aceitar
            </button>
            <button
              type="button"
              onClick={() => choose("recusado")}
              className="rounded-button border border-line px-4 py-2 text-small font-semibold text-ink transition-colors duration-300 hover:bg-cream"
            >
              Recusar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
