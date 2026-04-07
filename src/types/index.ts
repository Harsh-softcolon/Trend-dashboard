export type SourceType = "reddit" | "hn" | "dailydev" | "devto" | "hashnode" | "rss";

export type NormalizedArticle = {
  id: string;
  source: SourceType;
  title: string;
  url: string;
  slug?: string;
  
  authorName?: string;
  authorUrl?: string;
  sourceName?: string; // Subreddit or specific site

  description?: string;
  coverImage?: string;

  tags?: string[];
  
  publishedAt: Date;
  
  score: number;       // Normalized or initial score
  rawScore: number;    // Points/Upvotes from source
  
  commentsCount: number;
  likesCount: number;
};
