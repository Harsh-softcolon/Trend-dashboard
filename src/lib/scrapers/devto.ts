import axios from "axios";
import { NormalizedArticle } from "@/types";

export async function fetchDevToArticles(): Promise<NormalizedArticle[]> {
  try {
    const res = await axios.get("https://dev.to/api/articles?top=1", {
      headers: {
        "User-Agent": "Mozilla/5.0 (TrendAggregator/1.0)",
      },
      timeout: 10000,
    });

    const articles = res.data;
    if (!Array.isArray(articles)) return [];

    return articles.map((a: any) => ({
      id: `devto-${a.id}`,
      source: "devto",
      title: a.title,
      url: a.url,
      slug: a.slug,
      authorName: a.user?.name,
      authorUrl: `https://dev.to/${a.user?.username}`,
      sourceName: "DEV.to",
      description: a.description,
      coverImage: a.cover_image || a.social_image,
      tags: a.tag_list,
      publishedAt: new Date(a.published_at),
      score: a.positive_reactions_count * 1.2 + a.comments_count * 2, // Simple initial ranking
      rawScore: a.positive_reactions_count || 0,
      commentsCount: a.comments_count || 0,
      likesCount: a.public_reactions_count || 0,
    }));
  } catch (e) {
    console.error("Failed to fetch devto, returning empty array.", e instanceof Error ? e.message : e);
    return [];
  }
}
