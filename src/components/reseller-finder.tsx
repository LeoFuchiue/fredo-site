"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { AtSign, Globe, LoaderCircle, Mail, MapPin, Phone, Search } from "lucide-react";
import { formatarTelefone, revendas, type Revenda } from "@/content/revendas";
import { track } from "@/lib/analytics";
import {
  buscarCep,
  encontrarRevendas,
  mascaraCep,
  somenteDigitos,
  type ResultadoBusca,
} from "@/lib/cep";
import { externalLinkProps, revendaWhatsappLink } from "@/lib/whatsapp";
import { ContactForm } from "./contact-form";
import { WhatsAppIcon } from "./whatsapp-icon";
import { buttonBase, buttonVariants, cn } from "./ui";

type Estado =
  | { tipo: "inicio" }
  | { tipo: "buscando" }
  | { tipo: "erro"; mensagem: string }
  | { tipo: "resultado"; dados: ResultadoBusca };

const ease = [0.25, 0.1, 0.25, 1] as const;

/** Busca de revendas pelo CEP. Aceita ?cep=00000000 na URL (vem do formulário da página inicial). */
export function ResellerFinder() {
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState<Estado>({ tipo: "inicio" });
  const resultadoRef = useRef<HTMLDivElement>(null);

  async function buscar(valor: string) {
    const d = somenteDigitos(valor);
    if (d.length !== 8) {
      setEstado({ tipo: "erro", mensagem: "Digite os 8 números do CEP." });
      return;
    }
    setEstado({ tipo: "buscando" });
    track("buscar_revenda_cep");
    const local = await buscarCep(d);
    if (!local) {
      setEstado({ tipo: "erro", mensagem: "Não encontramos esse CEP. Confira os números e tente de novo." });
      return;
    }
    const dados = encontrarRevendas(local, revendas);
    setEstado({ tipo: "resultado", dados });
    track("resultado_revenda", {
      uf: local.uf,
      encontradas: dados.proximas.length,
    });
    requestAnimationFrame(() => resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  // CEP vindo da página inicial (?cep=12940280).
  useEffect(() => {
    const inicial = new URLSearchParams(window.location.search).get("cep");
    if (inicial && somenteDigitos(inicial).length === 8) {
      const formatado = mascaraCep(inicial);
      setCep(formatado);
      void buscar(formatado);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- roda só ao abrir a página
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void buscar(cep);
        }}
        noValidate
        className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
        role="search"
        aria-label="Buscar revenda pelo CEP"
      >
        <label htmlFor="cep-revenda" className="sr-only">
          CEP do restaurante
        </label>
        <input
          id="cep-revenda"
          name="cep"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="Digite o CEP do restaurante"
          value={cep}
          onChange={(e) => setCep(mascaraCep(e.target.value))}
          aria-invalid={estado.tipo === "erro"}
          aria-describedby={estado.tipo === "erro" ? "cep-erro" : undefined}
          className={cn(
            "min-h-13 flex-1 rounded-field border bg-paper px-5 text-body text-ink tabular-nums placeholder:text-muted/80 outline-none transition-[border-color,box-shadow] duration-300 focus:border-terracotta focus:shadow-[0_0_0_3px_rgb(197_106_55/0.15)]",
            estado.tipo === "erro" ? "border-danger" : "border-line",
          )}
        />
        <button
          type="submit"
          disabled={estado.tipo === "buscando"}
          className={cn(buttonBase, buttonVariants.primary, "disabled:opacity-70")}
        >
          {estado.tipo === "buscando" ? (
            <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <Search className="size-5" strokeWidth={1.75} aria-hidden="true" />
          )}
          Buscar revenda
        </button>
      </form>

      <div aria-live="polite">
        {estado.tipo === "erro" && (
          <p id="cep-erro" className="-mt-6 text-small text-danger">
            {estado.mensagem}
          </p>
        )}
        {estado.tipo === "buscando" && <p className="-mt-6 text-small text-muted">Procurando revendas perto de você…</p>}
      </div>

      <div ref={resultadoRef} className="scroll-mt-28">
        <AnimatePresence mode="wait">
          {estado.tipo === "resultado" && (
            <m.div
              key={estado.dados.local.cep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease } }}
              exit={{ opacity: 0 }}
            >
              <Resultado dados={estado.dados} />
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Resultado({ dados }: { dados: ResultadoBusca }) {
  const { local, proximas, mesmoEstado } = dados;
  const onde = `${local.cidade} / ${local.uf}`;

  if (proximas.length > 0) {
    return (
      <section aria-labelledby="resultado-titulo" className="flex flex-col gap-6">
        <h2 id="resultado-titulo" className="text-h4 font-bold text-ink">
          {proximas.length === 1 ? "Revenda que atende " : "Revendas que atendem "}
          <span className="text-terracotta">{onde}</span>
        </h2>
        <ul className="grid gap-5 lg:grid-cols-2">
          {proximas.map((r) => (
            <li key={r.revenda.id}>
              <CartaoRevenda revenda={r.revenda} distanciaKm={r.distanciaKm} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section aria-labelledby="resultado-titulo" className="flex flex-col gap-8">
      <div className="flex max-w-2xl flex-col gap-3">
        <h2 id="resultado-titulo" className="text-h4 font-bold text-ink">
          Ainda não temos uma revenda em <span className="text-terracotta">{onde}</span>.
        </h2>
        <p className="text-body text-graphite/85">
          {mesmoEstado.length > 0
            ? "Mas estas revendas atendem o seu estado e podem ajudar. Se preferir, deixe seus dados abaixo e indicamos a melhor opção para você."
            : "Deixe seus dados abaixo e a nossa equipe indica a revenda mais próxima do seu restaurante."}
        </p>
      </div>

      {mesmoEstado.length > 0 && (
        <ul className="grid gap-5 lg:grid-cols-2">
          {mesmoEstado.map((r) => (
            <li key={r.revenda.id}>
              <CartaoRevenda revenda={r.revenda} distanciaKm={r.distanciaKm} />
            </li>
          ))}
        </ul>
      )}

      <div className="max-w-3xl">
        <ContactForm />
      </div>
    </section>
  );
}

function CartaoRevenda({ revenda, distanciaKm }: { revenda: Revenda; distanciaKm?: number }) {
  const [principal, ...outros] = revenda.whatsapp;
  const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${revenda.endereco}, ${revenda.bairro}, ${revenda.cidade} - ${revenda.uf}, ${revenda.cep}`,
  )}`;
  const distancia =
    distanciaKm === undefined ? null : distanciaKm < 3 ? "Bem perto de você" : `A cerca de ${Math.round(distanciaKm)} km`;

  return (
    <article className="flex h-full flex-col gap-5 rounded-card border border-line bg-paper p-6 shadow-soft md:p-8">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-cream px-3 py-1 text-sm font-medium text-graphite">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-terracotta" />
            Revenda autorizada fred.o
          </span>
          {distancia && <span className="text-sm text-muted">{distancia}</span>}
        </div>
        <h3 className="text-[1.5rem] leading-snug font-bold text-ink">{revenda.nome}</h3>
        <p className="text-small text-muted">{revenda.descricao}</p>
      </header>

      <ul className="flex flex-col gap-3 text-small text-graphite">
        <li className="flex items-start gap-3">
          <MapPin className="mt-0.5 size-5 shrink-0 text-terracotta" strokeWidth={1.75} aria-hidden="true" />
          <a href={mapa} {...externalLinkProps} className="underline-offset-4 hover:text-terracotta hover:underline">
            {revenda.endereco}, {revenda.bairro}, {revenda.cidade} - {revenda.uf}, CEP {revenda.cep}
            <span className="sr-only"> (abre o mapa em nova aba)</span>
          </a>
        </li>
        {outros.length > 0 && (
          <li className="flex items-start gap-3">
            <Phone className="mt-0.5 size-5 shrink-0 text-terracotta" strokeWidth={1.75} aria-hidden="true" />
            <span>
              {revenda.whatsapp.map((n, i) => (
                <span key={n}>
                  {i > 0 && " · "}
                  <a href={revendaWhatsappLink(n, revenda.nome)} {...externalLinkProps} className="hover:text-terracotta">
                    {formatarTelefone(n)}
                  </a>
                </span>
              ))}
            </span>
          </li>
        )}
        {revenda.email && (
          <li className="flex items-start gap-3">
            <Mail className="mt-0.5 size-5 shrink-0 text-terracotta" strokeWidth={1.75} aria-hidden="true" />
            <a href={`mailto:${revenda.email}`} className="break-all hover:text-terracotta">
              {revenda.email}
            </a>
          </li>
        )}
        {(revenda.site || revenda.instagram) && (
          <li className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {revenda.site && (
              <a href={revenda.site} {...externalLinkProps} className="inline-flex items-center gap-3 hover:text-terracotta">
                <Globe className="size-5 shrink-0 text-terracotta" strokeWidth={1.75} aria-hidden="true" />
                Site
                <span className="sr-only"> da {revenda.nome} (abre em nova aba)</span>
              </a>
            )}
            {revenda.instagram && (
              <a href={revenda.instagram} {...externalLinkProps} className="inline-flex items-center gap-3 hover:text-terracotta">
                <AtSign className="size-5 shrink-0 text-terracotta" strokeWidth={1.75} aria-hidden="true" />
                Instagram
                <span className="sr-only"> da {revenda.nome} (abre em nova aba)</span>
              </a>
            )}
          </li>
        )}
      </ul>

      {principal && (
        <a
          href={revendaWhatsappLink(principal, revenda.nome)}
          {...externalLinkProps}
          className={cn(buttonBase, buttonVariants.primary, "mt-auto w-full")}
        >
          <WhatsAppIcon className="size-5 shrink-0" />
          Falar com a revenda
          <span className="sr-only"> {revenda.nome} pelo WhatsApp (abre em nova aba)</span>
        </a>
      )}
    </article>
  );
}
