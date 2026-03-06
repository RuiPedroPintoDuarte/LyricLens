# LyricLens

An interactive web application that leverages open-source LLMs to analyze your text's emotional sentiment and curates dynamic, personalized 10-track playlists on the fly. 

Built with vanilla web zero-dependency architecture.

## Features
- **AI Sentiment Analysis**: Type any journal entry, idea, or feeling. The app sends exactly what you wrote to `text.pollinations.ai` to determine the mood.
- **Dynamic 10-Track Playlists**: Generates ten well-known songs specifically curated to fit your vibe.
- **Visual Audio Player**: A custom frosted glassmorphic web player.
- **Real Album Art & Previews**: Automatically queries the Apple Music/iTunes API to dynamically fetch official 100x100 `artworkUrl100` covers and stream high-quality 30-second audio previews.

## Architecture & Tech Stack
- Frontend entirely built using **Vanilla HTML/CSS/JS**.
- **No Build Steps**: No Node.js, Webpack, or NPM dependencies required to run the frontend logic.
- **Glassmorphism UI**: Uses extensive backdrop-blur CSS filters to create a dynamic, ambient UI.

## How to Run Locally
Because this project utilizes the Fetch API to ping external asynchronous endpoints, running the `index.html` file directly from your file system (via `file://`) will throw a CORS/security error in modern browsers. 

You must serve the directory using a local web server:

**Using Python:**
```bash
python3 -m http.server 8000
```

**Using Node (npx):**
```bash
npx serve .
```

Then, open `http://localhost:8000` (or the provided port) in your browser.

## Deployment (GitHub Pages)
Since this app requires no database or backend server architecture, you can host it for free via GitHub Pages.
1. Fork or clone this repository.
2. Go to your repository settings on GitHub.
3. Click "Pages" on the sidebar.
4. Set the Source dropdown to deploy from your `main` or `master` branch.
5. Save. Your site will be published live in just a few minutes!
