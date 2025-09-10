# Reddit Weaver

**Where Reddit headlines become AI-generated literature.**

Reddit Weaver is a web application that takes 10 post titles from Reddit and uses the Google Gemini API to "weave" them into a single, cohesive, and often surreal short story in a literary style. It then generates unique cover art for the story and allows you to download the result as a beautifully formatted PDF.

---

## Features

-   **Dual Story Sources**: Generate stories from the top 10 posts on `r/all/hot` or from 10 random posts on `r/all/rising` for more variety and unpredictability.
-   **AI-Powered Storytelling**: Utilizes the `gemini-2.5-flash` model to analyze disparate headlines and creatively merge them into a compelling narrative.
-   **AI Cover Art**: Generates a unique, text-free piece of cover art for each story using the `imagen-4.0-generate-001` model.
-   **PDF Export**: Download the complete story, including the title, cover image, and a list of the source Reddit posts, as a high-quality PDF.
-   **Responsive Design**: A clean, modern, and fully responsive interface built with Tailwind CSS.

## Tech Stack

-   **Frontend**: React, TypeScript
-   **Styling**: Tailwind CSS
-   **AI Models**:
    -   **Text Generation**: Google Gemini 2.5 Flash (`gemini-2.5-flash`)
    -   **Image Generation**: Google Imagen 4 (`imagen-4.0-generate-001`)
-   **API Client**: `@google/genai`
-   **PDF Generation**: `jspdf`

---

## Getting Started

You can run this project locally or deploy it to your own hosting provider. The key is to provide your own Google Gemini API key.

### Prerequisites

1.  **Node.js and npm**: Make sure you have Node.js installed, which includes npm. You can download it from [nodejs.org](https://nodejs.org/).
2.  **Google Gemini API Key**: You need an API key from Google AI Studio. You can get one for free [here](https://aistudio.google.com/app/apikey).

### How to Use Your Own API Key

The application is configured to use an environment variable named `API_KEY` to authenticate with the Gemini API. This is the standard and secure way to handle API keys.

**You should never hardcode your API key directly into the source code.**

#### For Local Development

When running the project on your own machine, you'll need a way to provide this environment variable to the application. The easiest way is to use a tool like [Vite](https://vitejs.dev/), a modern frontend build tool.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/reddit-weaver.git
    cd reddit-weaver
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *(You may need to install Vite first: `npm install -g vite`)*

3.  **Create an environment file:**
    Create a new file in the root of the project directory named `.env.local`.

4.  **Add your API key to the file:**
    Open `.env.local` and add the following line, replacing `YOUR_GEMINI_API_KEY_HERE` with your actual key:
    ```
    VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```
    *(Vite requires environment variables to be prefixed with `VITE_`)*

5.  **Update the code to use the Vite variable:**
    In `services/geminiService.ts`, you would change how the API key is accessed to make it compatible with Vite's system.
    
    *Find this line:*
    ```typescript
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    ```
    *And change it to:*
    ```typescript
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
    ```

6.  **Run the development server:**
    ```bash
    vite
    ```
    Vite will start a local server and you can view the application in your browser.

#### For Deployment

When deploying this project to a hosting provider like Vercel, Netlify, or Google Cloud, the process is simpler. These platforms have a settings panel where you can securely store environment variables.

1.  Push your code to a GitHub repository.
2.  Connect your repository to your hosting provider.
3.  In the project settings on your provider's dashboard, find the "Environment Variables" section.
4.  Add a new variable with the following details:
    -   **Name / Key**: `API_KEY`
    -   **Value**: `YOUR_GEMINI_API_KEY_HERE` (paste your actual key here)
5.  Deploy your project. The hosting provider will automatically make this variable available to the application as `process.env.API_KEY`, and the original code will work without any changes.
