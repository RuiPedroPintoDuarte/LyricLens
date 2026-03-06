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

## How to Use
No installation or local server required! You can use LyricLens instantly in your browser.

👉 **[Try LyricLens Live Here](https://ruipedropintoduarte.github.io/LyricLens/)**
