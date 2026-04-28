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
} as const;
