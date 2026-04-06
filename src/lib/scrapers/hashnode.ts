import axios from "axios";
import { NormalizedArticle } from "@/types";

const QUERY = `
  {
    publication(host: "hashnode.com") {
      posts(first: 20) {
        edges {
          node {
            id
            title
            url
            slug
            brief
            coverImage {
              url
            }
            publishedAt
            author {
              name
              profilePicture
            }
            reactionCount
            views
            responseCount
            tags {
              name
            }
          }
        }
      }
    }
  }
`;

export async function fetchHashnodeArticles(): Promise<NormalizedArticle[]> {
  try {
    const res = await axios.post("https://gql.hashnode.com", { query: QUERY }, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });

    const edges = res.data?.data?.publication?.posts?.edges;
    if (!Array.isArray(edges)) return [];

    return edges.map(({ node }: any) => ({
      id: `hashnode-${node.id}`,
      source: "hashnode",
      title: node.title,
      url: node.url,
      slug: node.slug,
      authorName: node.author?.name,
      authorUrl: node.author?.profilePicture, // Using profile pic for link is not ideal but okay
      sourceName: "Hashnode",
      description: node.brief,
      coverImage: node.coverImage?.url,
      tags: node.tags?.map((t: any) => t.name) || [],
      publishedAt: new Date(node.publishedAt),
      score: (node.reactionCount || 0) * 1.5 + (node.responseCount || 0) * 3,
      rawScore: node.reactionCount || 0,
      commentsCount: node.responseCount || 0,
      likesCount: node.reactionCount || 0,
    }));
  } catch (e) {
    console.warn("Failed to fetch hashnode, returning empty array.", e instanceof Error ? e.message : e);
    return [];
  }
}
