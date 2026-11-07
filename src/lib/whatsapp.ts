/**
 * WhatsApp comercial do Fred.o: número e mensagens em um só lugar.
 * Para trocar o número, altere só WHATSAPP_NUMBER (DDI + DDD + número, só dígitos).
 */
export const WHATSAPP_NUMBER = "5511977842164";
export const WHATSAPP_DISPLAY = "+55 11 97784-2164";

export const WHATSAPP_MESSAGES = {
  /** Mensagem padrão dos botões comerciais. */
  demo: "Olá! Conheci o Fred.o pelo site e gostaria de saber mais sobre o equipamento e agendar uma demonstração.",
  commercial: "Olá! Gostaria de receber mais informações sobre o Fred.o e suas condições de contratação.",
} as const;

export type WhatsAppIntent = keyof typeof WHATSAPP_MESSAGES;

/** Gera o link oficial wa.me, com a mensagem codificada. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Atalho para as mensagens padrão. */
export const whatsappHref = (intent: WhatsAppIntent) => whatsappLink(WHATSAPP_MESSAGES[intent]);

/** Atributos para abrir em nova aba com segurança. */
export const externalLinkProps = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

export type DemoRequest = {
  name: string;
  restaurant: string;
  whatsapp: string;
  pos: string;
};

/** Mensagem de pedido de demonstração com os dados do formulário. */
export function demoRequestMessage(d: DemoRequest): string {
  return [
    WHATSAPP_MESSAGES.demo,
    "",
    `Nome: ${d.name}`,
    `Restaurante: ${d.restaurant}`,
    `WhatsApp: ${d.whatsapp}`,
    `Sistema de PDV: ${d.pos}`,
  ].join("\n");
}
