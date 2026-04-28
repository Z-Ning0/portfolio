"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// ── 类型 ─────────────────────────────────────────────────────────

export type SkillCategory = "design" | "dev" | "default";

export type SkillBadgeProps = {
  /** 技能名称 */
  label: string;
  /** 分类决定配色方案 */
  category?: SkillCategory;
  /** 附加 className */
  className?: string;
};

// ── 分类配色 Token ────────────────────────────────────────────────

const categoryStyles: Record<
  SkillCategory,
  { base: string; dot: string }
> = {
  design: {
    base: "border-rose-100 bg-rose-50 text-rose-700 hover:border-rose-200 hover:bg-rose-100",
    dot: "bg-rose-400",
  },
  dev: {
    base: "border-blue-100 bg-blue-50 text-blue-700 hover:border-blue-200 hover:bg-blue-100",
    dot: "bg-blue-500",
  },
  default: {
    base: "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100",
    dot: "bg-zinc-400",
  },
};

// ── SkillBadge ───────────────────────────────────────────────────

export function SkillBadge({
  label,
  category = "default",
  className,
}: SkillBadgeProps) {
  const reduced = useReducedMotion();
  const styles = categoryStyles[category];

  return (
    <motion.span
      whileHover={reduced ? {} : { y: -2, scale: 1.04 }}
      transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "inline-flex cursor-default items-center gap-2",
        "rounded-xl border px-3.5 py-1.5",
        "text-sm font-medium",
        "transition-colors duration-200",
        "select-none",
        styles.base,
        className
      )}
    >
      {/* 分类色点 */}
      <span
        className={cn("h-1.5 w-1.5 flex-none rounded-full", styles.dot)}
        aria-hidden="true"
      />
      {label}
    </motion.span>
  );
}

export default SkillBadge;
