/**
 * WhatsApp comercial do fred.o: número e mensagens em um só lugar.
 * Para trocar o número, altere só WHATSAPP_NUMBER (DDI + DDD + número, só dígitos).
 */
export const WHATSAPP_NUMBER = "5511977842164";
export const WHATSAPP_DISPLAY = "+55 11 97784-2164";

export const WHATSAPP_MESSAGES = {
  /** Mensagem padrão dos botões comerciais. */
  /** Restaurante procurando a revenda mais próxima. */
  demo: "Olá! Conheci o fred.o pelo site e quero falar com uma revenda perto de mim para ver o fred.o funcionando. Minha cidade é: ",
  commercial: "Olá! Quero saber as condições de locação do fred.o com uma revenda da minha região. Minha cidade é: ",
  partner: "Olá! Vi a página de parceiros do fred.o e quero saber quanto posso ganhar como parceiro.",
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
  city: string;
  whatsapp: string;
  pos: string;
};

/** Pedido de indicação de revenda, com os dados do formulário. */
export function demoRequestMessage(d: DemoRequest): string {
  return [
    "Olá! Conheci o fred.o pelo site e quero falar com uma revenda perto de mim.",
    "",
    `Nome: ${d.name}`,
    `Restaurante: ${d.restaurant}`,
    `Cidade/UF: ${d.city}`,
    `WhatsApp: ${d.whatsapp}`,
    `Sistema de PDV: ${d.pos}`,
  ].join("\n");
}
