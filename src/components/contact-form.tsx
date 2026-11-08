"use client";

import { useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { ExternalLink } from "lucide-react";
import { track } from "@/lib/analytics";
import { demoRequestMessage, externalLinkProps, whatsappLink, type DemoRequest } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./whatsapp-icon";
import { buttonBase, buttonVariants, cn } from "./ui";

type FieldName = keyof DemoRequest;
type Errors = Partial<Record<FieldName, string>>;

const inputBase =
  "peer w-full rounded-field border bg-paper px-4 py-3.5 text-small text-ink placeholder:text-muted/80 transition-[border-color,box-shadow] duration-300 outline-none hover:border-muted/50 focus:border-terracotta focus:shadow-[0_0_0_3px_rgb(197_106_55/0.15)] focus-visible:outline-none";

const fields: {
  name: FieldName;
  label: string;
  placeholder: string;
  autoComplete: string;
  type?: string;
  inputMode?: "tel";
}[] = [
  { name: "name", label: "Nome", placeholder: "Seu nome", autoComplete: "name" },
  { name: "restaurant", label: "Nome do restaurante", placeholder: "Nome do restaurante", autoComplete: "organization" },
  { name: "whatsapp", label: "WhatsApp", placeholder: "(11) 90000-0000", autoComplete: "tel", type: "tel", inputMode: "tel" },
  { name: "pos", label: "Sistema de PDV utilizado", placeholder: "Nome do sistema ou “não uso”", autoComplete: "off" },
];

function validate(d: DemoRequest): Errors {
  const e: Errors = {};
  if (d.name.length < 2) e.name = "Informe o seu nome.";
  if (d.restaurant.length < 2) e.restaurant = "Informe o nome do restaurante.";
  const digits = d.whatsapp.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) e.whatsapp = "Informe um WhatsApp com DDD.";
  if (d.pos.length < 2) e.pos = "Informe o sistema de PDV (ou “não uso”).";
  return e;
}

/**
 * Formulário de demonstração: valida no navegador e abre o WhatsApp oficial
 * com os dados preenchidos. Nada é enviado ao servidor nem armazenado.
 */
export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [openedLink, setOpenedLink] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const started = useRef(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    track("solicitar_demonstracao_click");
    const fd = new FormData(e.currentTarget);
    const data: DemoRequest = {
      name: String(fd.get("name") ?? "").trim().slice(0, 120),
      restaurant: String(fd.get("restaurant") ?? "").trim().slice(0, 160),
      whatsapp: String(fd.get("whatsapp") ?? "").trim().slice(0, 40),
      pos: String(fd.get("pos") ?? "").trim().slice(0, 120),
    };
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      setOpenedLink(null);
      return;
    }

    // Abre em nova aba dentro do próprio clique (não é bloqueado como pop-up).
    const href = whatsappLink(demoRequestMessage(data));
    const a = document.createElement("a");
    a.href = href;
    a.target = externalLinkProps.target;
    a.rel = externalLinkProps.rel;
    a.click();
    setOpenedLink(href);
    // Formulário válido e WhatsApp aberto (não confirma que a mensagem foi enviada).
    track("form_submit_valido", { pdv_informado: data.pos.length > 0 ? "sim" : "nao" });
  }

  return (
    <div className="relative rounded-card border border-line bg-paper p-6 shadow-soft md:p-12">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        onFocus={() => {
          if (started.current) return;
          started.current = true;
          track("form_start");
        }}
        noValidate
        className="grid gap-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((f) => {
            const id = `demo-${f.name}`;
            const err = errors[f.name];
            return (
              <div key={f.name} className="flex flex-col gap-2">
                <label htmlFor={id} className="text-small font-medium text-ink">
                  {f.label}
                </label>
                <input
                  id={id}
                  name={f.name}
                  type={f.type ?? "text"}
                  inputMode={f.inputMode}
                  autoComplete={f.autoComplete}
                  placeholder={f.placeholder}
                  required
                  aria-invalid={Boolean(err)}
                  aria-describedby={err ? `${id}-erro` : undefined}
                  className={cn(inputBase, err ? "border-danger" : "border-line")}
                />
                {err && (
                  <p id={`${id}-erro`} className="text-sm text-danger">
                    {err}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <button type="submit" className={cn(buttonBase, buttonVariants.primary, "mt-2 w-full")}>
          <WhatsAppIcon className="size-5 shrink-0" />
          Solicitar demonstração
          <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
        </button>

        {/* Retorno honesto: avisa que o WhatsApp foi aberto, não que algo foi enviado. */}
        <div aria-live="polite" className="min-h-5">
          <AnimatePresence>
            {openedLink && (
              <m.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center text-sm text-graphite"
              >
                Abrimos o WhatsApp com a sua mensagem. Para concluir, é só enviar por lá.{" "}
                <a
                  href={openedLink}
                  {...externalLinkProps}
                  className="inline-flex items-center gap-1 font-semibold text-ink underline underline-offset-4 transition-colors duration-300 hover:text-terracotta"
                >
                  Não abriu? Clique aqui
                  <ExternalLink className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                </a>
              </m.p>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-sm text-muted">
          Seus dados não ficam salvos no site: eles vão apenas na mensagem que você envia pelo WhatsApp.
        </p>
      </form>
    </div>
  );
}
