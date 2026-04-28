"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mail, MapPin, ArrowUp } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

// ── 品牌 SVG 图标（lucide-react 不含品牌图标，使用内联 SVG）──

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function DribbbleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.686 8.686 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.32 35.32 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
      />
    </svg>
  );
}

// ── 配置数据 ────────────────────────────────────────────────────

type SocialLink = {
  name: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const socialLinks: SocialLink[] = [
  { name: "GitHub", href: siteConfig.social.github, Icon: GitHubIcon },
  { name: "LinkedIn", href: siteConfig.social.linkedin, Icon: LinkedInIcon },
  { name: "Twitter / X", href: siteConfig.social.twitter, Icon: TwitterIcon },
  { name: "Dribbble", href: siteConfig.social.dribbble, Icon: DribbbleIcon },
];

const navLinks = [
  { label: "作品", href: "#work" },
  { label: "关于", href: "#about" },
  { label: "联系", href: "#contact" },
];

// ── 动画变体 ────────────────────────────────────────────────────

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ── 组件 ────────────────────────────────────────────────────────

export default function Footer() {
  const reduced = useReducedMotion();
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <footer className="bg-zinc-900" aria-label="页脚">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* ── 主内容区 ── */}
        <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-3 md:gap-8 md:py-16">
          {/* 品牌列 */}
          <motion.div
            variants={reduced ? {} : fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="md:col-span-1"
          >
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className={cn(
                "inline-block font-heading text-lg font-semibold text-zinc-100",
                "transition-colors duration-200 hover:text-blue-400",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-sm"
              )}
            >
              {siteConfig.name}
            </a>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {siteConfig.title}
            </p>
            <p className="mt-1 text-sm text-zinc-500">{siteConfig.description}</p>

            {/* 接受合作状态 */}
            {siteConfig.availableForWork && (
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-emerald-400">
                <span
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"
                  aria-hidden="true"
                />
                接受新项目合作
              </span>
            )}
          </motion.div>

          {/* 导航列 */}
          <motion.div
            variants={reduced ? {} : fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.08}
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
              导航
            </p>
            <ul className="flex flex-col gap-2.5" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn(
                      "text-sm text-zinc-400",
                      "transition-colors duration-200 hover:text-zinc-100",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900 rounded-sm"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 联系列 */}
          <motion.div
            variants={reduced ? {} : fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.16}
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
              联系
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${siteConfig.email}`}
                className={cn(
                  "inline-flex items-center gap-2 text-sm text-zinc-400",
                  "transition-colors duration-200 hover:text-zinc-100",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900 rounded-sm"
                )}
                rel="noopener noreferrer"
              >
                <Mail size={14} aria-hidden="true" />
                {siteConfig.email}
              </a>
              <p className="inline-flex items-center gap-2 text-sm text-zinc-500">
                <MapPin size={14} aria-hidden="true" />
                {siteConfig.location}
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── 分隔线 ── */}
        <div className="border-t border-zinc-800" role="separator" />

        {/* ── 底部栏 ── */}
        <div className="flex flex-col-reverse items-center justify-between gap-4 py-6 sm:flex-row">
          {/* 版权信息 */}
          <p className="text-xs text-zinc-600">
            © {year}{" "}
            <span className="text-zinc-500">{siteConfig.name}</span>
            {" "}· All rights reserved.
          </p>

          {/* 社交链接 + 返回顶部 */}
          <div className="flex items-center gap-1">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`访问 ${social.name}`}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  "text-zinc-500 transition-colors duration-200",
                  "hover:bg-zinc-800 hover:text-zinc-100",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900"
                )}
              >
                <social.Icon className="h-4 w-4" />
              </a>
            ))}

            {/* 竖分隔 */}
            <div
              className="mx-2 h-4 w-px bg-zinc-700"
              aria-hidden="true"
            />

            {/* 返回顶部 */}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="返回页面顶部"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                "text-zinc-500 transition-all duration-200",
                "hover:bg-zinc-800 hover:text-zinc-100 hover:-translate-y-0.5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900"
              )}
            >
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
