import axios from "axios";
import { NormalizedArticle } from "@/types";

export async function fetchDailyPosts(): Promise<NormalizedArticle[]> {
  try {
    // Note: this is a mock or reverse-engineered call as daily.dev doesn't have an official public API
    // We'll try to use their GraphQL endpoint anyway for basic posts if possible.
    // If it fails, return empty.
    const response = await axios.post("https://api.daily.dev/graphql", {
      query: `
        query Posts {
          posts(limit: 30) {
            edges {
              node {
                id
                title
                url
                upvotesCount
                commentsCount
                createdAt
                tags
              }
            }
          }
        }
      `
    }, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      }
    });

    const posts = response.data?.data?.posts?.edges;
    if (!posts) return [];

    return posts.map((edge: any) => {
      const node = edge.node;
      return {
        id: `dailydev-${node.id}`,
        source: "dailydev",
        title: node.title,
        url: node.url,
        score: node.upvotesCount,
        rawScore: node.upvotesCount,
        commentsCount: node.commentsCount,
        likesCount: node.upvotesCount,
        publishedAt: new Date(node.createdAt),
        tags: node.tags || [],
        sourceName: "daily.dev",
      };
    });
  } catch (e) {
    console.warn("Failed to fetch daily.dev, returning empty array.");
    return [];
  }
}
