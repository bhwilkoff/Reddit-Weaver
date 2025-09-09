import React, { useState, useCallback } from 'react';
import { fetchRedditPosts } from './services/redditService';
import { generateStory, generateStoryImage } from './services/geminiService';
import { generatePdf } from './services/pdfService';
import { RedditPost } from './types';
import Header from './components/Header';
import Button from './components/Button';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import StoryDisplay from './components/StoryDisplay';
import SourcePosts from './components/SourcePosts';

type FetchType = 'hot' | 'random';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [story, setStory] = useState<string | null>(null);
  const [storyTitle, setStoryTitle] = useState<string | null>(null);
  const [storyImage, setStoryImage] = useState<string | null>(null);
  const [sourcePosts, setSourcePosts] = useState<RedditPost[]>([]);

  const handleFetchAndGenerate = useCallback(async (type: FetchType) => {
    setIsLoading(true);
    setError(null);
    setStory(null);
    setStoryTitle(null);
    setSourcePosts([]);
    setStoryImage(null);
    setIsImageLoading(false);
    setImageError(null);

    try {
      const posts = await fetchRedditPosts(type);
      setSourcePosts(posts);

      if (posts.length === 0) {
        throw new Error("Could not fetch any posts from Reddit.");
      }
      
      const postTitles = posts.map(p => p.title);
      const generatedContent = await generateStory(postTitles);

      setStoryTitle(generatedContent.title);
      setStory(generatedContent.story);
      setIsLoading(false); // Story is done, turn off main loader

      // --- Image Generation ---
      if (generatedContent.imagePrompt) {
        try {
          setIsImageLoading(true);
          const imageUrl = await generateStoryImage(generatedContent.imagePrompt);
          setStoryImage(imageUrl);
        } catch (imgErr) {
          console.error("Image generation failed:", imgErr);
          setImageError(imgErr instanceof Error ? imgErr.message : "Failed to generate image.");
        } finally {
          setIsImageLoading(false);
        }
      } else {
        // Fallback in case image prompt is missing, though the schema requires it.
        setImageError("Could not generate an image prompt for the story.");
      }

    } catch (err) {
      // This catches errors from Reddit fetch or story generation
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setIsLoading(false); // Ensure loader is off on error
    }
  }, []);

  const handleDownloadPdf = useCallback(async () => {
    if (!storyTitle || !story || !storyImage || sourcePosts.length === 0) {
      setError("Cannot download PDF, story components are missing.");
      return;
    }

    setIsDownloading(true);
    try {
      await generatePdf(storyTitle, story, storyImage, sourcePosts);
    } catch(err) {
      console.error("PDF generation failed:", err);
      setError(err instanceof Error ? err.message : "Failed to generate PDF.");
    } finally {
      setIsDownloading(false);
    }
  }, [storyTitle, story, storyImage, sourcePosts]);

  const anyActionInProgress = isLoading || isImageLoading || isDownloading;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />

        <div className="bg-card-bg/50 rounded-lg p-6 my-8 shadow-lg backdrop-blur-sm border border-berry/50">
          <p className="text-mid-blue mb-4 text-center">
            Generate a literary masterpiece from the chaos of the internet. Choose a source for your inspiration.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => handleFetchAndGenerate('hot')} disabled={anyActionInProgress}>
              Weave from Top 10 Stories
            </Button>
            <Button onClick={() => handleFetchAndGenerate('random')} disabled={anyActionInProgress}>
              Weave from 10 Random Stories
            </Button>
          </div>
        </div>

        <main className="mt-8">
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          
          {story && storyTitle && (
            <div className="space-y-12">
              <StoryDisplay 
                title={storyTitle} 
                story={story} 
                image={storyImage} 
                isImageLoading={isImageLoading} 
              />
              {imageError && <ErrorMessage message={imageError} />}
              
              {storyImage && !isImageLoading && (
                 <div className="text-center">
                    <Button onClick={handleDownloadPdf} disabled={anyActionInProgress}>
                      {isDownloading ? 'Downloading...' : 'Download Story as PDF'}
                    </Button>
                 </div>
              )}

              <SourcePosts posts={sourcePosts} />
            </div>
          )}

          {!isLoading && !story && !error && (
             <div className="text-center text-mid-blue/80 py-16">
                <p>Your story awaits its beginning...</p>
             </div>
          )}
        </main>

        <footer className="text-center mt-12 text-mid-blue/60 text-sm">
            <p>Powered by Reddit and the Gemini API.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;