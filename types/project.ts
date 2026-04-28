export type Project = {
  slug: string;
  title: string;
  summary: string;
  coverImage: string;
  tags: string[];
  year: number;
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  url: string;
};
