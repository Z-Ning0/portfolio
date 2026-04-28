# 个人作品集网站 — 技术设计文档（TECH DESIGN v1.0）

> 基于 PRD v1.0 编写，技术方案采用 **Next.js 14（方案 B）**  
> 最后更新：2026-04-23

---

## 目录

1. [技术选型决策](#1-技术选型决策)
2. [项目结构](#2-项目结构)
3. [页面与路由设计](#3-页面与路由设计)
4. [数据模型设计](#4-数据模型设计)
5. [组件架构](#5-组件架构)
6. [样式系统](#6-样式系统)
7. [动效方案](#7-动效方案)
8. [SEO 实现方案](#8-seo-实现方案)
9. [性能优化策略](#9-性能优化策略)
10. [部署与 CI/CD](#10-部署与-cicd)
11. [开发规范](#11-开发规范)

---

## 1. 技术选型决策

### 核心技术栈

| 层次 | 技术 | 版本 | 选型理由 |
|-----|-----|-----|---------|
| 框架 | Next.js | 14.x (App Router) | SSG 静态生成，内置 SEO 优化，`next/image` 图片自动优化 |
| 语言 | TypeScript | 5.x | 类型安全，IDE 提示，降低内容数据出错概率 |
| 样式 | Tailwind CSS | 3.x | 设计 Token 映射自然，响应式工具类覆盖 PRD 断点要求 |
| 内容管理 | MDX + Contentlayer | latest | Markdown 文件驱动作品数据，无需数据库，Git 友好 |
| 动效 | Framer Motion | 11.x | 声明式 API，`useReducedMotion` 原生支持无障碍 |
| 图标 | Lucide React | latest | 统一 SVG 图标集，按需引入，包体积可控 |
| 表单 | React Hook Form + Formspree | latest | 轻量校验，无后端发送邮件 |
| 部署 | Vercel | — | 与 Next.js 原生集成，边缘网络，自动预览链接 |

### 选型对比记录

#### 为什么不用纯 HTML（方案 A）？

| 维度 | 纯 HTML | Next.js |
|-----|---------|---------|
| 内容更新 | 直接改 HTML，容易破坏样式 | 改 `.mdx` 文件，关注点分离 |
| 作品详情页 | 需手动复制粘贴每个 HTML 文件 | 动态路由自动生成 |
| 图片优化 | 手动处理，容易忘记 | `next/image` 自动 WebP + 懒加载 |
| SEO | 手动写 meta 标签 | `generateMetadata()` 统一管理 |
| 可扩展性 | 加博客需重新设计结构 | 加一个路由文件夹即可 |

> 现有 `portfolio.html` 可作为视觉设计参考直接还原为 Next.js 组件。

---

## 2. 项目结构

```
portfolio/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 根布局：字体、Analytics、全局样式
│   ├── page.tsx                  # 首页（单页滚动）
│   ├── work/
│   │   └── [slug]/
│   │       └── page.tsx          # 作品详情页（动态路由）
│   ├── globals.css               # 全局 CSS：Tailwind 指令、自定义变量
│   └── sitemap.ts                # 自动生成 sitemap.xml
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # 悬浮导航栏
│   │   └── Footer.tsx            # 页脚
│   ├── sections/
│   │   ├── HeroSection.tsx       # 英雄区
│   │   ├── WorkSection.tsx       # 作品集网格
│   │   ├── AboutSection.tsx      # 关于我
│   │   └── ContactSection.tsx    # 联系区域
│   ├── ui/
│   │   ├── ProjectCard.tsx       # 作品卡片
│   │   ├── SkillBadge.tsx        # 技能标签
│   │   ├── FilterTabs.tsx        # 作品分类筛选
│   │   ├── AnimatedCounter.tsx   # 数字动画计数
│   │   ├── ContactForm.tsx       # 联系表单
│   │   └── ThemeToggle.tsx       # 暗色模式切换（v1.2）
│   └── motion/
│       ├── FadeIn.tsx            # 通用淡入动画包装器
│       └── StaggerChildren.tsx   # 子元素交错动画包装器
│
├── content/
│   └── work/                     # 作品 MDX 文件
│       ├── nexus-analytics.mdx
│       ├── lumina-store.mdx
│       └── codeflow.mdx
│
├── lib/
│   ├── projects.ts               # 读取 MDX 内容的工具函数
│   └── utils.ts                  # 通用工具（cn classnames 合并等）
│
├── public/
│   ├── images/
│   │   ├── projects/             # 项目截图
│   │   ├── avatar.jpg            # 个人头像
│   │   └── og-image.png          # 社交分享封面图（1200×630px）
│   └── resume.pdf                # 简历下载
│
├── types/
│   └── project.ts                # Project 类型定义
│
├── tailwind.config.ts            # Tailwind 主题扩展
├── contentlayer.config.ts        # Contentlayer MDX 配置
├── next.config.ts                # Next.js 配置
└── tsconfig.json
```

---

## 3. 页面与路由设计

### 路由表

| 路径 | 页面 | 渲染方式 | 说明 |
|-----|-----|---------|-----|
| `/` | 首页（单页滚动） | SSG | 包含所有 section，SEO 主页面 |
| `/work/[slug]` | 作品详情 | SSG | 由 MDX 文件驱动，`generateStaticParams` 预生成 |
| `/sitemap.xml` | 站点地图 | 自动生成 | Next.js `app/sitemap.ts` 输出 |
| `/robots.txt` | 爬虫规则 | 静态文件 | 放 `public/robots.txt` |

### 首页 Section 滚动顺序

```
/
├── <Navbar />              fixed，全程显示
├── <HeroSection />         #hero
├── <WorkSection />         #work
├── <AboutSection />        #about
├── <ContactSection />      #contact
└── <Footer />
```

### 作品详情页结构

```
/work/[slug]
├── 返回按钮（← Back）
├── 项目标题 + 标签
├── 封面图（全宽）
├── 项目概述（问题背景、我的角色）
├── 解决方案 + 过程截图
├── 成果数据（量化指标）
├── 技术栈列表
├── 外链（Live Demo / GitHub）
└── 下一个项目导航
```

---

## 4. 数据模型设计

### Project 类型定义

```typescript
// types/project.ts

export interface Project {
  slug: string;           // URL 标识符，如 "nexus-analytics"
  title: string;          // 项目标题
  summary: string;        // 一句话描述（卡片展示用）
  coverImage: string;     // 封面图路径，相对 /public/images/projects/
  tags: string[];         // 分类标签，如 ["SaaS", "Design", "React"]
  year: number;           // 发布年份
  featured: boolean;      // 是否在首页精选展示
  liveUrl?: string;       // Live 网站链接（可选）
  githubUrl?: string;     // GitHub 链接（可选）
  // MDX body 由 Contentlayer 自动注入
  body: MDXContent;
}
```

### MDX Frontmatter 示例

```mdx
---
title: Nexus Analytics
summary: 为下一代初创公司打造的数据可视化平台
coverImage: /images/projects/nexus-analytics.jpg
tags: [SaaS, Design, React]
year: 2025
featured: true
liveUrl: https://nexus-analytics.example.com
githubUrl: https://github.com/yourname/nexus-analytics
---

## 项目背景

...（正文内容，支持完整 MDX）
```

### 个人信息配置（静态常量）

```typescript
// lib/config.ts —— 所有需要修改的个人信息集中在此文件

export const siteConfig = {
  name: "张三",
  title: "UI/UX 设计师 & 前端开发者",
  description: "专注于构建极简、高性能且具有美感的 Web 应用",
  email: "hello@example.com",
  location: "上海，中国",
  availableForWork: true,
  social: {
    github: "https://github.com/yourname",
    linkedin: "https://linkedin.com/in/yourname",
    twitter: "https://twitter.com/yourname",
    dribbble: "https://dribbble.com/yourname",
  },
  skills: {
    design: ["UI/UX Design", "Design Systems", "Prototyping", "Branding"],
    dev: ["React / Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
  },
  stats: [
    { value: "5+", label: "经验年数" },
    { value: "20+", label: "完成项目" },
    { value: "15+", label: "满意客户" },
  ],
};
```

---

## 5. 组件架构

### 关键组件详细设计

#### `Navbar.tsx`

```
职责：
  - 悬浮固定在视口顶部，毛玻璃背景
  - 监听滚动，动态高亮当前 section 的锚点
  - 移动端折叠为汉堡菜单，点击后展开全屏遮罩导航

Props：无（读取 siteConfig 即可）

状态：
  - activeSection: string    当前高亮的 section ID
  - menuOpen: boolean        移动端菜单开关

实现要点：
  - 使用 IntersectionObserver 检测各 section 可见性
  - 菜单打开时锁定 body 滚动（overflow: hidden）
  - 关闭时恢复，并 focus 回汉堡按钮（无障碍）
```

#### `ProjectCard.tsx`

```
职责：
  - 展示单个作品的缩略卡片
  - hover 触发抬升动画 + 图片缩放
  - 点击跳转到 /work/[slug]

Props：
  project: Project

实现要点：
  - 使用 next/image 的 fill 模式填充图片容器
  - 卡片包裹在 <Link href={`/work/${project.slug}`}> 中
  - Framer Motion whileHover 控制 y 轴偏移
```

#### `FilterTabs.tsx`（v1.1）

```
职责：
  - 渲染所有作品分类标签
  - 点击过滤作品网格展示

Props：
  tags: string[]
  activeTag: string | null
  onChange: (tag: string | null) => void

实现要点：
  - 父组件（WorkSection）维护 activeTag 状态
  - 过滤逻辑：project.tags.includes(activeTag)
  - AnimatePresence 包裹卡片列表，实现过滤时的淡入淡出
```

#### `FadeIn.tsx`（动画包装器）

```typescript
// components/motion/FadeIn.tsx

"use client";
import { motion, useReducedMotion } from "framer-motion";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;       // 延迟秒数，默认 0
  direction?: "up" | "down" | "left" | "right";
}

// 使用 IntersectionObserver 触发（whileInView），
// 每个元素只播放一次（once: true）。
// useReducedMotion() 返回 true 时，跳过所有动画。
```

#### `ContactForm.tsx`

```
职责：
  - 三字段表单（姓名、邮件、留言）
  - 客户端校验 + 提交到 Formspree

技术：
  - React Hook Form 管理状态和校验
  - fetch POST 到 https://formspree.io/f/{form_id}
  - 提交成功/失败状态的 UI 反馈

校验规则：
  - 姓名：必填，2–50 字符
  - 邮件：必填，合法 email 格式
  - 留言：必填，10–500 字符
```

### 组件层级关系

```
app/page.tsx
├── Navbar
├── HeroSection
│   └── FadeIn (包装标题、副标题、按钮)
├── WorkSection
│   ├── FilterTabs
│   └── StaggerChildren
│       └── ProjectCard (×n)
├── AboutSection
│   ├── AnimatedCounter (×3)
│   └── SkillBadge (×n)
├── ContactSection
│   └── ContactForm
└── Footer
```

---

## 6. 样式系统

### Tailwind 主题扩展

```typescript
// tailwind.config.ts

import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Archivo", "sans-serif"],
        body: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        brand: {
          blue: "#2563EB",
          "blue-light": "#DBEAFE",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "count-up": "countUp 1s ease forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
} satisfies Config;
```

### CSS 自定义变量

```css
/* app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-heading: "Archivo", sans-serif;
    --font-body: "Space Grotesk", sans-serif;
    --color-bg: #FAFAFA;
    --color-text: #09090B;
    --color-accent: #2563EB;
  }

  .dark {
    --color-bg: #09090B;
    --color-text: #FAFAFA;
    --color-accent: #3B82F6;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
  }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer utilities {
  .hover-lift {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .hover-lift:hover {
    transform: translateY(-8px);
  }
}
```

### 设计 Token 速查

| Token | 值 | 用途 |
|------|----|-----|
| `text-zinc-900` | `#18181B` | 正文主色 |
| `text-zinc-500` | `#71717A` | 次要说明文字 |
| `text-zinc-400` | `#A1A1AA` | 占位符、禁用态 |
| `bg-zinc-900` | `#18181B` | 深色 section 背景 |
| `bg-zinc-100` | `#F4F4F5` | 卡片悬停填充 |
| `border-zinc-100` | `#F4F4F5` | 卡片边框 |
| `text-blue-600` | `#2563EB` | 强调色、链接色 |
| `rounded-2xl` | `16px` | 按钮、小卡片圆角 |
| `rounded-3xl` | `24px` | 大卡片圆角 |

---

## 7. 动效方案

### 入场动画策略

所有入场动画使用 `whileInView` + `once: true`，只触发一次，避免重复播放干扰用户。

```typescript
// 标准入场变体（可复用）
const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// 交错动画（作品卡片网格）
const staggerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
```

### 各 Section 动效设计

| Section | 动效 | 延迟策略 |
|---------|-----|---------|
| Hero 标题 | fade-up，逐行入场 | 标语 0s → 副标题 0.2s → 按钮组 0.4s |
| 作品卡片 | fade-up，交错入场 | 每张卡片间隔 0.1s |
| About 数字 | 计数动画（0 → 目标值） | viewport 触发时开始 |
| About 内容 | fade-left（文字）/ fade-right（图片） | 同时触发 |
| Contact 标语 | fade-up，字号大，需显眼 | 单次整体入场 |

### 交互动效

| 元素 | 动效 | 实现 |
|-----|-----|-----|
| 作品卡片 hover | translateY(-8px)，图片 scale(1.05) | Framer Motion `whileHover` |
| 导航链接 hover | 颜色过渡到 blue-600 | Tailwind `transition-colors duration-200` |
| CTA 按钮 hover | 背景色加深 + 轻微上移 | Tailwind `hover:` 工具类 |
| 汉堡菜单 | X 形态变换 | Framer Motion `AnimatePresence` |
| 筛选 Tab 切换 | 滑动下划线指示器 | Framer Motion `layoutId` 共享布局 |

---

## 8. SEO 实现方案

### 根布局 Metadata

```typescript
// app/layout.tsx

import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL("https://yourname.com"),
  title: {
    default: `${siteConfig.name} — ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["UI设计", "前端开发", "React", "Next.js", "个人作品集"],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://yourname.com",
    siteName: `${siteConfig.name} Portfolio`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@yourtwitter",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};
```

### 作品详情页动态 Metadata

```typescript
// app/work/[slug]/page.tsx

export async function generateMetadata({ params }): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      images: [{ url: project.coverImage }],
    },
  };
}
```

### Structured Data（JSON-LD）

```typescript
// 在 app/layout.tsx 中注入 Person schema

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: siteConfig.title,
  url: "https://yourname.com",
  sameAs: Object.values(siteConfig.social),
};
// 通过 <script type="application/ld+json"> 注入 <head>
```

---

## 9. 性能优化策略

### 图片优化

```typescript
// 所有图片统一使用 next/image

// 作品封面图 —— 固定宽高比容器
<div className="relative aspect-[4/3]">
  <Image
    src={project.coverImage}
    alt={project.title}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    placeholder="blur"          // 模糊占位
    blurDataURL={blurDataURL}   // 用 plaiceholder 库生成
  />
</div>

// Hero 头像 —— 优先加载
<Image
  src="/images/avatar.jpg"
  priority                  // 禁用懒加载，LCP 关键资源
  ...
/>
```

### 字体加载

```typescript
// app/layout.tsx —— next/font 自托管，避免 Google Fonts 跨域请求

import { Archivo, Space_Grotesk } from "next/font/google";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",          // CLS 优化
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
```

### 代码分割与懒加载

```typescript
// 作品详情页的 MDX 渲染器 —— 懒加载
const MDXContent = dynamic(() => import("@/components/MDXContent"), {
  loading: () => <div className="animate-pulse h-96 bg-zinc-100 rounded-3xl" />,
});

// 联系表单 —— 非首屏，懒加载
const ContactForm = dynamic(() => import("@/components/ui/ContactForm"));

// Framer Motion —— 仅客户端，SSR 关闭
// 所有 motion 组件文件顶部加 "use client"
```

### 构建产物优化

```typescript
// next.config.ts

const nextConfig = {
  output: "export",           // 纯静态输出（如不需要 ISR）
  images: {
    formats: ["image/avif", "image/webp"],  // 现代图片格式
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};
```

### 预期 Lighthouse 评分

| 指标 | 优化前（普通 HTML） | 优化后目标 |
|-----|-----------------|---------|
| Performance | ~75 | ≥ 95 |
| Accessibility | ~85 | ≥ 95 |
| Best Practices | ~80 | ≥ 95 |
| SEO | ~70 | ≥ 100 |

---

## 10. 部署与 CI/CD

### Vercel 部署配置

```json
// vercel.json

{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  "redirects": [
    { "source": "/http", "destination": "https://yourname.com", "permanent": true }
  ]
}
```

### GitHub Actions 自动检查

```yaml
# .github/workflows/ci.yml

name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build

  lighthouse:
    needs: lint-and-build
    runs-on: ubuntu-latest
    steps:
      - uses: treosh/lighthouse-ci-action@v11
        with:
          urls: ${{ secrets.VERCEL_PREVIEW_URL }}
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true
```

### 环境变量

```bash
# .env.local（本地开发，不提交 Git）
NEXT_PUBLIC_FORMSPREE_ID=your_form_id
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Vercel 环境变量（生产环境在 Dashboard 配置）
# NEXT_PUBLIC_SITE_URL=https://yourname.com
```

---

## 11. 开发规范

### 目录与文件命名

| 类型 | 规范 | 示例 |
|-----|-----|-----|
| 组件文件 | PascalCase | `ProjectCard.tsx` |
| 工具函数 | camelCase | `getProjectBySlug.ts` |
| MDX 内容文件 | kebab-case | `nexus-analytics.mdx` |
| 图片资源 | kebab-case | `nexus-cover.jpg` |
| CSS 类名 | Tailwind 工具类优先 | 禁止手写 CSS 类名（除全局变量） |

### TypeScript 规范

```typescript
// 禁止使用 any
// 所有 props 必须定义 interface
// 优先使用 type 而非 interface（除需要 extends 时）

// 好的写法
type ProjectCardProps = {
  project: Project;
  className?: string;
};

// 禁止
function ProjectCard(props: any) { ... }
```

### Git 提交规范（Conventional Commits）

```
feat:     新功能
fix:      Bug 修复
style:    样式调整（不影响功能）
refactor: 代码重构
perf:     性能优化
docs:     文档更新
chore:    构建/工具链变更

示例：
feat: add FilterTabs component for work section
fix: correct mobile menu z-index overlap with hero
perf: add blur placeholder to project cover images
```

### 分支策略

```
main          ← 生产环境，只接受 PR 合并
dev           ← 开发主分支
feature/*     ← 功能分支，如 feature/filter-tabs
fix/*         ← 修复分支，如 fix/mobile-menu-overflow
```

---

## 附录：开发启动命令

```bash
# 克隆仓库
git clone https://github.com/yourname/portfolio.git
cd portfolio

# 安装依赖
npm install

# 本地开发（热更新）
npm run dev

# 类型检查
npm run type-check

# 代码格式化
npm run lint

# 生产构建
npm run build

# 预览生产构建
npm run start
```

## 附录：关键依赖版本锁定

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "framer-motion": "^11.0.0",
    "contentlayer": "^0.3.4",
    "next-contentlayer": "^0.3.4",
    "react-hook-form": "^7.0.0",
    "lucide-react": "latest",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "@types/react": "^18.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "14.x"
  }
}
```
