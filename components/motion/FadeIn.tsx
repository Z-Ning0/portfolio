"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  /** 入场延迟（秒），默认 0 */
  delay?: number;
  /** 入场时长（秒），默认 0.5 */
  duration?: number;
  /** 滑入方向，默认 "up" */
  direction?: Direction;
  /** 位移距离（px），默认 24 */
  distance?: number;
} & Omit<
  HTMLMotionProps<"div">,
  "initial" | "animate" | "whileInView" | "viewport" | "transition" | "children"
>;

const directionOffset = (
  direction: Direction,
  distance: number
): { x?: number; y?: number } => {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
  }
};

export const FadeIn = ({
  children,
  className,
  delay = 0,
  duration = 0.5,
  direction = "up",
  distance = 24,
  ...rest
}: FadeInProps) => {
  const reduced = useReducedMotion();

  const offset = directionOffset(direction, distance);

  return (
    <motion.div
      className={cn(className)}
      initial={reduced ? false : { opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: reduced ? 0 : duration,
        delay: reduced ? 0 : delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
