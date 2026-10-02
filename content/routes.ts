// Public pages listed in the sitemap. The guide's follow-up pages are deliberately excluded.
export const publicRoutes = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/what-it-is", priority: 0.9, changeFrequency: "monthly" },
  { path: "/examples", priority: 0.8, changeFrequency: "monthly" },
  { path: "/guide", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
] as const;
