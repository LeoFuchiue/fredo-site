"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import { Menu, X } from "lucide-react";
import { nav } from "@/content/site";
import { externalLinkProps, whatsappHref } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./whatsapp-icon";
import { ButtonLink, Logo, cn } from "./ui";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll and allow Escape to close while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close the menu if the viewport grows to desktop size.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-[background-color,border-color,backdrop-filter] duration-300 ease-soft",
          scrolled || open
            ? "border-b border-line bg-paper/90 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <nav
          aria-label="Principal"
          className="container-page flex h-16 items-center justify-between md:h-20"
        >
          <Link href="/" aria-label="Fred.o, página inicial" className="rounded-button">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-small font-medium transition-colors duration-300 hover:text-terracotta xl:px-4",
                    "text-graphite",
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <ButtonLink
              href={whatsappHref("demo")}
              whatsapp
              className="min-h-11 px-5 text-small"
            >
              Agendar demonstração
            </ButtonLink>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-button border transition-colors duration-300 lg:hidden",
              "border-line text-ink hover:bg-cream",
            )}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" strokeWidth={1.5} aria-hidden="true" /> : <Menu className="size-5" strokeWidth={1.5} aria-hidden="true" />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="menu-mobile"
            key="menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-paper lg:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-6">
              {nav.map((item, i) => (
                <m.li
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i + 0.05, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-14 items-center border-b border-line text-h4 font-semibold text-graphite"
                  >
                    {item.label}
                  </a>
                </m.li>
              ))}
              <li className="pt-6">
                <a
                  href={whatsappHref("demo")}
                  {...externalLinkProps}
                  onClick={() => setOpen(false)}
                  className="flex min-h-13 w-full items-center justify-center gap-2 rounded-button bg-ink font-semibold text-paper transition-colors duration-300 hover:bg-graphite"
                >
                  <WhatsAppIcon className="size-5" />
                  Agendar demonstração
                  <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
                </a>
              </li>
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
