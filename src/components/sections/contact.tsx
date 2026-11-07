import { contact } from "@/content/site";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { SectionLabel } from "../brand";
import { ContactForm } from "../contact-form";
import { Reveal } from "../reveal";
import { ButtonLink } from "../ui";

/** Seção 9: contato comercial. Botão direto para o WhatsApp + formulário que abre o WhatsApp. */
export function Contact() {
  return (
    <section id="contato" aria-labelledby="contato-title" className="bg-cream py-20 md:py-28 lg:py-32">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
        <Reveal className="flex flex-col items-start gap-6 lg:col-span-5">
          <SectionLabel>{contact.eyebrow}</SectionLabel>
          <h2 id="contato-title" className="text-balance text-h3 font-bold md:text-h2">
            {contact.title}
          </h2>
          <p className="max-w-md text-pretty text-body text-graphite/85">{contact.description}</p>
          <ButtonLink href={contact.cta.href} whatsapp className="w-full sm:w-auto">
            {contact.cta.label}
          </ButtonLink>
          <p className="text-small text-muted">
            WhatsApp comercial: <span className="font-medium text-graphite">{WHATSAPP_DISPLAY}</span>
          </p>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <p className="mb-4 text-small font-medium text-graphite">
            Prefere deixar seus dados? Preencha e continue pelo WhatsApp:
          </p>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
