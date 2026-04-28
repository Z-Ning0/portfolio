"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  User,
  AtSign,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── 表单字段类型 ──────────────────────────────────────────────────

type FormValues = {
  name: string;
  email: string;
  message: string;
};

// ── 提交状态 ─────────────────────────────────────────────────────

type SubmitStatus = "idle" | "submitting" | "success" | "error";

// ── 输入框子组件 ─────────────────────────────────────────────────

type FieldWrapProps = {
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
};

function FieldWrap({ icon, error, children }: FieldWrapProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <span
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
          aria-hidden="true"
        >
          {icon}
        </span>
        {children}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400" role="alert">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

// ── 输入框通用样式 ────────────────────────────────────────────────

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-xl border bg-zinc-800/80 pl-10 pr-4 py-3",
    "text-sm text-zinc-100 placeholder:text-zinc-500",
    "outline-none transition-all duration-200",
    "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
    hasError
      ? "border-red-500/60"
      : "border-zinc-700 hover:border-zinc-600"
  );

// ── ContactForm ───────────────────────────────────────────────────

export type ContactFormProps = {
  /** Formspree 表单 ID，默认用占位符演示 */
  formspreeId?: string;
};

export function ContactForm({ formspreeId = "demo" }: ContactFormProps) {
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onTouched" });

  const onSubmit = async (data: FormValues) => {
    setStatus("submitting");
    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  // ── 成功态 ──
  if (status === "success") {
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-8 py-12 text-center"
      >
        <CheckCircle2 size={40} className="text-emerald-400" aria-hidden="true" />
        <div>
          <p className="font-heading text-lg font-semibold text-zinc-100">
            消息已发送！
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            感谢你的留言，我会在 1–2 个工作日内回复。
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          再发一条消息
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">

      {/* 姓名 */}
      <FieldWrap icon={<User size={15} />} error={errors.name?.message}>
        <input
          {...register("name", {
            required: "请输入你的姓名",
            minLength: { value: 2, message: "姓名至少 2 个字符" },
            maxLength: { value: 50, message: "姓名不超过 50 个字符" },
          })}
          type="text"
          placeholder="你的姓名"
          autoComplete="name"
          aria-label="姓名"
          aria-invalid={!!errors.name}
          className={inputClass(!!errors.name)}
        />
      </FieldWrap>

      {/* 邮件 */}
      <FieldWrap icon={<AtSign size={15} />} error={errors.email?.message}>
        <input
          {...register("email", {
            required: "请输入邮件地址",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "请输入有效的邮件地址",
            },
          })}
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          aria-label="邮件地址"
          aria-invalid={!!errors.email}
          className={inputClass(!!errors.email)}
        />
      </FieldWrap>

      {/* 留言 */}
      <FieldWrap icon={<MessageSquare size={15} />} error={errors.message?.message}>
        <div className="relative">
          <span
            className="pointer-events-none absolute left-3.5 top-3.5 text-zinc-500"
            aria-hidden="true"
          >
            <MessageSquare size={15} />
          </span>
          <textarea
            {...register("message", {
              required: "请填写留言内容",
              minLength: { value: 10, message: "留言至少 10 个字符" },
              maxLength: { value: 500, message: "留言不超过 500 个字符" },
            })}
            rows={5}
            placeholder="你好，我想聊聊一个关于..."
            aria-label="留言内容"
            aria-invalid={!!errors.message}
            className={cn(
              inputClass(!!errors.message),
              "resize-none pl-10 pt-3 leading-relaxed"
            )}
          />
        </div>
      </FieldWrap>

      {/* 错误提示 */}
      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={reduced ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400"
            role="alert"
          >
            <AlertCircle size={15} />
            发送失败，请稍后重试或直接发邮件联系。
          </motion.p>
        )}
      </AnimatePresence>

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className={cn(
          "inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3",
          "bg-blue-600 text-sm font-semibold text-white",
          "transition-all duration-200",
          "hover:bg-blue-500 hover:-translate-y-px hover:shadow-lg hover:shadow-blue-600/30",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900",
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
        )}
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            发送中...
          </>
        ) : (
          <>
            <Send size={15} aria-hidden="true" />
            发送消息
          </>
        )}
      </button>

      <p className="text-center text-xs text-zinc-600">
        你的信息将通过 Formspree 安全传送，不会被第三方共享。
      </p>
    </form>
  );
}

export default ContactForm;
