"use client";

import { useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { track } from "@/lib/analytics";
import { externalLinkProps, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./whatsapp-icon";
import { buttonBase, buttonVariants, cn } from "./ui";

const segmentos = [
  "Revenda de automação comercial",
  "Técnico de PDV, balanças ou impressoras",
  "Representante comercial do food service",
  "Consultoria para restaurantes",
  "Outro",
] as const;

const carteiras = ["Ainda nenhum", "Até 10", "De 11 a 50", "Mais de 50"] as const;

type Dados = {
  nome: string;
  empresa: string;
  cidade: string;
  whatsapp: string;
  segmento: string;
  carteira: string;
};
type Erros = Partial<Record<keyof Dados, string>>;

const inputBase =
  "w-full rounded-field border bg-paper px-4 py-3.5 text-small text-ink placeholder:text-muted/80 outline-none transition-[border-color,box-shadow] duration-300 hover:border-muted/50 focus:border-terracotta focus:shadow-[0_0_0_3px_rgb(197_106_55/0.15)]";

function validar(d: Dados): Erros {
  const e: Erros = {};
  if (d.nome.length < 2) e.nome = "Informe o seu nome.";
  if (d.empresa.length < 2) e.empresa = "Informe o nome da empresa (ou o seu, se for autônomo).";
  if (d.cidade.length < 2) e.cidade = "Informe a cidade onde você atua.";
  const n = d.whatsapp.replace(/\D/g, "");
  if (n.length < 10 || n.length > 13) e.whatsapp = "Informe um WhatsApp com DDD.";
  if (!d.segmento) e.segmento = "Escolha o que mais se parece com você.";
  if (!d.carteira) e.carteira = "Escolha uma opção.";
  return e;
}

function mensagem(d: Dados): string {
  return [
    "Olá! Vi a página de parceiros do fred.o e quero saber quanto posso ganhar como parceiro.",
    "",
    `Nome: ${d.nome}`,
    `Empresa: ${d.empresa}`,
    `Cidade/UF: ${d.cidade}`,
    `WhatsApp: ${d.whatsapp}`,
    `Atuação: ${d.segmento}`,
    `Restaurantes que atendo hoje: ${d.carteira}`,
  ].join("\n");
}

/** Formulário de interesse do parceiro: qualifica o contato e abre o WhatsApp da equipe. Nada fica salvo. */
export function PartnerForm({ inverted }: { inverted?: boolean }) {
  const [erros, setErros] = useState<Erros>({});
  const [link, setLink] = useState<string | null>(null);
  const ref = useRef<HTMLFormElement>(null);

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const campo = (k: keyof Dados, max = 120) => String(fd.get(k) ?? "").trim().slice(0, max);
    const d: Dados = {
      nome: campo("nome"),
      empresa: campo("empresa", 160),
      cidade: campo("cidade"),
      whatsapp: campo("whatsapp", 40),
      segmento: campo("segmento"),
      carteira: campo("carteira"),
    };
    const errs = validar(d);
    setErros(errs);
    if (Object.keys(errs).length) {
      ref.current?.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      setLink(null);
      return;
    }
    const href = whatsappLink(mensagem(d));
    const a = document.createElement("a");
    a.href = href;
    a.target = externalLinkProps.target;
    a.rel = externalLinkProps.rel;
    a.click();
    setLink(href);
    track("parceiro_form_enviado", { segmento: d.segmento, carteira: d.carteira });
  }

  const label = cn("text-small font-medium", inverted ? "text-paper" : "text-ink");
  const erro = (k: keyof Dados) =>
    erros[k] && (
      <p id={`parceiro-${k}-erro`} className={cn("text-sm", inverted ? "text-[#ffb4a0]" : "text-danger")}>
        {erros[k]}
      </p>
    );
  const campo = (k: keyof Dados) => ({
    id: `parceiro-${k}`,
    name: k,
    "aria-invalid": Boolean(erros[k]),
    "aria-describedby": erros[k] ? `parceiro-${k}-erro` : undefined,
    className: cn(inputBase, erros[k] ? "border-danger" : "border-line"),
  });

  return (
    <form ref={ref} onSubmit={enviar} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="parceiro-nome" className={label}>Nome</label>
          <input {...campo("nome")} autoComplete="name" placeholder="Seu nome" />
          {erro("nome")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="parceiro-empresa" className={label}>Empresa</label>
          <input {...campo("empresa")} autoComplete="organization" placeholder="Nome da empresa" />
          {erro("empresa")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="parceiro-cidade" className={label}>Cidade / UF onde atua</label>
          <input {...campo("cidade")} autoComplete="address-level2" placeholder="Ex.: Atibaia / SP" />
          {erro("cidade")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="parceiro-whatsapp" className={label}>WhatsApp</label>
          <input {...campo("whatsapp")} type="tel" inputMode="tel" autoComplete="tel" placeholder="(11) 90000-0000" />
          {erro("whatsapp")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="parceiro-segmento" className={label}>O que você faz hoje?</label>
          <select {...campo("segmento")} defaultValue="">
            <option value="" disabled>Escolha uma opção</option>
            {segmentos.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {erro("segmento")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="parceiro-carteira" className={label}>Quantos restaurantes você atende?</label>
          <select {...campo("carteira")} defaultValue="">
            <option value="" disabled>Escolha uma opção</option>
            {carteiras.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          {erro("carteira")}
        </div>
      </div>

      <button type="submit" className={cn(buttonBase, inverted ? buttonVariants.inverse : buttonVariants.primary, "mt-1 w-full")}>
        <WhatsAppIcon className="size-5 shrink-0" />
        Quero saber quanto posso ganhar
        <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
      </button>

      <div aria-live="polite" className="min-h-5">
        {link && (
          <p className={cn("text-center text-sm", inverted ? "text-paper/80" : "text-graphite")}>
            Abrimos o WhatsApp com os seus dados. Para concluir, é só enviar por lá.{" "}
            <a
              href={link}
              {...externalLinkProps}
              className={cn("inline-flex items-center gap-1 font-semibold underline underline-offset-4", inverted ? "text-paper" : "text-ink")}
            >
              Não abriu? Clique aqui
              <ExternalLink className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            </a>
          </p>
        )}
      </div>
      <p className={cn("text-center text-sm", inverted ? "text-paper/60" : "text-muted")}>
        Seus dados não ficam salvos no site: eles vão apenas na mensagem que você envia pelo WhatsApp.
      </p>
    </form>
  );
}
