"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Menu, X, LibraryBig, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#EAE6F2] bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#62549A] text-white shadow-md shadow-[#62549A]/15">
            <BookOpen className="size-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#29264F]">
              BookNook
            </h1>
            <p className="text-[10px] font-medium tracking-[0.15em] text-[#9289AD]">
              YOUR PERSONAL LIBRARY
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#69677D] transition-colors hover:text-[#62549A]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#DCD5EC] bg-white px-5 text-sm font-semibold text-[#62549A] transition hover:border-[#62549A] hover:bg-[#F7F5FC]"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#62549A] px-5 text-sm font-semibold text-white shadow-md shadow-[#62549A]/15 transition hover:bg-[#514481]"
          >
            Register
            <ChevronRight className="size-4" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="size-10 text-[#29264F] md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </Button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-[#EAE6F2] bg-white px-5 py-5 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#55536B] transition hover:bg-[#F4F1FA] hover:text-[#62549A]"
              >
                <LibraryBig className="size-4" />
                {link.label}
              </Link>
            ))}

            <div className="my-2 border-t border-[#EEEAF4]" />

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex h-11 items-center justify-center rounded-xl border border-[#DCD5EC] text-sm font-semibold text-[#62549A] transition hover:bg-[#F7F5FC]"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex h-11 items-center justify-center rounded-xl bg-[#62549A] text-sm font-semibold text-white transition hover:bg-[#514481]"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
