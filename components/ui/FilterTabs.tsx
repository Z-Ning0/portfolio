"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// ── 类型 ─────────────────────────────────────────────────────────

export type FilterTabsProps = {
  /** 所有可选标签 */
  tags: string[];
  /** 当前激活的标签，null 表示「全部」 */
  activeTag: string | null;
  /** 切换标签回调 */
  onChange: (tag: string | null) => void;
  className?: string;
};

// ── FilterTabs ───────────────────────────────────────────────────

export function FilterTabs({
  tags,
  activeTag,
  onChange,
  className,
}: FilterTabsProps) {
  const reduced = useReducedMotion();

  // "全部" + 各标签
  const allItems = [{ label: "全部", value: null as string | null }, ...tags.map((t) => ({ label: t, value: t }))];

  return (
    <div
      role="tablist"
      aria-label="按标签筛选作品"
      className={cn(
        "flex items-center gap-1.5 flex-wrap",
        className
      )}
    >
      {allItems.map(({ label, value }) => {
        const isActive = activeTag === value;

        return (
          <button
            key={label}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(value)}
            className={cn(
              "relative rounded-xl px-4 py-2 text-sm font-medium",
              "transition-colors duration-200 outline-none",
              "focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
              isActive
                ? "text-white"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            )}
          >
            {/* 激活态背景：layoutId 使其在 tab 间滑动 */}
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-xl bg-zinc-900"
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 400, damping: 30 }
                }
                aria-hidden="true"
              />
            )}

            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;
