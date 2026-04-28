"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { ContactForm } from "@/components/ui/ContactForm";

// ── 品牌 SVG 图标（同 Footer，lucide 无品牌图标） ─────────────────

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ── 社交快速联系按钮 ─────────────────────────────────────────────

type QuickLinkProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  description: string;
};

function QuickLink({ href, label, icon, description }: QuickLinkProps) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-800/50 p-4",
        "transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
      )}
    >
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-zinc-700 text-zinc-300 transition-colors duration-200 group-hover:bg-zinc-600 group-hover:text-white">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        <p className="truncate text-xs text-zinc-500">{description}</p>
      </div>
      <ArrowRight
        size={15}
        className="flex-none text-zinc-600 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-zinc-400"
        aria-hidden="true"
      />
    </a>
  );
}

// ── 动画变体 ─────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  },
});

const fadeLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  },
});

const fadeRight = (delay = 0) => ({
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  },
});

// ── ContactSection ───────────────────────────────────────────────

export default function ContactSection() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const quickLinks: QuickLinkProps[] = [
    {
      href: `mailto:${siteConfig.email}`,
      label: "发送邮件",
      icon: <Mail size={18} />,
      description: siteConfig.email,
    },
    {
      href: siteConfig.social.github,
      label: "GitHub",
      icon: <GitHubIcon className="h-4.5 w-4.5" />,
      description: siteConfig.social.github.replace("https://", ""),
    },
    {
      href: siteConfig.social.linkedin,
      label: "LinkedIn",
      icon: <LinkedInIcon className="h-4.5 w-4.5" />,
      description: siteConfig.social.linkedin.replace("https://", ""),
    },
    {
      href: siteConfig.social.twitter,
      label: "Twitter / X",
      icon: <TwitterIcon className="h-4.5 w-4.5" />,
      description: siteConfig.social.twitter.replace("https://", ""),
    },
  ];

  return (
    <section
      id="contact"
      ref={ref}
      className="relative overflow-hidden bg-zinc-900 py-24 md:py-32"
      aria-label="联系我"
    >
      {/* ── 装饰背景光晕 ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">

        {/* ── 大号 CTA 标语 ── */}
        <motion.div
          variants={reduced ? {} : fadeUp(0)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-blue-400">
            Get In Touch
          </span>
          <h2
            className={cn(
              "font-heading font-bold leading-[1.08] tracking-tight text-white",
              "text-[clamp(2.5rem,6vw,4.5rem)]"
            )}
          >
            有个好想法？
            <br />
            <span className="text-blue-400">一起把它做出来。</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-zinc-400">
            无论是新产品、设计改版，还是只是想聊聊创意——我都乐于倾听。
            通常在 1–2 个工作日内回复。
          </p>
        </motion.div>

        {/* ── 主体双栏 ── */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

          {/* ── 左栏：快速联系入口 ── */}
          <motion.div
            variants={reduced ? {} : fadeLeft(0.12)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-col gap-6"
          >
            {/* 小标题 */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-zinc-100">
                直接联系
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                选择你最顺手的方式，无需填写任何表单。
              </p>
            </div>

            {/* 联系入口列表 */}
            <div className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <QuickLink key={link.label} {...link} />
              ))}
            </div>

            {/* 可用性标注 */}
            {siteConfig.availableForWork && (
              <motion.div
                variants={reduced ? {} : fadeUp(0.28)}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className={cn(
                  "flex items-start gap-3 rounded-2xl",
                  "border border-emerald-500/20 bg-emerald-500/5 p-4"
                )}
              >
                <span className="mt-1 h-2 w-2 flex-none animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-emerald-400">
                    目前接受新项目合作
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    可接受全职、兼职或自由职业合作，欢迎随时联系。
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* ── 右栏：联系表单 ── */}
          <motion.div
            variants={reduced ? {} : fadeRight(0.18)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-col gap-5"
          >
            {/* 小标题 */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-zinc-100">
                发送消息
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                留下你的想法，我会尽快回复。
              </p>
            </div>

            {/* 表单 */}
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
