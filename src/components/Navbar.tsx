"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NotificationBadge } from "@/components/NotificationBadge";
import { WalletConnector } from "@/components/WalletConnector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore Creators" },
  { href: "/tips", label: "Send Tips" },
  { href: "/widgets", label: "Widgets" },
] as const;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useFocusTrap<HTMLDivElement>(menuOpen);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-[color:var(--surface)]/80 backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          aria-label="Stellar Tip Jar — home"
          className="text-lg font-bold tracking-tight text-ink sm:text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wave/50 rounded"
        >
          Stellar Tip Jar
        </Link>

        {/* Desktop nav */}
        <ul
          role="list"
          className="hidden items-center gap-6 text-sm font-medium text-ink/80 md:flex"
        >
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded transition-colors hover:text-wave focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wave/50 ${
                    active ? "font-semibold text-wave" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <NotificationBadge />
          <div className="hidden md:block">
            <WalletConnector />
          </div>

          {/* Mobile menu toggle */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/15 text-ink/70 transition hover:border-wave/40 hover:text-wave focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wave/50 md:hidden"
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="border-t border-ink/10 bg-[color:var(--surface)] px-4 pb-5 pt-3 md:hidden"
        >
          <ul role="list" className="space-y-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors hover:bg-wave/10 hover:text-wave focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wave/50 ${
                      active ? "bg-wave/10 text-wave" : "text-ink/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 border-t border-ink/10 pt-4">
            <WalletConnector />
          </div>
        </div>
      )}
    </header>
  );
}
