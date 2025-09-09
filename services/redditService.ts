
import { RedditPost } from '../types';

// Simple shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export async function fetchRedditPosts(type: 'hot' | 'random'): Promise<RedditPost[]> {
  // Fetch more for randomness, but Reddit API limit is typically 100 for this endpoint
  const limit = type === 'random' ? 100 : 10;
  // Using r/all to get a wide variety of posts
  const url = `https://www.reddit.com/r/all/hot.json?limit=${limit}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Reddit API responded with status: ${response.status}`);
    }
    const data = await response.json();

    if (!data?.data?.children) {
      throw new Error("Invalid data structure from Reddit API.");
    }

    const posts: RedditPost[] = data.data.children.map((child: any) => ({
      title: child.data.title,
      url: `https://www.reddit.com${child.data.permalink}`,
      subreddit: `r/${child.data.subreddit}`,
    }));

    if (type === 'random') {
      return shuffleArray(posts).slice(0, 10);
    }
    
    return posts.slice(0, 10);

  } catch (error) {
    console.error("Error fetching from Reddit:", error);
    throw new Error("Failed to fetch stories from Reddit. Please try again later.");
  }
}
