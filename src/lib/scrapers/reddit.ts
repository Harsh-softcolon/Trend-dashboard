import axios from "axios";
import { NormalizedArticle } from "@/types";

const SUBREDDITS = ["programming", "webdev", "javascript", "reactjs", "nextjs", "node"];

export async function fetchRedditPosts(): Promise<NormalizedArticle[]> {
  const allPosts: NormalizedArticle[] = [];

  for (const subreddit of SUBREDDITS) {
    try {
      const response = await axios.get(`https://www.reddit.com/r/${subreddit}.json`, {
        headers: {
          "User-Agent": "devtrends:v0.1.0 (by /u/softcolon-harsh)",
        },
      });
      const children = response.data.data.children;

      const normalized: NormalizedArticle[] = children.map((item: any) => {
        const post = item.data;
        return {
          id: `reddit-${post.id}`,
          source: "reddit",
          title: post.title,
          url: post.url.startsWith("http") ? post.url : `https://reddit.com${post.permalink}`,
          score: post.ups,
          rawScore: post.ups,
          commentsCount: post.num_comments,
          likesCount: post.ups,
          authorName: post.author,
          sourceName: `r/${post.subreddit}`,
          publishedAt: new Date(post.created_utc * 1000),
          tags: [post.subreddit],
        };
      });

      allPosts.push(...normalized);
    } catch (e) {
      console.error(`Failed to fetch reddit r/${subreddit}`, e);
    }
  }

  return allPosts;
}
