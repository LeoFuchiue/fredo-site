/**
 * Conteúdo do site em um só lugar.
 *
 * Fonte das informações do produto: vídeo oficial do fred.o (images/fredo_hero.mp4)
 * e briefing comercial. Regra: nada de números, percentuais, integrações homologadas,
 * preços ou prazos sem confirmação da equipe.
 */

import { whatsappHref } from "@/lib/whatsapp";

export const site = {
  name: "fred.o",
  // trim() remove espaços e caracteres invisíveis que às vezes vêm junto ao colar a variável
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim().replace(/\/+$/, ""),
  title: "fred.o | Robô Inteligente para Restaurantes por Quilo",
  description:
    "Conheça o fred.o, o robô de pesagem autônoma para restaurantes self-service: lê o peso, pede a comanda e envia o valor direto para o PDV. Fale com uma revenda autorizada perto de você.",
  locale: "pt_BR",
  signature: ["Rapidez", "Precisão", "Economia"],
} as const;

export const nav = [
  { href: "/#conheca", label: "O fred.o" },
  { href: "/#funcionalidades", label: "Funcionalidades" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#video", label: "Vídeo" },
  { href: "/#integracao", label: "Integração" },
  { href: "/#contratacao", label: "Contratação" },
] as const;

/**
 * Atendimento ao restaurante é sempre feito por uma revenda autorizada.
 * As chamadas levam à página "Encontre uma revenda" (busca pelo CEP).
 */
const reseller = { href: "/fredo/revendas", label: "Encontre uma revenda" };
export const resellerCta = reseller;

// 1 — Rapidez. Precisão. Economia.
export const hero = {
  title: "Automatize a pesagem do seu restaurante com o fred.o.",
  subtitle:
    "O robô que pesa o prato, pede a comanda e manda o valor direto para o caixa. Sem fila e sem funcionário parado na balança do seu self-service.",
  primaryCta: { href: "#como-funciona", label: "Veja como funciona" },
  secondaryCta: reseller,
};

// 2 — Conheça o fred.o
export const about = {
  eyebrow: "Conheça o fred.o",
  title: "Um robô que cuida da balança por você.",
  text: "O fred.o fica ao lado da balança do seu self-service e faz a pesagem sozinho: lê o peso do prato, mostra o valor na tela, pede para o cliente bipar a comanda e envia tudo para o PDV.",
  personality:
    "De smoking e gravata-borboleta, ele recebe cada cliente na balança com a mesma atenção, do primeiro ao último prato do dia.",
  facts: [
    "Feito para self-service por quilo",
    "Pesa cada prato sem ajuda de funcionário",
    "Mostra peso e valor na tela",
    "Lê a comanda e envia o valor ao PDV",
  ],
} as const;

// 3 — Funcionalidades (imagens: telas reais do fred.o extraídas do vídeo oficial)
export const features = {
  eyebrow: "Funcionalidades",
  title: "Tecnologia que faz parte da sua operação.",
  items: [
    {
      id: "pesagem",
      title: "Pesagem de refeições",
      text: "O cliente coloca o prato na balança e o fred.o faz a leitura do peso.",
      screen: "/fredo/telas/fredo-tela-balanca.webp",
      screenAlt: "Tela real do fred.o: Almoço, peso lido 0.530 kg, total R$ 95,29, com o desenho de um prato na balança",
    },
    {
      id: "peso-valor",
      title: "Peso e valor na tela",
      text: "O peso lido e o total da refeição aparecem na tela, de forma clara para o cliente.",
      screen: "/fredo/telas/fredo-tela-total.webp",
      screenAlt: "Detalhe da tela real do fred.o: peso lido 0.530 kg e total R$ 95,29",
    },
    {
      id: "comanda",
      title: "Leitura de comandas",
      text: "Com o valor na tela, o fred.o orienta o cliente a passar a comanda no leitor.",
      screen: "/fredo/telas/fredo-tela-comanda.webp",
      screenAlt: "Tela real do fred.o pedindo para passar a comanda no leitor de código de barras, com peso e total",
    },
    {
      id: "pdv",
      title: "Integração com PDV",
      text: "A pesagem é registrada na comanda, em sistemas de PDV homologados.",
      screen: "/fredo/telas/fredo-tela-processando.webp",
      screenAlt: "Tela real do fred.o: Processando, comanda 127",
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
      text: "O cliente se serve e pesa o prato. O fred.o mostra o peso e o total.",
      screen: "/fredo/telas/fredo-tela-balanca.webp",
    },
    {
      title: "Comanda no leitor",
      text: "O fred.o pede para o cliente passar a comanda no leitor.",
      screen: "/fredo/telas/fredo-tela-comanda.webp",
    },
    {
      title: "Processando",
      text: "A pesagem é registrada na comanda do cliente.",
      screen: "/fredo/telas/fredo-tela-processando.webp",
    },
    {
      title: "Concluído",
      text: "O fred.o confirma e agradece. Pronto para o próximo cliente.",
      screen: "/fredo/telas/fredo-tela-concluido.webp",
    },
  ],
} as const;

// 5 — Diferenciais: os ganhos concretos na operação (sem números nem percentuais)
export const pillars = {
  eyebrow: "Diferenciais",
  title: "O que muda no seu restaurante.",
  items: [
    {
      title: "Sem fila",
      text: "Cada cliente pesa o prato, bipa a comanda e segue para a mesa. A balança deixa de ser o gargalo do horário de almoço.",
    },
    {
      title: "Sem funcionário na balança",
      text: "Ninguém precisa ficar parado na pesagem. Sua equipe vai para o salão, a reposição do buffet ou o caixa.",
    },
    {
      title: "Sem digitar o peso",
      text: "O peso e o valor vão direto para a comanda no PDV. Sem anotar, sem redigitar e sem erro de lançamento.",
    },
  ],
} as const;

// 6 — Vídeo
export const videoShowcase = {
  eyebrow: "Veja o fred.o em ação",
  title: "Conheça o fred.o funcionando.",
  src: "/fredo/video/fredo-em-acao.mp4",
  poster: "/fredo/video/fredo-em-acao-poster.webp",
  // Texto que aparece na tela do vídeo (para leitores de tela).
  transcript:
    "Vídeo: Hora do almoço. Fila na balança? Oi! Eu sou o fred.o, o robô de pesagem autônoma para restaurantes self-service. Como funciona: 1. Prato na balança: o cliente se serve e pesa. 2. fred.o lê o peso e pede para bipar a comanda. 3. Valor direto no caixa, integrado ao seu PDV. Pesagem 100% autônoma. Sem fila. Sem funcionário na balança.",
  cta: reseller,
} as const;

// 7 — Tecnologia e integração (sem citar sistemas homologados)
export const integration = {
  eyebrow: "Tecnologia e integração",
  title: "Conectado à operação do seu restaurante.",
  text: "O fred.o foi pensado para trabalhar junto com o sistema de gestão do restaurante: o valor de cada pesagem segue para o caixa, sem precisar ser digitado de novo.",
  note: "O fred.o funciona com sistemas de PDV e balanças homologados. A revenda da sua região confirma se o seu sistema é compatível antes da instalação.",
  flow: ["Balança", "fred.o", "Comanda", "PDV homologado"],
  cta: { href: "/fredo/revendas", label: "Consultar com uma revenda" },
} as const;

// 8 — Contratação (locação mensal, sem preços nem prazos; atendimento pelas revendas)
export const hiring = {
  eyebrow: "Contratação",
  title: "Leve o fred.o para o seu restaurante.",
  text: "O fred.o é alugado, não vendido: o restaurante paga uma mensalidade e usa o equipamento sem precisar comprá-lo. Quem cuida de tudo é uma revenda autorizada perto de você.",
  points: [
    { title: "Sem compra do equipamento", text: "Locação mensal: você usa o fred.o sem investir na aquisição do robô." },
    { title: "Revenda perto de você", text: "Uma revenda autorizada da sua região apresenta o fred.o, faz a instalação e dá o suporte." },
    { title: "Proposta para a sua operação", text: "Valores e condições são apresentados pela revenda, de acordo com o seu restaurante." },
  ],
  cta: { href: "/fredo/revendas", label: "Encontre uma revenda" },
} as const;

// 9 — Encontre uma revenda (o contato do restaurante vai para a revenda da região)
export const contact = {
  eyebrow: "Revendas autorizadas",
  title: "Encontre a revenda fred.o mais próxima.",
  description:
    "Digite o CEP do seu restaurante e veja as revendas autorizadas da sua região. Elas mostram o fred.o funcionando, tiram suas dúvidas, fazem a instalação e cuidam do seu atendimento.",
  cta: { href: whatsappHref("demo"), label: "Falar com a nossa equipe" },
} as const;
