# JIDict - Japanese Indonesian Dictionary

A high-performance, 3D-animated Japanese-Indonesian dictionary application powered by Supabase, React, and Tailwind CSS.

## Features

- **Smart Search**: Supports Kanji, Hiragana, Katakana, and Romaji (including Kunrei-shiki).
- **3D UI**: Neo-Tokyo aesthetic with 3D interactions.
- **Audio Support**: Native Text-to-Speech for Japanese words.
- **Context Links**: External references to Massif.la for example sentences.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/jidict.git
    cd jidict
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser at `http://localhost:5173`.

## Deployment

This project is ready to be deployed on Vercel or GitHub Pages.

### Vercel (Recommended)

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Vercel will automatically detect Vite and set the build settings (`npm run build`, output directory `dist`).

### Building Manually

To create a production build:

```bash
npm run build
```

The output files will be in the `dist` folder.
