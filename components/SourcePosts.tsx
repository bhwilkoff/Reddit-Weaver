import React from 'react';
import { RedditPost } from '../types';

interface SourcePostsProps {
  posts: RedditPost[];
}

const SourcePosts: React.FC<SourcePostsProps> = ({ posts }) => {
  if (posts.length === 0) return null;

  return (
    <div className="bg-card-bg/70 rounded-lg p-6 shadow-lg border border-berry/50">
      <h3 className="text-xl font-bold mb-4 text-light-blue">Source Material</h3>
      <ul className="space-y-3">
        {posts.map((post, index) => (
          <li key={index} className="text-sm">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-light-blue hover:text-mid-blue hover:underline transition-colors duration-200"
            >
              <span className="font-semibold text-mid-blue/80 mr-2">{index + 1}.</span> {post.title}
            </a>
            <span className="text-mid-blue/80 ml-2 text-xs">({post.subreddit})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SourcePosts;