import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateStory(postTitles: string[]): Promise<{ title: string; story: string; imagePrompt: string }> {
  const titlesString = postTitles.map((title, index) => `${index + 1}. "${title}"`).join('\n');

  const systemInstruction = `You are a critically-acclaimed author known for your witty, surreal, and poignant short stories, often published in prestigious literary journals like McSweeney's or The Paris Review. Your task is to write a short story that masterfully and cohesively intertwines the following ten disparate topics. Weave their core ideas into a singular, compelling narrative with a distinct voice and style. The story should be both absurd and profound, finding unexpected connections. It must have a creative, literary title. You will also create a concise, visually descriptive prompt suitable for an AI image generator to create cover art.`;

  const prompt = `
    Here are the ten topics to integrate:
    ${titlesString}

    Now, based on these topics, provide a creative title, the full story text, and a safe-for-work image generation prompt.
  `;
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "A creative and literary title for the story."
      },
      story: {
        type: Type.STRING,
        description: "The full text of the generated short story, with paragraphs separated by newline characters."
      },
      imagePrompt: {
        type: Type.STRING,
        description: "A short, descriptive, and visually-rich prompt (max 75 words) for an AI image generator to create cover art. This prompt must be safe for work and focus on concrete visual elements. CRUCIALLY, it must avoid describing elements that typically contain text, such as books, signs, screens, or packaging. The goal is a purely visual, text-free image."
      }
    },
    required: ["title", "story", "imagePrompt"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.8,
        // Disable thinking to prioritize speed and reliability for this complex creative task.
        thinkingConfig: { thinkingBudget: 0 },
      },
    });
    
    const text = response.text.trim();
    
    if (!text.startsWith('{') || !text.endsWith('}')) {
        console.error("AI response is not a JSON object string:", text);
        throw new Error("AI returned a non-JSON response.");
    }

    const result = JSON.parse(text);

    if (result && typeof result.title === 'string' && typeof result.story === 'string' && typeof result.imagePrompt === 'string') {
        return result;
    } else {
        throw new Error("AI response was not in the expected format.");
    }
  } catch (error) {
    console.error("Error calling Gemini API for story generation:", error);
    if (error instanceof SyntaxError) { // JSON.parse failed
        throw new Error("The AI returned a malformed story structure. Please try again.");
    }
    throw new Error("The AI failed to generate a story. It might be feeling uninspired. Please try again.");
  }
}

export async function generateStoryImage(imagePrompt: string): Promise<string> {
    // Add stylistic modifiers and strong negative instructions to prevent text generation.
    const finalPrompt = `${imagePrompt}. A clean, wordless, text-free image. Illustrative cover art, surreal digital painting, cinematic lighting, thought-provoking, enigmatic, detailed composition, fantasy meets realism. Absolutely no text, no letters, no typography, no signatures, no watermarks.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: finalPrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '3:4', // Good for a book cover
            },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error("The AI did not generate an image. This could be due to safety filters or a temporary issue.");
        }

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error("Error calling Imagen API:", error);
        throw new Error("The AI failed to generate an image. It might be having an artistic block.");
    }
}