import { nav } from "@/content/site";
import { WHATSAPP_DISPLAY, externalLinkProps, whatsappHref } from "@/lib/whatsapp";
import { Signature } from "./brand";
import { Logo } from "./ui";
import { WhatsAppIcon } from "./whatsapp-icon";

export async function Footer() {
  "use cache";
  return (
    <footer className="bg-graphite text-paper">
      <div className="container-page flex flex-col gap-12 py-16 md:py-20 lg:flex-row lg:items-start lg:justify-between lg:py-24">
        <div className="flex max-w-xs flex-col items-start gap-4">
          <Logo inverted />
          <p className="text-small text-paper/70">
            O robô de pesagem para restaurantes self-service por quilo.
          </p>
          <Signature inverted className="text-[0.75rem] tracking-[0.2em]" />
          <a
            href={whatsappHref("demo")}
            {...externalLinkProps}
            className="mt-2 inline-flex items-center gap-3 text-small font-medium text-paper transition-colors duration-300 hover:text-terracotta"
          >
            <WhatsAppIcon className="size-5" />
            {WHATSAPP_DISPLAY}
            <span className="sr-only"> (WhatsApp, abre em nova aba)</span>
          </a>
        </div>

        <nav aria-label="Rodapé">
          <ul className="grid grid-cols-2 gap-x-12 gap-y-4 text-small sm:grid-cols-3">
            {[...nav, { href: "#contato", label: "Contato" }].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-paper/70 transition-colors duration-300 hover:text-paper"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-paper/10">
        <div className="container-page flex flex-col gap-2 py-6 text-small text-paper/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Fredo. Todos os direitos reservados.</p>
          <a href="#conteudo" className="transition-colors duration-300 hover:text-paper">
            Voltar ao topo ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
