import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Globe,
  GitFork,
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
  SaaS: "from-blue-600 to-indigo-700",
  Design: "from-rose-500 to-pink-700",
  React: "from-violet-600 to-purple-800",
  Mobile: "from-emerald-500 to-teal-700",
  Dashboard: "from-orange-500 to-amber-700",
  Branding: "from-cyan-500 to-sky-700",
};

function pickGradient(tags: readonly string[]): string {
  for (const t of tags) {
    if (TAG_GRADIENTS[t]) return TAG_GRADIENTS[t];
  }
  return "from-zinc-600 to-zinc-800";
}

// ── generateStaticParams ──────────────────────────────────────────

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

// ── generateMetadata ──────────────────────────────────────────────

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

  const { prev: prevProject, next: nextProject } = getAdjacentProjects(slug);
  const gradient = pickGradient(work.tags);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero 封面区（全出血，图片延伸至 Navbar 后方） ── */}
      <div className="relative min-h-[540px] h-[70vh] w-full overflow-hidden">
        {/* 渐变底色 */}
        <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />

        {/* 封面图 */}
        {work.coverImage && (
          <Image
            src={work.coverImage}
            alt={`${work.title} 项目封面`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}

        {/* 深色蒙版：底部重，顶部轻，让标题在图片上清晰可读 */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/85 via-zinc-900/30 to-zinc-900/20" />

        {/* 返回按钮（浮在左上，偏移 Navbar 高度） */}
        <div className="absolute left-0 right-0 top-24 z-10 px-4 md:px-8">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/#work"
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2",
                "bg-black/20 text-sm font-medium text-white backdrop-blur-md",
                "transition-all duration-200 hover:bg-black/40",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              )}
            >
              <ArrowLeft size={14} aria-hidden="true" />
              返回作品集
            </Link>
          </div>
        </div>

        {/* 标题信息叠加在图片底部 */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-12 md:px-8">
          <div className="mx-auto max-w-5xl">
            {/* 年份 */}
            <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/50">
              <Calendar size={11} aria-hidden="true" />
              {work.year}
            </div>

            {/* 项目标题 */}
            <h1 className="font-heading text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {work.title}
            </h1>

            {/* 一句话描述 */}
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">
              {work.summary}
            </p>

            {/* 标签 + 外链按钮 */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {/* 标签 */}
              <div className="flex flex-wrap gap-2">
                {work.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/75 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 链接按钮 */}
              <div className="ml-auto flex flex-wrap gap-2">
                {work.liveUrl && (
                  <a
                    href={work.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5",
                      "bg-white text-xs font-semibold text-zinc-900",
                      "transition-all duration-200 hover:bg-zinc-100 hover:-translate-y-px"
                    )}
                  >
                    <Globe size={12} aria-hidden="true" />
                    Live 预览
                  </a>
                )}
                {work.githubUrl && (
                  <a
                    href={work.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border border-white/25 px-4 py-1.5",
                      "bg-white/10 text-xs font-semibold text-white backdrop-blur-sm",
                      "transition-all duration-200 hover:bg-white/20 hover:-translate-y-px"
                    )}
                  >
                    <GitFork size={12} aria-hidden="true" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 正文内容区 ── */}
      <div className="mx-auto max-w-3xl px-4 py-14 md:px-8 md:py-20">
        <article aria-label={`${work.title} 项目详情`}>
          <MdxRenderer code={work.body.code} />
        </article>
      </div>

      {/* ── 上/下篇导航 ── */}
      {(prevProject || nextProject) && (
        <nav aria-label="作品导航" className="border-t border-zinc-100">
          <div className="mx-auto grid max-w-5xl grid-cols-1 px-4 sm:grid-cols-2 md:px-8">
            {prevProject ? (
              <Link
                href={`/work/${prevProject.slug}`}
                className={cn(
                  "group flex flex-col gap-1.5 border-b border-zinc-100 py-10 pr-8",
                  "sm:border-b-0 sm:border-r",
                  "transition-colors duration-200 hover:bg-zinc-50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset"
                )}
              >
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  <ChevronLeft size={13} aria-hidden="true" />
                  上一个
                </span>
                <span className="font-heading text-lg font-semibold text-zinc-900 transition-colors duration-200 group-hover:text-blue-600">
                  {prevProject.title}
                </span>
                <span className="line-clamp-1 text-sm text-zinc-400">
                  {prevProject.summary}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {nextProject ? (
              <Link
                href={`/work/${nextProject.slug}`}
                className={cn(
                  "group flex flex-col gap-1.5 py-10 pl-8 text-right",
                  "transition-colors duration-200 hover:bg-zinc-50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset"
                )}
              >
                <span className="flex items-center justify-end gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  下一个
                  <ChevronRight size={13} aria-hidden="true" />
                </span>
                <span className="font-heading text-lg font-semibold text-zinc-900 transition-colors duration-200 group-hover:text-blue-600">
                  {nextProject.title}
                </span>
                <span className="line-clamp-1 text-sm text-zinc-400">
                  {nextProject.summary}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
