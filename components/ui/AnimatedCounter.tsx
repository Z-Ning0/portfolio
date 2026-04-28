"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// ── 工具：解析 "5+" / "20+" / "100" 这类字符串 ────────────────────

function parseValue(raw: string): { num: number; suffix: string; prefix: string } {
  // 提取前缀（如 "$"）
  const prefixMatch = raw.match(/^([^0-9]*)/);
  const prefix = prefixMatch ? prefixMatch[1] : "";
  // 提取数字
  const numMatch = raw.match(/(\d+)/);
  const num = numMatch ? parseInt(numMatch[1], 10) : 0;
  // 提取后缀（数字之后的部分，如 "+"、"k"、"%"）
  const suffixMatch = raw.match(/\d+(.*)$/);
  const suffix = suffixMatch ? suffixMatch[1] : "";
  return { num, suffix, prefix };
}

// ── easeOut 缓动函数 ─────────────────────────────────────────────

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// ── 类型 ─────────────────────────────────────────────────────────

export type AnimatedCounterProps = {
  /** 目标值，支持 "5+"、"20+"、"100k" 等带后缀格式 */
  value: string;
  /** 动画时长（ms），默认 1400 */
  duration?: number;
  /** 触发动画的延迟（ms），默认 0 */
  delay?: number;
  /** 数字字体大小 className，默认 text-4xl */
  sizeClassName?: string;
  /** 附加 className */
  className?: string;
};

// ── AnimatedCounter ──────────────────────────────────────────────

export function AnimatedCounter({
  value,
  duration = 1400,
  delay = 0,
  sizeClassName = "text-4xl",
  className,
}: AnimatedCounterProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [displayNum, setDisplayNum] = useState(0);
  const hasStarted = useRef(false);

  const { num: target, suffix, prefix } = parseValue(value);

  useEffect(() => {
    // reduced motion：直接跳到目标值
    if (reduced) {
      setDisplayNum(target);
      return;
    }

    if (!inView || hasStarted.current) return;
    hasStarted.current = true;

    let startTime: number | null = null;
    let rafId: number;

    const tick = (now: number) => {
      if (startTime === null) startTime = now + delay;
      const elapsed = Math.max(0, now - startTime);
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      setDisplayNum(Math.round(eased * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, reduced, target, duration, delay]);

  return (
    <span
      ref={ref}
      className={cn(
        "font-heading font-bold tabular-nums text-zinc-900",
        sizeClassName,
        className
      )}
      aria-label={value}
    >
      {prefix}
      {displayNum}
      {suffix}
    </span>
  );
}

export default AnimatedCounter;
