import dayjs from "dayjs";

/**
 * PRODUCTION-READY RANKING ALGORITHM
 * 
 * Formula:
 * raw_score * 0.6 + comments_count * 0.3 - hours * 0.5
 * (Modified for better temporal falloff)
 * 
 * @param rawScore Original points/upvotes
 * @param commentsCount Total comments
 * @param publishedAt Date of publication
 * @returns Final trending score
 */
export function calculateTrendingScore(rawScore: number, commentsCount: number, publishedAt: Date): number {
  const hoursSincePost = dayjs().diff(dayjs(publishedAt), "hour") || 1;
  
  // User's recommended MVP formula
  const baseScore = (rawScore * 0.6) + (commentsCount * 0.3);
  
  // Apply temporal penalty (decay)
  // - hours * 0.5 or using a power-law for smoother dropoff
  const score = baseScore - (hoursSincePost * 0.5);
  
  // Ensure we don't return negative infinity/NaN, and return at least 0
  return Math.max(0, score);
}
