"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type StaggerChildrenProps = {
  children: React.ReactNode;
  className?: string;
  /** 子元素之间的交错延迟（秒），默认 0.08 */
  staggerDelay?: number;
  /** 每个子元素入场时长（秒），默认 0.5 */
  duration?: number;
  /** 子元素纵向位移距离（px），默认 32 */
  distance?: number;
  /** 容器整体触发前的延迟（秒），默认 0 */
  delay?: number;
  /** viewport 触发阈值，默认 0.1 */
  viewportAmount?: number;
} & Omit<
  HTMLMotionProps<"div">,
  | "initial"
  | "animate"
  | "whileInView"
  | "viewport"
  | "transition"
  | "variants"
  | "children"
>;

/** 子元素 item 变体，通过 CSS custom property 注入 duration/distance */
const buildVariants = (duration: number, distance: number): Variants => ({
  hidden: { opacity: 0, y: distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
});

/**
 * StaggerChildren — 子元素交错入场动画容器
 *
 * 使用方式：
 * ```tsx
 * <StaggerChildren className="grid grid-cols-3 gap-6">
 *   <ProjectCard ... />
 *   <ProjectCard ... />
 *   <ProjectCard ... />
 * </StaggerChildren>
 * ```
 *
 * 每个直接子元素会被自动包裹在 motion.div 内，以 staggerChildren 交错入场。
 * 遵循 prefers-reduced-motion：检测到用户偏好时跳过全部动画。
 */
export const StaggerChildren = ({
  children,
  className,
  staggerDelay = 0.08,
  duration = 0.5,
  distance = 32,
  delay = 0,
  viewportAmount = 0.1,
  ...rest
}: StaggerChildrenProps) => {
  const reduced = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : staggerDelay,
        delayChildren: reduced ? 0 : delay,
      },
    },
  };

  const itemVariants = reduced
    ? ({ hidden: {}, visible: {} } satisfies Variants)
    : buildVariants(duration, distance);

  return (
    <motion.div
      className={cn(className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount }}
      {...rest}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StaggerChildren;
