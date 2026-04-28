"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Palette,
  Code2,
  FileText,
  Briefcase,
  MapPin,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

// ── 动画变体 ─────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  },
});

const fadeLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: -36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  },
});

const fadeRight = (delay = 0) => ({
  hidden: { opacity: 0, x: 36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  },
});

// ── 数字成就卡 ───────────────────────────────────────────────────

type StatCardProps = {
  value: string;
  label: string;
  icon: React.ReactNode;
  delay?: number;
};

function StatCard({ value, label, icon, delay = 0 }: StatCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      variants={reduced ? {} : fadeUp(delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={cn(
        "flex flex-col gap-3 rounded-2xl",
        "border border-zinc-100 bg-white p-6",
        "shadow-sm transition-shadow duration-300 hover:shadow-md"
      )}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div>
        <AnimatedCounter
          value={value}
          sizeClassName="text-3xl"
          delay={reduced ? 0 : delay * 1000}
        />
        <p className="mt-0.5 text-sm text-zinc-500">{label}</p>
      </div>
    </motion.div>
  );
}

// ── 技能分组 ─────────────────────────────────────────────────────

type SkillGroupProps = {
  icon: React.ReactNode;
  title: string;
  skills: readonly string[];
  category: "design" | "dev";
  delay?: number;
};

function SkillGroup({ icon, title, skills, category, delay = 0 }: SkillGroupProps) {
  const reduced = useReducedMotion();

  return (
    <div>
      {/* 分组标题 */}
      <motion.div
        variants={reduced ? {} : fadeUp(delay)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="mb-3 flex items-center gap-2"
      >
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg",
            category === "design"
              ? "bg-rose-100 text-rose-600"
              : "bg-blue-100 text-blue-600"
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {title}
        </p>
      </motion.div>

      {/* 标签云 */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <motion.div
            key={skill}
            variants={reduced ? {} : fadeUp(delay + 0.06 + i * 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            <SkillBadge label={skill} category={category} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 亮点信息项 ───────────────────────────────────────────────────

const highlights = [
  {
    icon: <MapPin size={14} />,
    label: "所在地",
    value: siteConfig.location,
    highlight: false,
  },
  {
    icon: <Clock size={14} />,
    label: "工作状态",
    value: siteConfig.availableForWork ? "接受合作" : "暂不接受",
    highlight: siteConfig.availableForWork,
  },
  {
    icon: <TrendingUp size={14} />,
    label: "擅长领域",
    value: "UI/UX & 前端开发",
    highlight: false,
  },
  {
    icon: <Users size={14} />,
    label: "工作语言",
    value: "中文 / English",
    highlight: false,
  },
] as const;

// ── 数字成就配置（匹配 siteConfig.stats + 图标） ──────────────────

const STAT_ICONS = [
  <Clock size={16} key="clock" />,
  <Briefcase size={16} key="briefcase" />,
  <TrendingUp size={16} key="trending" />,
];

// ── AboutSection ─────────────────────────────────────────────────

export default function AboutSection() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-zinc-50 py-24 md:py-32"
      aria-label="关于我"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">

        {/* ── 区块标题 ── */}
        <motion.div
          variants={reduced ? {} : fadeUp(0)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-blue-600">
            About Me
          </span>
          <h2 className="font-heading text-4xl font-bold text-zinc-900 md:text-5xl">
            关于我
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-500">
            {siteConfig.description}
          </p>
        </motion.div>

        {/* ── 数字成就（顶部横排） ── */}
        <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {siteConfig.stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              icon={STAT_ICONS[i] ?? <TrendingUp size={16} />}
              delay={0.08 + i * 0.1}
            />
          ))}
        </div>

        {/* ── 主体双栏 ── */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">

          {/* ── 左栏：个人简介 + 行动按钮 ── */}
          <motion.div
            variants={reduced ? {} : fadeLeft(0.12)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-col gap-8"
          >
            {/* 简介文字 */}
            <div className="space-y-4">
              <h3 className="font-heading text-xl font-semibold text-zinc-900">
                你好，我是{siteConfig.name} 👋
              </h3>
              <p className="text-base leading-[1.8] text-zinc-600">
                一位专注于用户体验与前端工程的设计师 & 开发者，相信好的产品不仅要
                「能用」，更要「好用」且「好看」。
              </p>
              <p className="text-base leading-[1.8] text-zinc-600">
                从早期原型到最终上线，我独立完成过多个从 0 到 1 的产品设计与开发项目，
                擅长在业务目标与设计美感之间找到平衡点，交付兼顾体验与性能的 Web 产品。
              </p>
              <p className="text-base leading-[1.8] text-zinc-600">
                目前基于
                <span className="font-medium text-zinc-900">
                  {" "}{siteConfig.location}
                </span>
                ，
                {siteConfig.availableForWork
                  ? "接受远程合作与自由职业项目。"
                  : "暂不接受新项目。"}
              </p>
            </div>

            {/* 亮点信息格 */}
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.label}
                  variants={reduced ? {} : fadeUp(0.2 + i * 0.07)}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  className="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-white p-3.5"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex-none",
                      item.highlight ? "text-emerald-500" : "text-zinc-400"
                    )}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                      {item.label}
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 text-sm font-medium",
                        item.highlight ? "text-emerald-600" : "text-zinc-800"
                      )}
                    >
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 行动按钮 */}
            <div className="flex flex-wrap gap-3">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-5 py-2.5",
                  "bg-zinc-900 text-sm font-medium text-white",
                  "transition-all duration-200 hover:bg-zinc-700 hover:-translate-y-px",
                  "hover:shadow-lg hover:shadow-zinc-900/15",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
                )}
              >
                <FileText size={15} aria-hidden="true" />
                下载简历
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-5 py-2.5",
                  "bg-white text-sm font-medium text-zinc-700",
                  "transition-all duration-200 hover:border-zinc-300 hover:text-zinc-900 hover:-translate-y-px",
                  "hover:shadow-md hover:shadow-zinc-200/60",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
                )}
              >
                <Briefcase size={15} aria-hidden="true" />
                开始合作
              </a>
            </div>
          </motion.div>

          {/* ── 右栏：技能标签云 ── */}
          <motion.div
            variants={reduced ? {} : fadeRight(0.18)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-col gap-6"
          >
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 font-heading text-base font-semibold text-zinc-900">
                技能栈
              </h3>

              <div className="flex flex-col gap-7">
                {/* 设计技能 */}
                <SkillGroup
                  icon={<Palette size={14} />}
                  title="设计"
                  skills={siteConfig.skills.design}
                  category="design"
                  delay={0.25}
                />

                {/* 分隔线 */}
                <div className="border-t border-zinc-100" role="separator" />

                {/* 开发技能 */}
                <SkillGroup
                  icon={<Code2 size={14} />}
                  title="开发"
                  skills={siteConfig.skills.dev}
                  category="dev"
                  delay={0.35}
                />
              </div>
            </div>

            {/* 工作流程说明 */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-2">
                工作方式
              </p>
              <p className="text-sm leading-relaxed text-blue-900/70">
                从用户研究到交互原型，再到前端实现，我覆盖产品设计的完整闭环。
                习惯与工程团队紧密协作，确保设计意图在代码中被精准还原。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
