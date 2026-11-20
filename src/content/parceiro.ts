/**
 * Conteúdo da página "Seja um parceiro fred.o" (/fredo/parceiro).
 *
 * Fonte: contrato de parceria comercial e revenda do fred.o. Parceria não exclusiva,
 * sem metas mínimas; nós contratamos e faturamos o restaurante direto e o parceiro
 * recebe comissão recorrente sobre as mensalidades pagas pelos clientes que trouxe.
 *
 * Regra: NÃO publicar o percentual nem valores da comissão. A página desperta a
 * curiosidade e os valores são apresentados pela equipe na conversa pelo WhatsApp.
 */

import { whatsappHref } from "@/lib/whatsapp";

const cta = { href: whatsappHref("partner"), label: "Quero ser parceiro" };
const earningsCta = { href: whatsappHref("partner"), label: "Quero saber quanto posso ganhar" };

export const partnerMeta = {
  path: "/fredo/parceiro",
  title: "Seja um parceiro fred.o",
  description:
    "Revenda o fred.o, o robô de pesagem autônoma para restaurantes self-service, e receba comissão recorrente todo mês, sem comprar equipamento nem cobrar o cliente.",
} as const;

export const partnerHero = {
  eyebrow: "Programa de parceiros",
  title: "Seja um parceiro fred.o.",
  subtitle:
    "Leve a pesagem autônoma aos restaurantes da sua região e ganhe uma comissão recorrente, todo mês, enquanto o cliente estiver ativo.",
  primaryCta: cta,
  secondaryCta: { href: "#como-funciona", label: "Como funciona" },
  highlight: {
    value: "Todo mês.",
    label: "Cada cliente que você traz vira uma comissão que se repete. Quanto? A gente conta no WhatsApp.",
  },
} as const;

export const partnerBenefits = {
  eyebrow: "Por que ser parceiro",
  title: "Uma receita que se repete todo mês.",
  items: [
    {
      title: "Comissão recorrente",
      text: "Você ganha sobre cada mensalidade paga pelos restaurantes que trouxe. Não é uma comissão única: ela se repete enquanto o cliente continuar com o fred.o.",
    },
    {
      title: "Sem estoque e sem compra",
      text: "O equipamento continua sendo nosso. Você não compra robôs para revender nem empata dinheiro em estoque.",
    },
    {
      title: "Sem cobrar o cliente",
      text: "Nós fechamos o contrato, emitimos a cobrança e recebemos do restaurante. Você foca em vender e instalar.",
    },
    {
      title: "Treinamento e suporte",
      text: "Você recebe documentação, orientação técnica e treinamento inicial, além de um canal de suporte direto com a nossa equipe.",
    },
    {
      title: "Liberdade para trabalhar",
      text: "A parceria não é exclusiva e não tem meta mínima. Você continua com a sua empresa e os seus outros produtos.",
    },
    {
      title: "Produto fácil de mostrar",
      text: "O dono do restaurante entende o fred.o em segundos: prato na balança, comanda no leitor e valor direto no caixa.",
    },
  ],
} as const;

export const partnerSteps = {
  eyebrow: "Como funciona",
  title: "Do primeiro contato à primeira comissão.",
  items: [
    {
      title: "Cadastro",
      text: "Você fala com a nossa equipe, conhece o programa e assina o contrato de parceria.",
    },
    {
      title: "Treinamento",
      text: "Você aprende a apresentar o fred.o e a fazer a instalação e a integração com o PDV.",
    },
    {
      title: "Indicação",
      text: "Você prospecta restaurantes e registra cada oportunidade com a nossa equipe, para garantir que o cliente fica atribuído a você.",
    },
    {
      title: "Contrato",
      text: "Nós aprovamos a proposta e fechamos o contrato de locação direto com o restaurante.",
    },
    {
      title: "Instalação",
      text: "Você instala o fred.o, faz os testes e dá o suporte inicial ao cliente.",
    },
    {
      title: "Comissão",
      text: "A cada mensalidade paga pelo restaurante, a sua comissão entra no demonstrativo do mês.",
    },
  ],
} as const;

export const partnerProfile = {
  eyebrow: "Perfil ideal",
  title: "Para quem já circula pelo food service.",
  text: "O programa combina com quem já visita restaurantes ou entende de automação comercial e quer um produto novo, com receita recorrente.",
  items: [
    "Revendas de automação comercial",
    "Técnicos de PDV, balanças e impressoras",
    "Representantes comerciais do food service",
    "Consultores e assessores de restaurantes",
    "Fornecedores de equipamentos para cozinha",
    "Empreendedores com rede de contatos no setor",
  ],
} as const;

export const partnerFaq = {
  eyebrow: "Dúvidas frequentes",
  title: "Perguntas de quem quer ser parceiro.",
  items: [
    {
      q: "Preciso comprar equipamentos para revender?",
      a: "Não. O fred.o é oferecido em locação mensal e o equipamento continua sendo nosso. Você não compra nem mantém estoque.",
    },
    {
      q: "Quem cobra o restaurante?",
      a: "Nós. O contrato e a cobrança são feitos direto entre a nossa empresa e o restaurante. Assim, você não precisa se preocupar em cobrar mensalidades nem negociar descontos: seu foco fica em vender e instalar.",
    },
    {
      q: "Como a comissão é calculada?",
      a: "A comissão é calculada sobre cada mensalidade efetivamente paga pelo restaurante que você trouxe, e você recebe um demonstrativo todo mês. Os valores são apresentados pela nossa equipe na conversa de cadastro: chame a gente no WhatsApp.",
    },
    {
      q: "Por quanto tempo recebo?",
      a: "A comissão é recorrente: você recebe enquanto o cliente atribuído a você continuar pagando a mensalidade, conforme o contrato de parceria.",
    },
    {
      q: "Tenho exclusividade na minha região?",
      a: "A parceria padrão não é exclusiva. Condições diferentes, como exclusividade territorial, dependem de um acordo à parte.",
    },
    {
      q: "Existe meta mínima de vendas?",
      a: "Não. O programa não exige metas mínimas.",
    },
    {
      q: "O fred.o funciona com qualquer sistema de caixa?",
      a: "O fred.o funciona integrado a sistemas de PDV e balanças homologados, ou seja, já testados e aprovados pela nossa equipe. Antes de cada venda, confirmamos se o sistema do restaurante é compatível.",
    },
  ],
} as const;

export const partnerContact = {
  eyebrow: "Vamos conversar",
  title: "Quer saber quanto você pode ganhar?",
  description:
    "Chame a nossa equipe no WhatsApp. Contamos quanto você ganha por cliente, como funciona o contrato de parceria e os próximos passos.",
  cta: earningsCta,
} as const;
