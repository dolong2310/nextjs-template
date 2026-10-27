import { envConfig } from "./env.config";

export const siteConfig = {
  name: "TaskFlow",
  title: "TaskFlow - Modern Task Management",
  description:
    "TaskFlow helps teams manage tasks, boards, workflows, and collaboration in one place",
  url: envConfig.appUrl,
  ogImage: "/og/default.png",
  creator: "Long Do",
  locale: "vi_VN",
  links: {
    github: "https://github.com/your-username/taskflow",
    x: "https://x.com/your_username",
  },
} as const;
