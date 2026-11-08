/**
 * Conteúdo do site em um só lugar.
 *
 * Fonte das informações do produto: vídeo oficial do Fred.o (images/fredo_hero.mp4)
 * e briefing comercial. Regra: nada de números, percentuais, integrações homologadas,
 * preços ou prazos sem confirmação da equipe.
 */

import { whatsappHref } from "@/lib/whatsapp";

export const site = {
  name: "Fred.o",
  // trim() remove espaços e caracteres invisíveis que às vezes vêm junto ao colar a variável
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim().replace(/\/+$/, ""),
  title: "Fred.o | Robô Inteligente para Restaurantes por Quilo",
  description:
    "Conheça o Fred.o, robô inteligente para restaurantes self-service. Tecnologia para pesagem, leitura de comandas e integração com PDV compatível.",
  locale: "pt_BR",
  signature: ["Rapidez", "Precisão", "Economia"],
} as const;

export const nav = [
  { href: "#conheca", label: "O Fred.o" },
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#video", label: "Vídeo" },
  { href: "#integracao", label: "Integração" },
  { href: "#contratacao", label: "Contratação" },
] as const;

const demo = { href: whatsappHref("demo"), label: "Agendar demonstração" };

// 1 — Rapidez. Precisão. Economia.
export const hero = {
  title: "Automatize a pesagem do seu restaurante com o Fred.o.",
  subtitle:
    "Conheça o robô inteligente desenvolvido para modernizar seu buffet por quilo, simplificar a operação e oferecer uma experiência mais ágil aos seus clientes.",
  primaryCta: { href: "#conheca", label: "Conheça o Fred.o" },
  secondaryCta: demo,
};

// 2 — Conheça o Fred.o
export const about = {
  eyebrow: "Conheça o Fred.o",
  title: "Seu buffet mais inteligente começa aqui.",
  text: "O Fred.o é um robô inteligente desenvolvido para restaurantes self-service por quilo. Ele participa do processo de pesagem, apresenta as informações da refeição na tela e realiza a leitura de comandas.",
  personality:
    "De smoking e gravata-borboleta, ele recebe cada cliente na balança com a mesma atenção, do primeiro ao último prato do dia.",
  facts: [
    "Feito para self-service por quilo",
    "Participa da pesagem de cada prato",
    "Mostra peso e valor na tela",
    "Lê a comanda do cliente",
  ],
} as const;

// 3 — Funcionalidades (imagens: telas reais do Fred.o extraídas do vídeo oficial)
export const features = {
  eyebrow: "Funcionalidades",
  title: "Tecnologia que faz parte da sua operação.",
  items: [
    {
      id: "pesagem",
      title: "Pesagem de refeições",
      text: "O cliente coloca o prato na balança e o Fred.o faz a leitura do peso.",
      screen: "/fredo/telas/fredo-tela-balanca.webp",
      screenAlt: "Tela real do Fred.o: Almoço, peso lido 0.530 kg, total R$ 95,29, com o desenho de um prato na balança",
    },
    {
      id: "peso-valor",
      title: "Peso e valor na tela",
      text: "O peso lido e o total da refeição aparecem na tela, de forma clara para o cliente.",
      screen: "/fredo/telas/fredo-tela-total.webp",
      screenAlt: "Detalhe da tela real do Fred.o: peso lido 0.530 kg e total R$ 95,29",
    },
    {
      id: "comanda",
      title: "Leitura de comandas",
      text: "Com o valor na tela, o Fred.o orienta o cliente a passar a comanda no leitor.",
      screen: "/fredo/telas/fredo-tela-comanda.webp",
      screenAlt: "Tela real do Fred.o pedindo para passar a comanda no leitor de código de barras, com peso e total",
    },
    {
      id: "pdv",
      title: "Integração com PDV",
      text: "A pesagem é registrada na comanda, em sistemas de PDV compatíveis.",
      screen: "/fredo/telas/fredo-tela-processando.webp",
      screenAlt: "Tela real do Fred.o: Processando, comanda 127",
    },
  ],
} as const;

