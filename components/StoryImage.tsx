import React from 'react';

const ImageLoader: React.FC = () => (
  <div className="w-full aspect-[3/4] bg-card-bg/50 rounded-lg flex items-center justify-center animate-pulse border border-berry/30">
    <div className="text-mid-blue text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-berry" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      <p className="font-serif italic mt-2">The artist is painting...</p>
    </div>
  </div>
);


interface StoryImageProps {
  src: string | null;
  alt: string;
  isLoading: boolean;
}

const StoryImage: React.FC<StoryImageProps> = ({ src, alt, isLoading }) => {
  if (isLoading) {
    return <ImageLoader />;
  }

  if (!src) {
    return null;
  }

  return (
    <div className="mb-8 rounded-lg overflow-hidden shadow-2xl border border-berry/50">
      <img src={src} alt={alt} className="w-full h-auto object-cover" />
    </div>
  );
};

export default StoryImage;