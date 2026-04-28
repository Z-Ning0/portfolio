"use client";

import { useMDXComponent } from "next-contentlayer/hooks";
import { cn } from "@/lib/utils";

// ── MDX 自定义组件 ────────────────────────────────────────────────

const mdxComponents = {
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "mt-12 mb-4 font-heading text-2xl font-bold text-zinc-900",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "mt-8 mb-3 font-heading text-xl font-semibold text-zinc-800",
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
      className={cn("my-5 text-base leading-[1.9] text-zinc-600", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn("my-5 space-y-3", className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn("my-5 list-none space-y-3 counter-reset-[item]", className)}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      className={cn(
        "flex items-start gap-3 rounded-xl bg-zinc-50 px-4 py-3",
        "text-sm leading-relaxed text-zinc-700",
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
        "my-8 rounded-2xl border-l-4 border-blue-500 bg-blue-50 px-6 py-5",
        "text-base italic text-blue-900/70",
        className
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr
      className={cn("my-10 border-zinc-100", className)}
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

// 为列表项自动注入前缀装饰
function ListItemWithDot({ className, children, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      className={cn(
        "flex items-start gap-3 rounded-xl bg-zinc-50 px-4 py-3",
        "text-sm leading-relaxed text-zinc-700",
        className
      )}
      {...props}
    >
      <span
        className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[9px] font-bold text-blue-600"
        aria-hidden="true"
      >
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

const enhancedComponents = {
  ...mdxComponents,
  li: ListItemWithDot,
};

export function MdxRenderer({ code }: MdxRendererProps) {
  const Content = useMDXComponent(code);
  return (
    <div className="mdx-content">
      <Content components={enhancedComponents} />
    </div>
  );
}