// 4 — Como funciona (sequência das telas reais do equipamento)
export const steps = {
  eyebrow: "Como funciona",
  title: "Simples para o cliente. Inteligente para o restaurante.",
  items: [
    {
      title: "Prato na balança",
      text: "O cliente se serve e pesa o prato. O Fred.o mostra o peso e o total.",
      screen: "/fredo/telas/fredo-tela-balanca.webp",
    },
    {
      title: "Comanda no leitor",
      text: "O Fred.o pede para o cliente passar a comanda no leitor.",
      screen: "/fredo/telas/fredo-tela-comanda.webp",
    },
    {
      title: "Processando",
      text: "A pesagem é registrada na comanda do cliente.",
      screen: "/fredo/telas/fredo-tela-processando.webp",
    },
    {
      title: "Concluído",
      text: "O Fred.o confirma e agradece. Pronto para o próximo cliente.",
      screen: "/fredo/telas/fredo-tela-concluido.webp",
    },
  ],
} as const;

// 5 — Diferenciais (sem números nem promessas mensuráveis)
export const pillars = {
  eyebrow: "Diferenciais",
  title: "Uma nova maneira de pensar a pesagem.",
  items: [
    {
      title: "Rapidez",
      text: "Uma proposta de operação mais ágil, com tecnologia aplicada ao processo de pesagem.",
    },
    {
      title: "Precisão",
      text: "Informações de pesagem apresentadas pelo equipamento, conforme suas especificações técnicas.",
    },
    {
      title: "Economia",
      text: "Um modelo de solução que busca eficiência operacional, com condições comerciais adequadas à contratação.",
    },
  ],
} as const;

// 6 — Vídeo
export const videoShowcase = {
  eyebrow: "Veja o Fred.o em ação",
  title: "Conheça o Fred.o funcionando.",
  src: "/fredo/video/fredo-em-acao.mp4",
  poster: "/fredo/video/fredo-em-acao-poster.webp",
  // Texto que aparece na tela do vídeo (para leitores de tela).
  transcript:
    "Vídeo: Hora do almoço. Fila na balança? Oi! Eu sou o fred.o, o robô de pesagem autônoma para restaurantes self-service. Como funciona: 1. Prato na balança: o cliente se serve e pesa. 2. fred.o lê o peso e pede para bipar a comanda. 3. Valor direto no caixa, integrado ao seu PDV. Pesagem 100% autônoma. Sem fila. Sem funcionário na balança.",
  cta: demo,
} as const;

// 7 — Tecnologia e integração (sem citar sistemas homologados)
export const integration = {
  eyebrow: "Tecnologia e integração",
  title: "Conectado à operação do seu restaurante.",
  text: "O Fred.o foi pensado para trabalhar junto com o sistema de gestão do restaurante: o valor de cada pesagem segue para o caixa, sem precisar ser digitado de novo.",
  note: "A compatibilidade com o seu sistema de PDV é avaliada pela nossa equipe antes da instalação.",
  flow: ["Balança", "Fred.o", "Comanda", "PDV compatível"],
  cta: { href: "#contato", label: "Informe o seu PDV" },
} as const;

// 8 — Contratação (Hardware as a Service, sem preços nem prazos)
export const hiring = {
  eyebrow: "Contratação",
  title: "Leve a tecnologia Fred.o para o seu restaurante.",
  text: "O Fred.o é oferecido no modelo Hardware as a Service: em vez de comprar o equipamento, o restaurante contrata o uso por assinatura.",
  points: [
    { title: "Sem compra do equipamento", text: "Você usa o Fred.o por assinatura, sem investir na aquisição do hardware." },
    { title: "Proposta para a sua operação", text: "As condições são definidas de acordo com o seu restaurante." },
    { title: "Atendimento comercial direto", text: "Valores e condições são apresentados pela nossa equipe." },
  ],
  cta: { href: whatsappHref("commercial"), label: "Consultar condições comerciais" },
} as const;

// 9 — Contato comercial
export const contact = {
  eyebrow: "Contato comercial",
  title: "Pronto para conhecer o Fred.o?",
  description:
    "Converse com nossa equipe, tire suas dúvidas e descubra como o Fred.o pode fazer parte do seu restaurante.",
  cta: demo,
} as const;
