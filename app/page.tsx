import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { getAllProjects, getAllTags } from "@/lib/projects";
import HeroSection from "@/components/sections/HeroSection";
import WorkSection from "@/components/sections/WorkSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";

// ── 页面级 Metadata ───────────────────────────────────────────────

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.title}`,
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: siteConfig.description,
    type: "website",
  },
};

// ── 首页 ──────────────────────────────────────────────────────────

export default function Home() {
  // 在 Server Component 层读取 MDX 数据，避免客户端 bundle 膨胀
  const projects = getAllProjects();
  const tags = getAllTags();

  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      {/* ① 英雄区：全屏标语 + CTA 按钮 + 动态词轮播 */}
      <HeroSection />

      {/* ② 作品集：FilterTabs + ProjectCard 网格 */}
      <WorkSection projects={projects} tags={tags} />

      {/* ③ 关于我：简介 + AnimatedCounter 成就 + SkillBadge 技能云 */}
      <AboutSection />

      {/* ④ 联系区域：大 CTA + 快速入口 + 联系表单 */}
      <ContactSection />
    </main>
  );
}
