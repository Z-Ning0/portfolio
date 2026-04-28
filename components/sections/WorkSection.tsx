"use client";

import { useState, useId } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FadeIn } from "@/components/motion/FadeIn";
import { FilterTabs } from "@/components/ui/FilterTabs";
import ProjectCard from "@/components/ui/ProjectCard";
import type { Project } from "@/types/project";

// ── 类型 ─────────────────────────────────────────────────────────

type WorkSectionProps = {
  /** 全部作品列表，由父级（Server Component）传入 */
  projects: Project[];
  /** 所有去重标签 */
  tags: string[];
};

// ── 卡片动画变体 ─────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: i * 0.07,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.97,
    transition: { duration: 0.25, ease: [0.55, 0, 1, 0.45] },
  },
};

// ── WorkSection ──────────────────────────────────────────────────

export default function WorkSection({ projects, tags }: WorkSectionProps) {
  const reduced = useReducedMotion();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const gridId = useId();

  // 过滤逻辑
  const filtered = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects;

  return (
    <section
      id="work"
      className="bg-white py-24 md:py-32"
      aria-label="作品集"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">

        {/* ── 区块标题 ── */}
        <FadeIn className="mb-12 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-blue-600">
            Work
          </span>
          <h2 className="font-heading text-4xl font-bold text-zinc-900 md:text-5xl">
            精选作品
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-zinc-500">
            设计与开发的全流程实战项目，从 0 到 1 的产品构建经历
          </p>
        </FadeIn>

        {/* ── FilterTabs ── */}
        {tags.length > 0 && (
          <FadeIn delay={0.1} className="mb-10 flex justify-center">
            <FilterTabs
              tags={tags}
              activeTag={activeTag}
              onChange={setActiveTag}
            />
          </FadeIn>
        )}

        {/* ── 卡片网格 ── */}
        {projects.length === 0 ? (
          /* 无作品空状态 */
          <FadeIn className="flex justify-center">
            <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-10 py-16 text-center">
              <p className="text-sm text-zinc-400">
                暂无作品，请在{" "}
                <code className="font-mono text-blue-600">content/work/</code>{" "}
                下新建 MDX 文件。
              </p>
            </div>
          </FadeIn>
        ) : (
          <div
            role="region"
            aria-label={activeTag ? `${activeTag} 类别作品` : "全部作品"}
            aria-live="polite"
          >
            {/* 筛选结果数量提示 */}
            <AnimatePresence mode="wait">
              {activeTag && (
                <motion.p
                  key={activeTag}
                  initial={reduced ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? {} : { opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-6 text-center text-sm text-zinc-400"
                >
                  共{" "}
                  <span className="font-medium text-zinc-700">
                    {filtered.length}
                  </span>{" "}
                  个「{activeTag}」相关作品
                </motion.p>
              )}
            </AnimatePresence>

            {/* 卡片网格 */}
            <motion.div
              key={gridId}
              layout
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {filtered.map((project, i) => (
                  <motion.div
                    key={project.slug}
                    layout
                    custom={i}
                    variants={reduced ? {} : cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* 过滤后无结果 */}
            <AnimatePresence>
              {filtered.length === 0 && (
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex justify-center py-16"
                >
                  <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-10 py-12 text-center">
                    <p className="text-sm text-zinc-400">
                      该分类下暂无作品
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTag(null)}
                      className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      查看全部作品
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
