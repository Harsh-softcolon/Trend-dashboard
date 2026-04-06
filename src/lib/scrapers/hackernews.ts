import axios from "axios";
import { NormalizedArticle } from "@/types";

export async function fetchHNPosts(): Promise<NormalizedArticle[]> {
  try {
    const topIdsRes = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
    const topIds = topIdsRes.data.slice(0, 30); // Top 30 posts

    const postPromises = topIds.map((id: number) =>
      axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    );

    const responses = await Promise.allSettled(postPromises);
    const allPosts: NormalizedArticle[] = [];

    for (const res of responses) {
      if (res.status === "fulfilled") {
        const post = res.value.data;
        if (post && !post.deleted && post.type === "story") {
          allPosts.push({
            id: `hn-${post.id}`,
            source: "hn",
            title: post.title,
            url: post.url || `https://news.ycombinator.com/item?id=${post.id}`,
            score: (post.score || 0) * 1.2, // HN points are higher quality
            rawScore: post.score || 0,
            commentsCount: post.descendants || 0,
            likesCount: post.score || 0,
            authorName: post.by,
            sourceName: "Hacker News",
            publishedAt: new Date(post.time * 1000),
          });
        }
      }
    }

    return allPosts;
  } catch (e) {
    console.error("Failed to fetch Hacker News", e);
    return [];
  }
}
