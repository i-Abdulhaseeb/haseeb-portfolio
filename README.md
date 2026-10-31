# Haseeb: Portfolio

Phone-themed intro animation, then a cursor-tracking 3D robot on the landing page.
React + TypeScript + Vite, three.js (react-three-fiber), GSAP, Lenis.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview
```

The intro plays once per browser session. Add `?intro` to the URL to replay it, press **Esc** or click **Skip** to skip it.

## Edit your content

- `src/data/content.ts`: email, social links, projects and the About text.
  **Set `EMAIL` and the `SOCIALS` URLs before deploying** (they are placeholders).
- `src/bot/botLines.ts`: everything the bot says.
- `src/styles/tokens.css`: the black, green and white palette.
- `src/intro/Intro.tsx`: the intro timeline and punchline text.

## How the bot works

- `src/bot/Bot.tsx`: the robot is built from three.js shapes in code (no model file). Each frame it reads the cursor, turns its head and slides its eyes toward it, and blinks, breathes and drifts when idle.
- `src/bot/useCursorTarget.ts`: tracks the pointer across the whole window.
- Click it for a squash reaction and a line; hold and drag to pick it up and throw it.
- Hover a project card and it looks at the card and comments on it.
- After you scroll past the hero it shrinks into a corner companion and comments on each section.
- If WebGL fails it falls back to a static SVG bot (`src/bot/BotBoundary.tsx`).
- Reduced-motion visitors skip the intro and smooth scroll, and the bot stops bobbing.

## Deploy

Push to GitHub and import the repo on Vercel or Netlify (build command `npm run build`, output `dist`).
