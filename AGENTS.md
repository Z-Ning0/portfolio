# AGENTS.md — AI 开发规范

本文件为 AI 编码助手提供项目上下文和开发规范。在生成或修改任何代码前，请先阅读本文件。

---

## 项目概述

**个人作品集网站**，面向设计师 / 开发者的专业形象展示平台。  
完整需求见 `PRD.md`，架构细节见 `TECH_DESIGN.md`。

- **框架**：Next.js 14（App Router）
- **语言**：TypeScript（严格模式）
- **样式**：Tailwind CSS v3
- **动效**：Framer Motion v11
- **内容**：MDX + Contentlayer
- **部署**：Vercel

---

## 项目结构

```
app/              # Next.js App Router 页面
components/
  layout/         # Navbar、Footer
  sections/       # HeroSection、WorkSection、AboutSection、ContactSection
  ui/             # 原子组件：ProjectCard、FilterTabs、ContactForm 等
  motion/         # 动画包装器：FadeIn、StaggerChildren
content/work/     # 作品 MDX 文件（数据源）
lib/              # 工具函数、siteConfig 配置
public/images/    # 图片资源
types/            # TypeScript 类型定义
```

---

## 核心规范

### TypeScript

- 禁止使用 `any`，所有 props 必须定义类型
- 组件 props 用 `type`，需要继承时用 `interface`
- 导出类型和组件放在同一文件

```typescript
// ✅ 正确
type ProjectCardProps = {
  project: Project;
  className?: string;
};

// ❌ 禁止
function ProjectCard(props: any) { ... }
```

### 组件规范

- 所有组件使用函数式组件 + 箭头函数
- 客户端组件（含 hooks / 事件 / 动效）顶部加 `"use client"`
- 服务端组件默认不加，保持 RSC 优先
- 使用 `dynamic()` 懒加载非首屏重型组件（ContactForm、MDX 渲染器）

```typescript
// ✅ 服务端组件（默认）
export default function HeroSection() { ... }

// ✅ 客户端组件
"use client";
export default function Navbar() { ... }

// ✅ 懒加载
const ContactForm = dynamic(() => import("@/components/ui/ContactForm"));
```

### 样式规范

- **只使用 Tailwind 工具类**，禁止内联 style 或手写 CSS class（全局变量除外）
- 类名合并使用 `cn()`（基于 `clsx` + `tailwind-merge`）
- 颜色严格遵守设计 Token，禁止随意使用其他颜色

```typescript
// ✅ 正确
import { cn } from "@/lib/utils";
<div className={cn("rounded-3xl border border-zinc-100", className)} />

// ❌ 禁止
<div style={{ borderRadius: 24, borderColor: "#f4f4f5" }} />
```

**允许使用的颜色 Token：**

| 用途 | Token |
|-----|-------|
| 正文主色 | `text-zinc-900` |
| 次要文字 | `text-zinc-500` |
| 占位/禁用 | `text-zinc-400` |
| 深色背景 | `bg-zinc-900` |
| 卡片背景 | `bg-white` |
| 卡片边框 | `border-zinc-100` |
| 强调色 | `text-blue-600` / `bg-blue-600` |

### 图片规范

- **必须**使用 `next/image` 替代 `<img>`
- Hero 头像等首屏关键图片加 `priority` 属性
- 作品封面图统一使用 `fill` 模式 + `aspect-ratio` 容器
- 始终提供描述性 `alt` 文本

```typescript
// ✅ 正确
<div className="relative aspect-[4/3]">
  <Image src={project.coverImage} alt={`${project.title} 项目截图`} fill className="object-cover" />
</div>

// ❌ 禁止
<img src={project.coverImage} />
```

### 动效规范

- 所有动效使用 Framer Motion，禁止 CSS animation（全局变量中定义的除外）
- 入场动画使用 `whileInView` + `once: true`，只播放一次
- 必须通过 `useReducedMotion()` 检测用户偏好，返回 `true` 时跳过所有动画
- hover 动效时长：150–300ms；入场动效时长：400–600ms

```typescript
// ✅ 正确：支持无障碍
"use client";
import { motion, useReducedMotion } from "framer-motion";

export function FadeIn({ children, delay = 0 }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
```

### 内容数据

- 个人信息统一在 `lib/config.ts` 的 `siteConfig` 中修改，**不要硬编码**在组件里
- 作品数据通过 `content/work/*.mdx` 管理，用 Contentlayer 读取
- 新增作品只需在 `content/work/` 新建 MDX 文件，无需修改组件代码

---

## SEO 规范

- 每个页面必须有唯一的 `title` 和 `description`
- 根布局已配置 `metadataBase`，子页面用 `generateMetadata()` 覆盖
- 所有 OG 图片尺寸：1200×630px，存放于 `public/og-image.png`
- 外部链接必须加 `rel="noopener noreferrer"`

---

## 禁止事项

| 禁止 | 原因 |
|-----|-----|
| 使用 `any` 类型 | 破坏类型安全 |
| 直接使用 `<img>` | 失去图片优化 |
| 硬编码个人信息（姓名、邮箱等） | 维护困难，应读 `siteConfig` |
| 内联 `style` 写颜色/间距 | 违反设计系统，难以维护 |
| 在服务端组件中使用 hooks / 事件 | Next.js RSC 规则 |
| 动效不考虑 `prefers-reduced-motion` | 违反无障碍标准 |
| 卡片嵌套卡片 | 视觉层级混乱 |
| 使用 emoji 作为 UI 图标 | 使用 Lucide React SVG 图标替代 |
| `console.log` 遗留在生产代码 | 信息泄露风险 |

---

## 常用命令

```bash
npm run dev          # 本地开发
npm run build        # 生产构建
npm run lint         # ESLint 检查
npm run type-check   # TypeScript 类型检查
```

---

## 参考文件

- `PRD.md` — 产品需求、功能列表、优先级
- `TECH_DESIGN.md` — 架构设计、组件详细说明、性能策略
- `lib/config.ts` — 所有个人信息和站点配置
- `tailwind.config.ts` — 主题扩展和自定义 Token
- `types/project.ts` — Project 数据类型定义
