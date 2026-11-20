"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ExternalLink, LoaderCircle, MapPin } from "lucide-react";
import { revendas } from "@/content/revendas";
import { track } from "@/lib/analytics";
import { buscarCep, encontrarRevendas, mascaraCep, somenteDigitos } from "@/lib/cep";
import { buscarCnpj, cnpjValido, mascaraCnpj } from "@/lib/cnpj";
import { externalLinkProps, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./whatsapp-icon";
import { buttonBase, buttonVariants, cn } from "./ui";

/**
 * Pedido de atendimento do restaurante ("Encontre uma revenda").
 * O restaurante preenche os dados, o WhatsApp da fred.o abre com tudo pronto
 * e a equipe repassa o contato para a revenda autorizada da região.
 * O site não mostra dados das revendas e não guarda nada do formulário.
 */

type Campo =
  | "cnpj"
  | "restaurante"
  | "balancas"
  | "pdv"
  | "cep"
  | "rua"
  | "numero"
  | "complemento"
  | "bairro"
  | "cidade"
  | "uf"
  | "nome"
  | "whatsapp"
  | "email"
  | "horario"
  | "lgpd";

type Valores = Record<Exclude<Campo, "lgpd">, string> & { lgpd: boolean };
type Erros = Partial<Record<Campo, string>>;

const vazio: Valores = {
  cnpj: "",
  restaurante: "",
  balancas: "",
  pdv: "",
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
  nome: "",
  whatsapp: "",
  email: "",
  horario: "",
  lgpd: false,
};

const opcoesBalancas = ["1", "2", "3 ou mais", "Ainda não tenho balança"];
const opcoesHorario = ["Manhã", "Tarde", "Qualquer horário"];

function mascaraTelefone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function validar(v: Valores): Erros {
  const e: Erros = {};
  if (!cnpjValido(v.cnpj)) e.cnpj = "Confira o CNPJ: ele tem 14 números.";
  if (v.restaurante.trim().length < 2) e.restaurante = "Informe o nome do restaurante.";
  if (!v.balancas) e.balancas = "Escolha uma opção.";
  if (somenteDigitos(v.cep).length !== 8) e.cep = "Digite os 8 números do CEP.";
  if (v.rua.trim().length < 2) e.rua = "Informe a rua.";
  if (!v.numero.trim()) e.numero = "Informe o número.";
  if (v.bairro.trim().length < 2) e.bairro = "Informe o bairro.";
  if (v.cidade.trim().length < 2) e.cidade = "Informe a cidade.";
  if (!/^[A-Za-z]{2}$/.test(v.uf.trim())) e.uf = "UF com 2 letras.";
  if (v.nome.trim().length < 2) e.nome = "Informe o seu nome.";
  const tel = somenteDigitos(v.whatsapp);
  if (tel.length < 10 || tel.length > 11) e.whatsapp = "Informe um WhatsApp com DDD.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Confira o e-mail.";
  if (!v.lgpd) e.lgpd = "Precisamos da sua autorização para passar os dados à revenda.";
  return e;
}

function mensagem(v: Valores, cobertura: string | null): string {
  const endereco = [
    `${v.rua.trim()}, ${v.numero.trim()}${v.complemento.trim() ? ` - ${v.complemento.trim()}` : ""}`,
    `${v.bairro.trim()} - ${v.cidade.trim()}/${v.uf.trim().toUpperCase()}`,
    `CEP ${mascaraCep(v.cep)}`,
  ].join("\n");
  return [
    "*Novo pedido de revenda pelo site fred.o*",
    "",
    "*Restaurante*",
    `CNPJ: ${mascaraCnpj(v.cnpj)}`,
    `Nome: ${v.restaurante.trim()}`,
    `Balanças: ${v.balancas}`,
    `Sistema de PDV: ${v.pdv.trim() || "Não informado"}`,
    "",
    "*Endereço*",
    endereco,
    "",
    "*Contato*",
    `Responsável: ${v.nome.trim()}`,
    `WhatsApp: ${v.whatsapp}`,
    `E-mail: ${v.email.trim()}`,
    `Melhor horário: ${v.horario || "Qualquer horário"}`,
    "",
    cobertura ? `Região: ${cobertura}` : "Região: sem revenda cadastrada ainda",
    "Autorizou o repasse dos dados à revenda da região: sim",
  ].join("\n");
}

const inputBase =
  "w-full rounded-field border bg-paper px-4 py-3.5 text-small text-ink placeholder:text-muted/80 outline-none transition-[border-color,box-shadow] duration-300 hover:border-muted/50 focus:border-terracotta focus:shadow-[0_0_0_3px_rgb(197_106_55/0.15)] disabled:bg-cream";

export function LeadForm() {
  const [v, setV] = useState<Valores>(vazio);
  const [erros, setErros] = useState<Erros>({});
  const [buscandoCnpj, setBuscandoCnpj] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cobertura, setCobertura] = useState<{ tem: boolean; onde: string } | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const comecou = useRef(false);
  const ultimoCnpj = useRef("");
  const ultimoCep = useRef("");

  const set = (k: Campo, valor: string | boolean) => {
    setV((atual) => ({ ...atual, [k]: valor }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: undefined }));
    if (!comecou.current) {
      comecou.current = true;
      track("lead_form_start");
    }
  };

  async function consultarCep(cep: string, sobrescrever: boolean) {
    const d = somenteDigitos(cep);
    if (d.length !== 8 || d === ultimoCep.current) return;
    ultimoCep.current = d;
    setBuscandoCep(true);
    const local = await buscarCep(d);
    setBuscandoCep(false);
    if (!local) {
      setCobertura(null);
      return;
    }
    setV((atual) => ({
      ...atual,
      rua: sobrescrever || !atual.rua ? (local.rua ?? atual.rua) : atual.rua,
      bairro: sobrescrever || !atual.bairro ? (local.bairro ?? atual.bairro) : atual.bairro,
      cidade: local.cidade,
      uf: local.uf,
    }));
    const r = encontrarRevendas(local, revendas);
    setCobertura({ tem: r.proximas.length > 0, onde: `${local.cidade}/${local.uf}` });
  }

  async function consultarCnpj(cnpj: string) {
    const d = somenteDigitos(cnpj);
    if (!cnpjValido(d) || d === ultimoCnpj.current) return;
    ultimoCnpj.current = d;
    setBuscandoCnpj(true);
    const dados = await buscarCnpj(d);
    setBuscandoCnpj(false);
    if (!dados) return;
    setV((atual) => ({
      ...atual,
      restaurante: atual.restaurante || dados.nome,
      cep: atual.cep || (dados.cep ? mascaraCep(dados.cep) : ""),
      rua: atual.rua || dados.logradouro || "",
      numero: atual.numero || dados.numero || "",
      complemento: atual.complemento || dados.complemento || "",
      bairro: atual.bairro || dados.bairro || "",
      cidade: atual.cidade || dados.cidade || "",
      uf: atual.uf || dados.uf || "",
    }));
    if (dados.cep) void consultarCep(dados.cep, false);
  }

  // CEP vindo da página inicial (?cep=12940280).
  useEffect(() => {
    const inicial = new URLSearchParams(window.location.search).get("cep");
    if (inicial && somenteDigitos(inicial).length === 8) {
      setV((atual) => ({ ...atual, cep: mascaraCep(inicial) }));
      void consultarCep(inicial, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- roda só ao abrir a página
  }, []);

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validar(v);
    setErros(errs);
    const primeiro = Object.keys(errs)[0];
    if (primeiro) {
      formRef.current?.querySelector<HTMLElement>(`[name="${primeiro}"]`)?.focus();
      setLink(null);
      return;
    }
    const href = whatsappLink(mensagem(v, cobertura?.tem ? cobertura.onde : null));
    const a = document.createElement("a");
    a.href = href;
    a.target = externalLinkProps.target;
    a.rel = externalLinkProps.rel;
    a.click();
    setLink(href);
    track("lead_enviado", { uf: v.uf.toUpperCase(), cobertura: cobertura?.tem ? "sim" : "nao", balancas: v.balancas });
  }

  const props = (k: Exclude<Campo, "lgpd">) => ({
    id: `lead-${k}`,
    name: k,
    value: v[k],
    "aria-invalid": Boolean(erros[k]),
    "aria-describedby": erros[k] ? `lead-${k}-erro` : undefined,
    className: cn(inputBase, erros[k] ? "border-danger" : "border-line"),
  });
  const Erro = ({ k }: { k: Campo }) =>
    erros[k] ? (
      <p id={`lead-${k}-erro`} className="text-sm text-danger">
        {erros[k]}
      </p>
    ) : null;
  const Rotulo = ({ k, children, opcional }: { k: Campo; children: React.ReactNode; opcional?: boolean }) => (
    <label htmlFor={`lead-${k}`} className="text-small font-medium text-ink">
      {children}
      {opcional && <span className="font-normal text-muted"> (opcional)</span>}
    </label>
  );

  return (
    <form
      ref={formRef}
      onSubmit={enviar}
      noValidate
      className="grid gap-8 rounded-card border border-line bg-paper p-6 shadow-soft md:p-10"
      aria-label="Pedido de atendimento de uma revenda fred.o"
    >
      {/* 1. Restaurante */}
      <fieldset className="grid gap-5">
        <legend className="mb-1 flex items-center gap-3 text-body font-bold text-ink">
          <span className="flex size-7 items-center justify-center rounded-full bg-ink text-sm text-paper">1</span>
          Seu restaurante
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Rotulo k="cnpj">CNPJ</Rotulo>
            <div className="relative">
              <input
                {...props("cnpj")}
                inputMode="numeric"
                placeholder="00.000.000/0000-00"
                onChange={(e) => {
                  const m = mascaraCnpj(e.target.value);
                  set("cnpj", m);
                  if (somenteDigitos(m).length === 14) void consultarCnpj(m);
                }}
              />
              {buscandoCnpj && (
                <LoaderCircle className="absolute top-1/2 right-4 size-5 -translate-y-1/2 animate-spin text-muted" aria-hidden="true" />
              )}
            </div>
            <Erro k="cnpj" />
            <p className="text-sm text-muted">Com o CNPJ, preenchemos o nome e o endereço para você.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Rotulo k="restaurante">Nome do restaurante</Rotulo>
            <input {...props("restaurante")} autoComplete="organization" placeholder="Nome do restaurante" onChange={(e) => set("restaurante", e.target.value)} />
            <Erro k="restaurante" />
          </div>
          <div className="flex flex-col gap-2">
            <Rotulo k="balancas">Quantas balanças de pesagem?</Rotulo>
            <select {...props("balancas")} onChange={(e) => set("balancas", e.target.value)}>
              <option value="" disabled>
                Escolha uma opção
              </option>
              {opcoesBalancas.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <Erro k="balancas" />
          </div>
          <div className="flex flex-col gap-2">
            <Rotulo k="pdv" opcional>
              Sistema de caixa (PDV)
            </Rotulo>
            <input {...props("pdv")} placeholder="Nome do sistema ou “não sei”" onChange={(e) => set("pdv", e.target.value)} />
          </div>
        </div>
      </fieldset>

      {/* 2. Endereço */}
      <fieldset className="grid gap-5">
        <legend className="mb-1 flex items-center gap-3 text-body font-bold text-ink">
          <span className="flex size-7 items-center justify-center rounded-full bg-ink text-sm text-paper">2</span>
          Endereço do restaurante
        </legend>
        <div className="grid gap-5 sm:grid-cols-6">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Rotulo k="cep">CEP</Rotulo>
            <div className="relative">
              <input
                {...props("cep")}
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                onChange={(e) => {
                  const m = mascaraCep(e.target.value);
                  set("cep", m);
                  if (somenteDigitos(m).length === 8) void consultarCep(m, true);
                }}
              />
              {buscandoCep && (
                <LoaderCircle className="absolute top-1/2 right-4 size-5 -translate-y-1/2 animate-spin text-muted" aria-hidden="true" />
              )}
            </div>
            <Erro k="cep" />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-4">
            <Rotulo k="rua">Rua</Rotulo>
            <input {...props("rua")} autoComplete="address-line1" placeholder="Rua, avenida…" onChange={(e) => set("rua", e.target.value)} />
            <Erro k="rua" />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Rotulo k="numero">Número</Rotulo>
            <input {...props("numero")} inputMode="numeric" placeholder="Nº" onChange={(e) => set("numero", e.target.value)} />
            <Erro k="numero" />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-4">
            <Rotulo k="complemento" opcional>
              Complemento
            </Rotulo>
            <input {...props("complemento")} autoComplete="address-line2" placeholder="Loja, sala…" onChange={(e) => set("complemento", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-3">
            <Rotulo k="bairro">Bairro</Rotulo>
            <input {...props("bairro")} placeholder="Bairro" onChange={(e) => set("bairro", e.target.value)} />
            <Erro k="bairro" />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Rotulo k="cidade">Cidade</Rotulo>
            <input {...props("cidade")} autoComplete="address-level2" placeholder="Cidade" onChange={(e) => set("cidade", e.target.value)} />
            <Erro k="cidade" />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-1">
            <Rotulo k="uf">UF</Rotulo>
            <input
              {...props("uf")}
              autoComplete="address-level1"
              placeholder="SP"
              maxLength={2}
              onChange={(e) => set("uf", e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
            />
            <Erro k="uf" />
          </div>
        </div>

        <div aria-live="polite">
          {cobertura && (
            <p
              className={cn(
                "flex items-start gap-3 rounded-field px-4 py-3 text-small",
                cobertura.tem ? "bg-[#eef6ee] text-[#1f5130]" : "bg-cream text-graphite",
              )}
            >
              {cobertura.tem ? (
                <CheckCircle2 className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              ) : (
                <MapPin className="mt-0.5 size-5 shrink-0 text-terracotta" strokeWidth={1.75} aria-hidden="true" />
              )}
              {cobertura.tem
                ? `Boa notícia: já temos revenda autorizada atendendo ${cobertura.onde}.`
                : `Ainda não temos revenda cadastrada em ${cobertura.onde}, mas pode enviar: a nossa equipe procura a melhor forma de atender você.`}
            </p>
          )}
        </div>
      </fieldset>

      {/* 3. Contato */}
      <fieldset className="grid gap-5">
        <legend className="mb-1 flex items-center gap-3 text-body font-bold text-ink">
          <span className="flex size-7 items-center justify-center rounded-full bg-ink text-sm text-paper">3</span>
          Quem vai receber o contato
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Rotulo k="nome">Seu nome</Rotulo>
            <input {...props("nome")} autoComplete="name" placeholder="Nome do responsável" onChange={(e) => set("nome", e.target.value)} />
            <Erro k="nome" />
          </div>
          <div className="flex flex-col gap-2">
            <Rotulo k="whatsapp">WhatsApp</Rotulo>
            <input
              {...props("whatsapp")}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(11) 90000-0000"
              onChange={(e) => set("whatsapp", mascaraTelefone(e.target.value))}
            />
            <Erro k="whatsapp" />
          </div>
          <div className="flex flex-col gap-2">
            <Rotulo k="email">E-mail</Rotulo>
            <input {...props("email")} type="email" inputMode="email" autoComplete="email" placeholder="voce@restaurante.com.br" onChange={(e) => set("email", e.target.value)} />
            <Erro k="email" />
          </div>
          <div className="flex flex-col gap-2">
            <Rotulo k="horario" opcional>
              Melhor horário para contato
            </Rotulo>
            <select {...props("horario")} onChange={(e) => set("horario", e.target.value)}>
              <option value="">Qualquer horário</option>
              {opcoesHorario.slice(0, 2).map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* Autorização (LGPD) */}
      <div className="flex flex-col gap-2">
        <label htmlFor="lead-lgpd" className="flex cursor-pointer items-start gap-3 text-small text-graphite">
          <input
            id="lead-lgpd"
            name="lgpd"
            type="checkbox"
            checked={v.lgpd}
            onChange={(e) => set("lgpd", e.target.checked)}
            aria-invalid={Boolean(erros.lgpd)}
            aria-describedby={erros.lgpd ? "lead-lgpd-erro" : undefined}
            className="mt-1 size-5 shrink-0 accent-[#000000]"
          />
          <span>
            Autorizo a fred.o a usar estes dados para me atender e a compartilhá-los com a revenda autorizada da minha região, que
            vai entrar em contato comigo sobre o fred.o.
          </span>
        </label>
        <Erro k="lgpd" />
      </div>

      <div className="flex flex-col gap-3">
        <button type="submit" className={cn(buttonBase, buttonVariants.primary, "w-full")}>
          <WhatsAppIcon className="size-5 shrink-0" />
          Enviar pedido
          <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
        </button>
        <div aria-live="polite">
          {link && (
            <p className="text-center text-sm text-graphite">
              Abrimos o WhatsApp com o seu pedido. Para concluir, é só tocar em enviar por lá.{" "}
              <a
                href={link}
                {...externalLinkProps}
                className="inline-flex items-center gap-1 font-semibold text-ink underline underline-offset-4 hover:text-terracotta"
              >
                Não abriu? Clique aqui
                <ExternalLink className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
              </a>
            </p>
          )}
        </div>
        <p className="text-center text-sm text-muted">
          O site não guarda os seus dados: eles vão só na mensagem que você envia pelo WhatsApp. O CNPJ e o CEP são consultados
          em serviços públicos apenas para preencher o endereço.
        </p>
      </div>
    </form>
  );
}
