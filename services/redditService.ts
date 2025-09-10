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
  const limit = type === 'random' ? 100 : 10;
  
  // Use 'rising' for the random option to get more variety and "dig deeper" than the 'hot' page.
  const listing = type === 'random' ? 'rising' : 'hot';
  const url = `https://www.reddit.com/r/all/${listing}.json?limit=${limit}`;

  try {
    // Add { cache: 'no-store' } to prevent the browser from returning the same results on subsequent clicks.
    const response = await fetch(url, { cache: 'no-store' });
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
