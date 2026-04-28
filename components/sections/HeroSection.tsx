"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, ArrowRight, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

// ── 标题中循环替换的动态词 ────────────────────────────────────────

const ROTATING_WORDS = ["产品", "体验", "界面"];

// ── 入场动画变体 ──────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  },
});

const wordVariants = {
  enter: { opacity: 0, y: 20, rotateX: -15 },
  center: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -16,
    rotateX: 10,
    transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] },
  },
};

// ── 滚动辅助 ─────────────────────────────────────────────────────

function scrollToSection(id: string, reduced: boolean | null) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
}

// ── HeroSection ──────────────────────────────────────────────────

export default function HeroSection() {
  const reduced = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);

  // 定时切换动态词，reduced motion 时停止切换
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2400);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-50 px-4 md:px-8"
      aria-label="英雄区"
    >
      {/* ── 装饰性背景光晕（不干扰阅读，reduced-motion 下维持静态） ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        {/* 左上蓝色光晕 */}
        <div className="absolute -left-32 -top-32 h-[560px] w-[560px] rounded-full bg-blue-200/40 blur-[120px]" />
        {/* 右下紫色光晕 */}
        <div className="absolute -bottom-40 -right-20 h-[480px] w-[480px] rounded-full bg-violet-200/30 blur-[100px]" />
        {/* 中央极淡提亮 */}
        <div className="absolute left-1/2 top-1/3 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-blue-100/25 blur-[80px]" />
      </div>

      {/* ── 主内容区 ── */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-7 text-center">

        {/* 状态徽章 */}
        <motion.div
          variants={reduced ? {} : fadeUp(0)}
          initial="hidden"
          animate="visible"
        >
          {siteConfig.availableForWork ? (
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full",
                "border border-emerald-200 bg-emerald-50 px-4 py-1.5",
                "text-xs font-medium text-emerald-700"
              )}
            >
              <span
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              接受合作 · Available for work
            </span>
          ) : (
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full",
                "border border-zinc-200 bg-white px-4 py-1.5",
                "text-xs font-medium text-zinc-500"
              )}
            >
              {siteConfig.name} · {siteConfig.location}
            </span>
          )}
        </motion.div>

        {/* 大标题 */}
        <motion.h1
          variants={reduced ? {} : fadeUp(0.1)}
          initial="hidden"
          animate="visible"
          className={cn(
            "font-heading font-bold leading-[1.05] tracking-tight",
            "text-[clamp(3rem,8vw,5.5rem)]",
            "text-zinc-900"
          )}
        >
          {/* 第一行 */}
          <span className="block">用设计思维</span>
          {/* 第二行：固定文字 + 动态词 */}
          <span className="flex items-baseline justify-center gap-3 flex-wrap">
            <span>构建极致</span>

            {/* 动态词容器：固定宽度防抖动 */}
            <span
              className="relative inline-block overflow-hidden"
              style={{ perspective: "600px" }}
              aria-live="polite"
              aria-atomic="true"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={wordIndex}
                  variants={reduced ? {} : wordVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="inline-block text-blue-600"
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          variants={reduced ? {} : fadeUp(0.22)}
          initial="hidden"
          animate="visible"
          className="max-w-xl text-[clamp(1rem,2.5vw,1.125rem)] leading-relaxed text-zinc-500"
        >
          {siteConfig.title}
          <span className="mx-2 text-zinc-300">·</span>
          {siteConfig.location}
        </motion.p>

        {/* CTA 按钮组 */}
        <motion.div
          variants={reduced ? {} : fadeUp(0.36)}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {/* 主按钮：查看作品 */}
          <button
            type="button"
            onClick={() => scrollToSection("work", reduced)}
            className={cn(
              "group inline-flex items-center gap-2",
              "rounded-xl bg-zinc-900 px-5 py-2.5",
              "text-sm font-medium text-white",
              "transition-all duration-200",
              "hover:bg-zinc-700 hover:-translate-y-px hover:shadow-lg hover:shadow-zinc-900/15",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
            )}
          >
            查看作品
            <ArrowRight
              size={15}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>

          {/* 次按钮：联系我 */}
          <a
            href={`mailto:${siteConfig.email}`}
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2",
              "rounded-xl border border-zinc-200 bg-white px-5 py-2.5",
              "text-sm font-medium text-zinc-700",
              "transition-all duration-200",
              "hover:border-zinc-300 hover:text-zinc-900 hover:-translate-y-px hover:shadow-md hover:shadow-zinc-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
            )}
          >
            <Mail size={15} aria-hidden="true" />
            联系我
          </a>
        </motion.div>

        {/* 技术栈标注（辅助信任信号） */}
        <motion.div
          variants={reduced ? {} : fadeUp(0.48)}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1"
        >
          {[...siteConfig.skills.design.slice(0, 2), ...siteConfig.skills.dev.slice(0, 2)].map(
            (skill) => (
              <span key={skill} className="text-xs text-zinc-400">
                {skill}
              </span>
            )
          )}
        </motion.div>
      </div>

      {/* ── 滚动指示器 ── */}
      <motion.button
        type="button"
        aria-label="向下滚动到作品集"
        onClick={() => scrollToSection("work", reduced)}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className={cn(
          "absolute bottom-8 left-1/2 z-10 -translate-x-1/2",
          "flex flex-col items-center gap-1",
          "text-zinc-400 transition-colors duration-200 hover:text-zinc-700",
          "focus-visible:outline-none"
        )}
      >
        <span className="text-[10px] font-medium tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={reduced ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} aria-hidden="true" />
        </motion.div>
      </motion.button>
    </section>
  );
}
