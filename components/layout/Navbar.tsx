"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

type NavLink = {
  label: string;
  href: string;
  sectionId: string;
};

const navLinks: NavLink[] = [
  { label: "作品", href: "#work", sectionId: "work" },
  { label: "关于", href: "#about", sectionId: "about" },
  { label: "联系", href: "#contact", sectionId: "contact" },
];

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const linkStaggerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const linkItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function Navbar() {
  const reduced = useReducedMotion();
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sectionIds = ["hero", ...navLinks.map((l) => l.sectionId)];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.4, rootMargin: "-64px 0px 0px 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    hamburgerRef.current?.focus();
  };

  const handleNavClick = (href: string) => {
    closeMenu();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-4 left-4 right-4 z-50 mx-auto max-w-5xl",
          "rounded-2xl border border-zinc-100",
          "transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm shadow-zinc-200/50"
            : "bg-white/70 backdrop-blur-sm"
        )}
      >
        <nav
          className="flex items-center justify-between px-5 py-3"
          aria-label="主导航"
        >
          {/* Logo / Brand */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#hero");
            }}
            className={cn(
              "font-heading text-base font-semibold text-zinc-900",
              "transition-colors duration-200 hover:text-blue-600",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-sm"
            )}
            aria-label={`${siteConfig.name} — 返回顶部`}
          >
            {siteConfig.name}
          </a>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {navLinks.map((link) => (
              <li key={link.sectionId}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={cn(
                    "relative px-4 py-1.5 rounded-xl text-sm font-medium",
                    "transition-colors duration-200 cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1",
                    activeSection === link.sectionId
                      ? "text-blue-600"
                      : "text-zinc-500 hover:text-zinc-900"
                  )}
                  aria-current={
                    activeSection === link.sectionId ? "page" : undefined
                  }
                >
                  {activeSection === link.sectionId && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-xl bg-blue-600/8"
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 30 }
                      }
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <a
            href={`mailto:${siteConfig.email}`}
            className={cn(
              "hidden md:inline-flex items-center gap-2",
              "px-4 py-1.5 rounded-xl text-sm font-medium",
              "bg-zinc-900 text-white",
              "transition-all duration-200 hover:bg-zinc-700 hover:-translate-y-px",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2",
              "cursor-pointer"
            )}
            rel="noopener noreferrer"
          >
            开始合作
          </a>

          {/* Mobile Hamburger */}
          <button
            ref={hamburgerRef}
            type="button"
            aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className={cn(
              "md:hidden flex items-center justify-center",
              "w-9 h-9 rounded-xl",
              "text-zinc-700 transition-colors duration-200 hover:bg-zinc-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1",
              "cursor-pointer"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={reduced ? false : { rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={reduced ? {} : { rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} strokeWidth={2} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={reduced ? false : { rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={reduced ? {} : { rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} strokeWidth={2} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="导航菜单"
              variants={reduced ? {} : mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden border-t border-zinc-100 px-5 pb-5 pt-3"
            >
              <motion.ul
                variants={reduced ? {} : linkStaggerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-1"
                role="list"
              >
                {navLinks.map((link) => (
                  <motion.li key={link.sectionId} variants={reduced ? {} : linkItemVariants}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(link.href);
                      }}
                      className={cn(
                        "block w-full px-4 py-3 rounded-xl text-sm font-medium",
                        "transition-colors duration-200 cursor-pointer",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1",
                        activeSection === link.sectionId
                          ? "bg-blue-600/8 text-blue-600"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                      )}
                      aria-current={
                        activeSection === link.sectionId ? "page" : undefined
                      }
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
                <motion.li variants={reduced ? {} : linkItemVariants} className="mt-2">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    onClick={closeMenu}
                    className={cn(
                      "block w-full px-4 py-3 rounded-xl text-sm font-medium text-center",
                      "bg-zinc-900 text-white",
                      "transition-colors duration-200 hover:bg-zinc-700",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-1",
                      "cursor-pointer"
                    )}
                    rel="noopener noreferrer"
                  >
                    开始合作
                  </a>
                </motion.li>
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? {} : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-zinc-900/20 backdrop-blur-sm md:hidden"
            aria-hidden="true"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>
    </>
  );
}
