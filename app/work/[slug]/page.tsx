import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Globe,
  GitFork,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import {
  getWorkBySlug,
  getAdjacentProjects,
  getProjectSlugs,
} from "@/lib/projects";
import { MdxRenderer } from "./MdxRenderer";

// ── 渐变占位色映射（封面图缺失时使用） ─────────────────────────────

const TAG_GRADIENTS: Record<string, string> = {
  SaaS: "from-blue-500 to-indigo-600",
  Design: "from-rose-400 to-pink-600",
  React: "from-violet-500 to-purple-700",
  Mobile: "from-emerald-400 to-teal-600",
  Dashboard: "from-orange-400 to-amber-600",
  Branding: "from-cyan-400 to-sky-600",
};

function pickGradient(tags: readonly string[]): string {
  for (const t of tags) {
    if (TAG_GRADIENTS[t]) return TAG_GRADIENTS[t];
  }
  return "from-zinc-500 to-zinc-700";
}

// ── generateStaticParams — SSG 预生成所有作品路径 ─────────────────

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

// ── generateMetadata — 每页独立 SEO ──────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) return {};

  return {
    title: work.title,
    description: work.summary,
    openGraph: {
      title: `${work.title} | ${siteConfig.name}`,
      description: work.summary,
      type: "article",
      images: work.coverImage ? [{ url: work.coverImage }] : [],
    },
  };
}

// ── 页面组件 ─────────────────────────────────────────────────────

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) notFound();

  // 上/下一篇导航
  const { prev: prevProject, next: nextProject } = getAdjacentProjects(slug);

  const gradient = pickGradient(work.tags);

  return (
    <div className="min-h-screen bg-white pt-20">

      {/* ── 顶部导航条（sticky 偏移与主 Navbar 底部对齐，避免被遮挡）── */}
      <div className="sticky top-20 z-40 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 md:px-8">
          <Link
            href="/#work"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5",
              "text-sm font-medium text-zinc-500",
              "transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
            )}
          >
            <ArrowLeft size={15} aria-hidden="true" />
            作品集
          </Link>
          <p className="hidden truncate text-sm font-medium text-zinc-700 sm:block max-w-xs">
            {work.title}
          </p>
          <div className="flex items-center gap-2">
            {work.liveUrl && (
              <a
                href={work.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5",
                  "text-sm font-medium text-zinc-500",
                  "transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
                )}
              >
                <ExternalLink size={13} aria-hidden="true" />
                <span className="hidden sm:inline">Live Demo</span>
              </a>
            )}
            {work.githubUrl && (
              <a
                href={work.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5",
                  "text-sm font-medium text-zinc-500",
                  "transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
                )}
              >
                <GitFork size={13} aria-hidden="true" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── 封面图区（渐变占位，真实图片就位后替换为 next/image） ── */}
      <div className="relative aspect-[21/9] w-full overflow-hidden">
        <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />
        {/* 装饰性光感叠加 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5" />
        {/* 中心装饰图标 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="72"
            height="72"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="0.6"
            className="opacity-20"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
      </div>

      {/* ── 主内容区 ── */}
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">

        {/* 标题区 */}
        <header className="mb-10">
          {/* 年份 */}
          <div className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-zinc-400">
            <Calendar size={12} aria-hidden="true" />
            {work.year}
          </div>

          {/* 项目标题 */}
          <h1 className="font-heading text-4xl font-bold leading-tight text-zinc-900 md:text-5xl">
            {work.title}
          </h1>

          {/* 一句话描述 */}
          <p className="mt-4 text-lg leading-relaxed text-zinc-500">
            {work.summary}
          </p>

          {/* 标签 + 外链 */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            {/* 标签列表 */}
            <div className="flex flex-wrap gap-2" aria-label="项目标签">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 外部链接按钮组 */}
            <div className="flex flex-wrap gap-2">
              {work.liveUrl && (
                <a
                  href={work.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-4 py-2",
                    "bg-zinc-900 text-sm font-medium text-white",
                    "transition-all duration-200 hover:bg-zinc-700 hover:-translate-y-px"
                  )}
                >
                  <Globe size={14} aria-hidden="true" />
                  Live 预览
                </a>
              )}
              {work.githubUrl && (
                <a
                  href={work.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2",
                    "bg-white text-sm font-medium text-zinc-700",
                    "transition-all duration-200 hover:border-zinc-300 hover:text-zinc-900 hover:-translate-y-px"
                  )}
                >
                  <GitFork size={14} aria-hidden="true" />
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* 分割线 */}
          <div className="mt-8 border-t border-zinc-100" />
        </header>

        {/* MDX 正文内容 */}
        <article aria-label={`${work.title} 项目详情`}>
          <MdxRenderer code={work.body.code} />
        </article>
      </div>

      {/* ── 上/下篇导航 ── */}
      {(prevProject || nextProject) && (
        <nav
          aria-label="作品导航"
          className="border-t border-zinc-100 bg-zinc-50"
        >
          <div className="mx-auto grid max-w-4xl grid-cols-1 divide-y divide-zinc-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 px-4 md:px-8">
            {/* 上一篇 */}
            {prevProject ? (
              <Link
                href={`/work/${prevProject.slug}`}
                className={cn(
                  "group flex flex-col gap-1 py-8 pr-6",
                  "transition-colors duration-200 hover:bg-white",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset"
                )}
              >
                <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-zinc-400">
                  <ChevronLeft size={13} aria-hidden="true" />
                  上一个作品
                </span>
                <span className="font-heading text-base font-semibold text-zinc-900 transition-colors duration-200 group-hover:text-blue-600">
                  {prevProject.title}
                </span>
                <span className="line-clamp-1 text-sm text-zinc-500">
                  {prevProject.summary}
                </span>
              </Link>
            ) : (
              <div className="py-8 pr-6" />
            )}

            {/* 下一篇 */}
            {nextProject ? (
              <Link
                href={`/work/${nextProject.slug}`}
                className={cn(
                  "group flex flex-col gap-1 py-8 pl-6 text-right",
                  "transition-colors duration-200 hover:bg-white",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset"
                )}
              >
                <span className="flex items-center justify-end gap-1.5 text-xs font-medium uppercase tracking-wider text-zinc-400">
                  下一个作品
                  <ChevronRight size={13} aria-hidden="true" />
                </span>
                <span className="font-heading text-base font-semibold text-zinc-900 transition-colors duration-200 group-hover:text-blue-600">
                  {nextProject.title}
                </span>
                <span className="line-clamp-1 text-sm text-zinc-500">
                  {nextProject.summary}
                </span>
              </Link>
            ) : (
              <div className="py-8 pl-6" />
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
