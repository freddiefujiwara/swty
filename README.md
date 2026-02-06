# English Typing App

A simple and clean English typing practice application built with Vue 3.

## Features

- **Practice with Real Sentences**: Fetches 100 simple English sentences via a Google Apps Script API.
- **Immediate Feedback**: Highlights correct and incorrect characters as you type.
- **Progress Tracking**: Visual progress bar showing your advancement through the sentence set.
- **Clean UI**: Minimalist design focused on the typing experience.

## Tech Stack

- Vue 3 (Composition API)
- Vite
- Vitest (for unit testing)
- GitHub Actions (CI/CD)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Run Tests

```bash
npm run test:coverage
```

## Deployment

This project is configured for deployment to GitHub Pages.
The base path is set to `/swty/`.

When pushing to the `main` branch, a GitHub Action automatically:
1. Runs tests.
2. Builds the project.
3. Generates a custom OGP image.
4. Deploys the result to GitHub Pages.

## License

MIT
