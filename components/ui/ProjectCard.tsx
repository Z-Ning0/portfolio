"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Globe, GitFork } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

// ── 标签渐变色映射 ───────────────────────────────────────────────

const TAG_GRADIENTS: Record<string, string> = {
  SaaS: "from-blue-500 to-indigo-600",
  Design: "from-rose-400 to-pink-600",
  React: "from-violet-500 to-purple-700",
  Mobile: "from-emerald-400 to-teal-600",
  Dashboard: "from-orange-400 to-amber-600",
  Branding: "from-cyan-400 to-sky-600",
};
const FALLBACK_GRADIENT = "from-zinc-500 to-zinc-700";

function pickGradient(tags: readonly string[]): string {
  for (const t of tags) {
    if (TAG_GRADIENTS[t]) return TAG_GRADIENTS[t];
  }
  return FALLBACK_GRADIENT;
}

// ── 封面图（支持图片加载失败时降级为渐变占位） ─────────────────────

type CoverImageProps = {
  src: string;
  alt: string;
  gradient: string;
};

function CoverImage({ src, alt, gradient }: CoverImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <GradientPlaceholder gradient={gradient} />
    );
  }

  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        onError={() => setFailed(true)}
      />
      {/* 悬停时底部遮罩渐变 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </>
  );
}

function GradientPlaceholder({ gradient }: { gradient: string }) {
  return (
    <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)}>
      {/* 装饰性图案 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="0.75"
          className="opacity-25 transition-transform duration-500 ease-out group-hover:scale-110"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
      {/* 悬停时底部遮罩渐变 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}

// ── 外链按钮（z-index 高于卡片主链接遮罩层） ────────────────────────

type ExternalLinkButtonProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

function ExternalLinkButton({ href, label, icon }: ExternalLinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "relative z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
        "text-xs font-medium text-zinc-500 border border-zinc-100",
        "bg-white transition-all duration-200",
        "hover:border-zinc-300 hover:text-zinc-900 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
      )}
    >
      {icon}
      {label}
    </a>
  );
}

// ── ProjectCard ─────────────────────────────────────────────────

export type ProjectCardProps = {
  project: Project;
  className?: string;
};

export default function ProjectCard({ project, className }: ProjectCardProps) {
  const reduced = useReducedMotion();
  const gradient = pickGradient(project.tags);

  return (
    <motion.article
      whileHover={reduced ? {} : { y: -8 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn("group relative", className)}
    >
      {/* 卡片外壳 */}
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border border-zinc-100 bg-white",
          "shadow-sm transition-shadow duration-300",
          "group-hover:shadow-xl group-hover:shadow-zinc-200/60"
        )}
      >
        {/* ── 封面图区 ── */}
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
          <CoverImage
            src={project.coverImage}
            alt={`${project.title} 项目封面`}
            gradient={gradient}
          />

          {/* Featured 徽章 */}
          {project.featured && (
            <span
              className={cn(
                "absolute right-3 top-3 z-10",
                "inline-flex items-center px-2.5 py-0.5 rounded-full",
                "bg-white/95 backdrop-blur-sm",
                "text-xs font-semibold text-zinc-800",
                "shadow-sm"
              )}
            >
              精选
            </span>
          )}

          {/* 标签列表 */}
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5 max-w-[70%]">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 跳转箭头指示（hover 显现） */}
          <div
            className={cn(
              "absolute right-3 bottom-3 z-10",
              "flex h-8 w-8 items-center justify-center rounded-full",
              "bg-white shadow-md",
              "opacity-0 translate-y-1 transition-all duration-300",
              "group-hover:opacity-100 group-hover:translate-y-0"
            )}
            aria-hidden="true"
          >
            <ArrowUpRight size={15} className="text-zinc-700" />
          </div>
        </div>

        {/* ── 内容区 ── */}
        <div className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            {project.year}
          </p>
          <h3 className="mt-1 font-heading text-lg font-semibold leading-snug text-zinc-900 transition-colors duration-200 group-hover:text-blue-600">
            {project.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-500">
            {project.summary}
          </p>

          {/* 外链按钮组 */}
          {(project.liveUrl || project.githubUrl) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.liveUrl && (
                <ExternalLinkButton
                  href={project.liveUrl}
                  label="Live 预览"
                  icon={<Globe size={12} aria-hidden="true" />}
                />
              )}
              {project.githubUrl && (
                <ExternalLinkButton
                  href={project.githubUrl}
                  label="GitHub"
                  icon={<GitFork size={12} aria-hidden="true" />}
                />
              )}
            </div>
          )}
        </div>

        {/* 主导航链接遮罩层（z-0，覆盖整张卡片，外链按钮 z-10 在其上方） */}
        <Link
          href={`/work/${project.slug}`}
          aria-label={`查看 ${project.title} 项目详情`}
          className={cn(
            "absolute inset-0 z-0",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-blue-600 focus-visible:ring-offset-2",
            "rounded-3xl"
          )}
        />
      </div>
    </motion.article>
  );
}
