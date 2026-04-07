import Parser from "rss-parser";
import { NormalizedArticle } from "@/types";

const RSS_FEEDS = [
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
  { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
  { name: "Coding Horror", url: "https://blog.codinghorror.com/rss/" },
  { name: "Giant Robots", url: "https://feeds.feedburner.com/GiantRobots" },
  { name: "Netflix Tech", url: "https://netflixtechblog.com/feed" },
  { name: "Meta Engineering", url: "https://engineering.fb.com/feed/" }
];

const parser = new Parser();

export async function fetchRSSFeeds(): Promise<NormalizedArticle[]> {
  const allArticles: NormalizedArticle[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const feedData = await parser.parseURL(feed.url);
      
      const normalized: NormalizedArticle[] = (feedData.items || []).map((item) => {
        return {
          id: `rss-${item.guid || item.link}`,
          source: "rss",
          sourceName: feed.name,
          title: item.title || "Untitled",
          url: item.link || "",
          description: item.contentSnippet || item.content || "",
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          score: 80, // Default score for RSS
          rawScore: 80, // Allow trending calculation to baseline them
          commentsCount: 0,
          likesCount: 0,
          authorName: item.creator || item.author || feed.name,
          tags: item.categories || [],
          coverImage: extractImage(item.content || "")
        };
      });

      allArticles.push(...normalized);
    } catch (e) {
      console.error(`Failed to fetch RSS feed: ${feed.name}`, e);
    }
  }

  return allArticles;
}

function extractImage(content: string): string | undefined {
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = content.match(imgRegex);
  return match ? match[1] : undefined;
}
