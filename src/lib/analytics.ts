/**
 * Google Analytics 4: helpers de eventos.
 * Só funciona quando NEXT_PUBLIC_GA_ID está configurado (Vercel → Environment Variables).
 * Sem o ID, as chamadas não fazem nada.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() || "";

export const CONSENT_KEY = "fredo-consentimento-analytics";
export type ConsentChoice = "aceito" | "recusado";

type Gtag = (...args: unknown[]) => void;

function gtag(): Gtag | null {
  if (typeof window === "undefined") return null;
  const g = (window as unknown as { gtag?: Gtag }).gtag;
  return typeof g === "function" ? g : null;
}

/** Envia um evento ao GA4 (sem dados pessoais). */
export function track(event: string, params: Record<string, string | number> = {}) {
  gtag()?.("event", event, params);
}

export function updateConsent(choice: ConsentChoice) {
  gtag()?.("consent", "update", { analytics_storage: choice === "aceito" ? "granted" : "denied" });
}
