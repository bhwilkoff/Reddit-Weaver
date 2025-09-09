import React from 'react';
import StoryImage from './StoryImage';

interface StoryDisplayProps {
  title: string;
  story: string;
  image: string | null;
  isImageLoading: boolean;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ title, story, image, isImageLoading }) => {
  return (
    <article className="bg-card-bg rounded-lg p-6 sm:p-8 shadow-2xl border border-berry/50">
      <StoryImage src={image} alt={`Artwork for ${title}`} isLoading={isImageLoading} />
      <h2 className="text-3xl font-bold font-serif text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-light-blue to-mid-blue">
        {title}
      </h2>
      <div className="prose prose-invert prose-lg max-w-none font-serif text-light-blue/90 leading-relaxed whitespace-pre-wrap">
        {story.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
};

export default StoryDisplay;