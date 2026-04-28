import { allWorks, type Work } from "contentlayer/generated";
import type { Project } from "@/types/project";

// ── 内部工具 ─────────────────────────────────────────────────────

/**
 * 把 Contentlayer 生成的 Work 文档投影成轻量的 UI 层 Project 对象。
 *
 * 刻意只暴露列表/卡片所需字段，MDX 正文（body）通过 `getWorkBySlug`
 * 按需单独获取，避免在不需要正文的场景把编译产物引入客户端 bundle。
 */
function toProject(doc: Work): Project {
  return {
    slug: doc.slug,
    title: doc.title,
    summary: doc.summary,
    coverImage: doc.coverImage,
    tags: [...doc.tags],
    year: doc.year,
    featured: doc.featured,
    liveUrl: doc.liveUrl,
    githubUrl: doc.githubUrl,
    url: doc.url,
  };
}

/**
 * 标准排序规则（输出顺序稳定可复现）：
 * 1. 精选优先（featured = true 排在前面）
 * 2. 年份倒序（最新的在前）
 * 3. 标题字典序（同年份时作为 tiebreaker）
 */
function compareProjects(a: Work, b: Work): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (a.year !== b.year) return b.year - a.year;
  return a.title.localeCompare(b.title);
}

// ── 列表查询 ─────────────────────────────────────────────────────

/**
 * 返回所有作品，按标准规则排序。
 *
 * 适用场景：WorkSection 网格、Sitemap 生成、prev/next 导航计算。
 */
export function getAllProjects(): Project[] {
  return [...allWorks].sort(compareProjects).map(toProject);
}

/**
 * 返回标记了 `featured: true` 的精选作品，保持标准排序。
 *
 * 适用场景：首页精选展示、Hero 区作品预览。
 */
export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}

/**
 * 返回所有作品的总数量。
 *
 * 适用场景：AboutSection 统计数字、Sitemap entry 计数。
 */
export function getProjectCount(): number {
  return allWorks.length;
}

/**
 * 返回精选作品的数量。
 */
export function getFeaturedCount(): number {
  return allWorks.filter((w) => w.featured).length;
}

// ── 单项查询 ─────────────────────────────────────────────────────

/**
 * 按 slug 查找并返回轻量 Project（不含 MDX body）。
 *
 * 适用场景：SEO metadata 生成、社交分享预览。
 * 找不到时返回 `undefined`，调用方应结合 `notFound()` 处理。
 */
export function getProjectBySlug(slug: string): Project | undefined {
  const doc = allWorks.find((w) => w.slug === slug);
  return doc ? toProject(doc) : undefined;
}

/**
 * 按 slug 返回完整的 Work 原始对象（含 `body.code`、`body.raw`）。
 *
 * 适用场景：作品详情页 MDX 正文渲染（`MdxRenderer`）。
 * 找不到时返回 `undefined`，调用方应结合 `notFound()` 处理。
 */
export function getWorkBySlug(slug: string): Work | undefined {
  return allWorks.find((w) => w.slug === slug);
}

/**
 * 返回指定 slug 作品的前一篇与后一篇（基于标准排序）。
 *
 * 适用场景：作品详情页底部"上一个 / 下一个"导航。
 *
 * @returns `{ prev: Project | null, next: Project | null }`
 *   - `prev`：排序中位于当前作品之前的项目，若当前已是第一项则为 null
 *   - `next`：排序中位于当前作品之后的项目，若当前已是最后一项则为 null
 */
export function getAdjacentProjects(slug: string): {
  prev: Project | null;
  next: Project | null;
} {
  const all = getAllProjects();
  const index = all.findIndex((p) => p.slug === slug);

  if (index === -1) return { prev: null, next: null };

  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}

// ── 标签查询 ─────────────────────────────────────────────────────

/**
 * 返回所有作品的去重标签列表，按字母升序排列。
 *
 * 适用场景：WorkSection FilterTabs 渲染。
 */
export function getAllTags(): string[] {
  const set = new Set<string>();
  for (const w of allWorks) {
    for (const tag of w.tags) set.add(tag);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/**
 * 返回每个标签及其对应的作品数量，按作品数降序排列。
 *
 * 适用场景：FilterTabs 显示数量角标、标签云权重渲染。
 *
 * @example
 * // [{ tag: "Design", count: 2 }, { tag: "React", count: 2 }, ...]
 */
export function getTagsWithCount(): Array<{ tag: string; count: number }> {
  const counts = new Map<string, number>();
  for (const w of allWorks) {
    for (const tag of w.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * 返回指定标签下的所有作品，保持标准排序。
 *
 * 适用场景：标签详情页（未来扩展）、WorkSection 客户端过滤的服务端备用。
 */
export function getProjectsByTag(tag: string): Project[] {
  return getAllProjects().filter((p) => p.tags.includes(tag));
}

// ── Sitemap / 路由 ───────────────────────────────────────────────

/**
 * 返回所有作品的 slug 列表。
 *
 * 适用场景：`generateStaticParams`、`sitemap.ts` URL 生成。
 */
export function getProjectSlugs(): string[] {
  return allWorks.map((w) => w.slug);
}
