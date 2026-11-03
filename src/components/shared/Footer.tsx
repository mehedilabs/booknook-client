"use client";

import { useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { BookOpen, Mail, Minus, Plus } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
  { label: "Add a Book", href: "/books/add" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

// Mobile: tap-to-expand section. Tablet and desktop: always open.
function FooterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-t border-[#F3EFE3]/10 md:border-t-0">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-center gap-2 py-4 font-serif text-lg font-bold text-[#F3EFE3] md:pointer-events-none md:block md:w-auto md:cursor-default md:py-0 md:text-left"
        >
          {title}

          <span aria-hidden="true" className="text-[#D9A441] md:hidden">
            {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
          </span>
        </button>
      </h3>

      <span className="mt-2 hidden h-0.5 w-8 bg-[#D9A441] md:block" />

      <div
        id={panelId}
        className={`${open ? "block" : "hidden"} pb-6 text-center md:mt-3 md:block md:pb-0 md:text-left`}
      >
        {children}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t-2 border-[#D9A441] bg-[#222725] text-[#F3EFE3]">
      <div className="mx-auto grid max-w-7xl gap-0 px-5 pb-0 pt-10 sm:px-8 md:grid-cols-2 md:gap-6 md:pb-6 md:pt-8 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-8 lg:px-10 lg:py-8">
        {/* Brand */}
        <div className="pb-8 text-center md:col-span-2 md:pb-0 md:text-left lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-sm bg-[#D9A441]">
              <BookOpen className="size-5 text-[#17302A]" />
            </span>

            <span className="font-serif text-2xl font-bold tracking-wide">
              BookNook
            </span>
          </Link>

          <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-[#C9D3C3] md:mx-0">
            A small online library where readers discover books, share
            knowledge, and pass great stories from one reader to another.
          </p>
        </div>

        {/* Quick links */}
        <FooterSection title="Quick Links">
          <nav aria-label="Footer">
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm text-[#C9D3C3] transition-all duration-200 hover:text-[#D9A441] motion-safe:hover:translate-x-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </FooterSection>

        {/* Contact */}
        <FooterSection title="Get in Touch">
          <p className="text-sm leading-7 text-[#C9D3C3]">
            Have a question or suggestion? We would love to hear from you.
          </p>

          <a
            href="mailto:mehedi.hasan.bd.dev@gmail.com"
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-[#D9A441]/60 px-4 py-2 text-sm font-semibold text-[#F3EFE3] transition-colors hover:bg-[#D9A441] hover:text-[#17302A]"
          >
            <Mail className="size-4" />
            Contact Us
          </a>
          <div className="mt-4 flex items-center justify-center gap-3 md:justify-start">
            <a
              href="https://github.com/mehedilabs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex size-10 items-center justify-center rounded-md border border-[#F3EFE3]/20 text-[#C9D3C3] transition-colors hover:border-[#D9A441] hover:text-[#D9A441]"
            >
              <svg
                viewBox="0 0 16 16"
                aria-hidden="true"
                className="size-5 fill-current"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>

            <a
              href="mailto:mehedi.hasan.bd.dev@gmail.com"
              aria-label="Email"
              className="flex size-10 items-center justify-center rounded-md border border-[#F3EFE3]/20 text-[#C9D3C3] transition-colors hover:border-[#D9A441] hover:text-[#D9A441]"
            >
              <Mail className="size-5" />
            </a>
          </div>
        </FooterSection>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#F3EFE3]/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-4 text-center text-xs text-[#C9D3C3] sm:px-8 md:flex-row lg:px-10">
          <p>© 2026 BookNook. All rights reserved.</p>

          <p className="font-serif italic text-[#D9A441]">
            Every book has a story.
          </p>
        </div>
      </div>
    </footer>
  );
}
