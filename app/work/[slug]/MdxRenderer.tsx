"use client";

import { useMDXComponent } from "next-contentlayer/hooks";
import { cn } from "@/lib/utils";

// ── MDX 自定义组件（深色内容区背景为白色，文字为 zinc-900） ────────

const mdxComponents = {
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "mt-10 mb-4 font-heading text-2xl font-bold text-zinc-900",
        "border-b border-zinc-100 pb-2",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "mt-8 mb-3 font-heading text-xl font-semibold text-zinc-900",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "mt-6 mb-2 font-heading text-base font-semibold text-zinc-800",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        "my-4 text-base leading-[1.85] text-zinc-600",
        className
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn("my-4 space-y-2 pl-5", className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn("my-4 list-decimal space-y-2 pl-5", className)}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      className={cn(
        "text-base leading-relaxed text-zinc-600",
        "marker:text-zinc-400",
        "[&>ul]:mt-2 [&>ul]:mb-0",
        className
      )}
      {...props}
    />
  ),
  strong: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => (
    <strong
      className={cn("font-semibold text-zinc-900", className)}
      {...props}
    />
  ),
  blockquote: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        "my-6 border-l-4 border-blue-400 pl-5",
        "text-base italic text-zinc-500",
        className
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr
      className={cn("my-8 border-zinc-100", className)}
      {...props}
    />
  ),
  code: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        "rounded-md bg-zinc-100 px-1.5 py-0.5",
        "font-mono text-[0.875em] text-zinc-800",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        "my-6 overflow-x-auto rounded-2xl bg-zinc-900 p-5",
        "text-sm leading-relaxed text-zinc-100",
        "[&>code]:bg-transparent [&>code]:p-0 [&>code]:text-zinc-100",
        className
      )}
      {...props}
    />
  ),
  a: ({
    className,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn(
        "font-medium text-blue-600 underline underline-offset-4",
        "decoration-blue-200 transition-colors hover:text-blue-700 hover:decoration-blue-400",
        className
      )}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
};

// ── MdxRenderer ──────────────────────────────────────────────────

export type MdxRendererProps = {
  code: string;
};

export function MdxRenderer({ code }: MdxRendererProps) {
  const Content = useMDXComponent(code);
  return (
    <div className="mdx-content">
      <Content components={mdxComponents} />
    </div>
  );
}
