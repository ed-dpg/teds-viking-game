# Viking Image Guessing Game — Design

**Status:** Approved for planning
**Date:** 2026-05-17

## Overview

A browser-based image guessing game. Each round shows a zoomed-in image of a viking-era object (weapon, ship, armor, etc.). The player picks from a list of names. A wrong guess zooms the image out a bit and offers another guess, up to 3 attempts. Scoring rewards getting it right while the image is most cropped. All state lives client-side. No persistence in this iteration.

## Goals

- Single-page interactive game playable in the browser
- Deploy as a static site on GitHub Pages
- Easy content authoring: drop images in a folder, edit a JSON manifest, ship
- Configurable difficulty (round count, answer count)

## Non-Goals

- Score persistence, leaderboards, accounts
- Server-side logic
- Multiplayer
- Mobile-native packaging
- Image asset pipeline beyond static serving

## Stack

- **Svelte 5** (runes) with **Vite** — no SvelteKit; single-screen app does not need a router
- **TypeScript** for type safety in the manifest and game logic
- **Vitest** for unit testing game logic
- Plain CSS with custom properties for theming
- Google Fonts: `Cinzel` (display), `Inter` (body)

## Architecture

```
viking-game/
├── index.html
├── package.json
├── vite.config.ts          # base: '/viking-game/' for GH Pages
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── main.ts             # mount App
│   ├── App.svelte          # state-machine root, swaps screens
│   ├── lib/
│   │   ├── manifest.ts     # fetch + type vikings.json
│   │   ├── game.ts         # pure: pickDistractors, scoreFor, buildRounds
│   │   ├── game.test.ts    # vitest unit tests for game.ts
│   │   └── types.ts        # shared TS types
│   ├── components/
│   │   ├── StartScreen.svelte
│   │   ├── GameScreen.svelte
│   │   ├── EndScreen.svelte
│   │   └── ZoomedImage.svelte
│   └── styles/
│       └── theme.css       # palette + font tokens, global resets
├── public/
│   ├── vikings.json
│   └── images/             # placeholder SVGs
└── .github/workflows/deploy.yml
```

Game state lives in a single rune-based `$state` object in `App.svelte`. All gameplay logic (distractor selection, scoring, round construction) is pure functions in `lib/game.ts`.

## Data Model

`public/vikings.json` is an array of entries:

```json
[
  { "id": "longship",  "name": "Longship",       "image": "longship.svg",  "category": "ship" },
  { "id": "ulfberht",  "name": "Ulfberht Sword", "image": "ulfberht.svg",  "category": "weapon" },
  { "id": "horn-helm", "name": "Horned Helmet",  "image": "horn-helm.svg", "category": "armor" }
]
```

Resolved image URL: `${BASE_URL}images/${entry.image}`.

### TypeScript types (`src/lib/types.ts`)

```ts
export type VikingThing = {
  id: string;
  name: string;
  image: string;
  category: string;
};

export type GameConfig = {
  roundCount: number;   // chosen on start screen: 5 | 10 | 15
  optionCount: number;  // chosen on start screen: 3 | 4 | 5 | 6
};

export type Attempt = 1 | 2 | 3;

export type Round = {
  answer: VikingThing;
  options: VikingThing[];          // length = optionCount, includes answer, pre-shuffled
  focal: { x: number; y: number }; // 25-75% range, fixed for the round
  attempt: Attempt;
  picked: string[];                // ids guessed wrong so far
  result: 'pending' | 'won' | 'lost';
  pointsEarned: number;
};

export type Game = {
  config: GameConfig;
  rounds: Round[];
  index: number;       // current round
  totalScore: number;
};
```

## Game Logic (`src/lib/game.ts`)

Pure functions, no DOM, no Svelte. Fully unit-tested.

- `pickDistractors(answer, pool, optionCount): VikingThing[]`
  - Pick `optionCount - 1` entries from `pool` excluding `answer`.
  - Prefer entries with the same `category` as `answer`.
  - If same-category pool is too small, fill remainder from other categories at random.
  - Never includes the answer itself; no duplicates.

- `scoreFor(attempt: Attempt): number`
  - `1 → 100`, `2 → 50`, `3 → 25`.

- `buildRounds(config, manifest): Round[]`
  - Sample `roundCount` answers from `manifest` **without replacement** (cap at `manifest.length` if smaller).
  - For each answer: pick distractors, shuffle options, randomize focal point (`x`, `y` ∈ [25, 75]), set `attempt: 1`, `picked: []`, `result: 'pending'`, `pointsEarned: 0`.

- `shuffle<T>(arr: T[]): T[]`
  - Fisher–Yates; returns a new array.

- `randomInRange(min, max): number`
  - Used for focal point coordinates.

Random sources are passed in as an optional parameter (`rng = Math.random`) so tests can pass a seeded RNG.

## Game Flow

### State machine

```
[start] -- begin --> [playing] -- last round ends --> [end] -- play again --> [start]
```

Inside `playing`, each round has two phases:

```
[round-active] -- correct OR 3rd wrong --> [round-result] -- Next --> next round | [end]
```

### Start screen

- Title, brief instruction line
- Two selectors:
  - Round count: 5 / 10 / 15 (default 10)
  - Answer choices: 3 / 4 / 5 / 6 (default 4)
- "Begin" button
- If manifest length < chosen round count, show a note: "Only N items available — that's how many rounds you'll play."

### Game screen

Layout (mobile-first, scales up):

- **Top bar:** "Round 3 / 10" · score · attempt indicator (●●○ — filled = attempts used)
- **Center:** image card, ~16:9 aspect, parchment-bordered frame, displays `ZoomedImage` for current round
- **Below:** option buttons in a 2-column grid (1 column on narrow widths)
- **Bottom (when round resolves):** result banner ("Correct! +100" or "Out of guesses — it was a Longship") and a "Next" button

Interaction:

- Click a wrong option:
  - That button gets a "wrong" state (red, struck-through, disabled).
  - `attempt` increments; image animates to next zoom level.
- Click the right option:
  - Button gets a "correct" state (green pulse).
  - `result = 'won'`, `pointsEarned` set, all buttons disabled.
  - Result banner + Next button shown.
- After 3rd wrong:
  - `result = 'lost'`, `pointsEarned = 0`.
  - The correct option is revealed (highlighted green).
  - Result banner + Next button shown.

"Next" is always required to advance — no auto-advance.

### End screen

- Final score (e.g. "625 / 1000")
- Breakdown: "8 of 10 correct"
- "Play again" button — returns to Start, preserving the previous config selections.

## Zoom Mechanic (`ZoomedImage.svelte`)

Container has fixed aspect ratio, `overflow: hidden`. Inner `<img>` uses `transform: scale(N) translate(X%, Y%)`, transitioned over 400ms ease-out.

- **Zoom levels by attempt:** 1 → `scale(4)`, 2 → `scale(2)`, 3 → `scale(1)`.
- **Focal point:** randomized per round in 25–75% range for both axes (avoids extreme edges).
- **Translate formula** keeps focal point centered as zoom changes:
  - `translateX = (50 - focal.x)%`, `translateY = (50 - focal.y)%`
  - At `scale(1)`, this offset is visually irrelevant; at `scale(4)`, it positions the focal area in view.
- The image element receives `transform-origin: ${focal.x}% ${focal.y}%`.
- Image fills the container with `object-fit: cover`.

The full image is always loaded; only the CSS transform changes between attempts.

## Visual Style

### Palette (CSS custom properties on `:root`)

```
--bg-wood:       #2b1d12   /* page background */
--bg-parchment:  #e8dcb8   /* card/panel background */
--ink:           #1a120a   /* body text on parchment */
--gold:          #c8a44c   /* accents, score, primary button */
--iron:          #5a5450   /* secondary text, disabled buttons */
--blood:         #8b1f1f   /* wrong-answer state */
--moss:          #4a6741   /* correct-answer state */
```

### Type

- Headings: `Cinzel` (Google Fonts), 600 weight
- Body & buttons: `Inter`, 400/600

### Treatments

- Parchment panels: subtle noise/paper texture (CSS gradient or SVG noise)
- Image card frame: thin gold inset border + thicker dark wood outer border
- Buttons: parchment fill, ink text, gold border on hover/focus
- No heavy decorative patterns — image is the focal point

### Motion

- Zoom transition: 400ms ease-out
- Wrong-answer shake: 200ms horizontal nudge
- Correct-answer pulse: 300ms green glow
- Result banner: 200ms fade-in

## Error Handling & Edge Cases

- **Manifest fails to load** → full-screen error state with "Retry" button. Game cannot start without it.
- **Image fails to load** → `<img onerror>` swaps in a generic placeholder SVG; round remains playable (name and category are still available).
- **Category has fewer than `optionCount - 1` other entries** → `pickDistractors` fills the remainder from other categories at random.
- **Manifest length < `roundCount`** → `buildRounds` caps round count at manifest length; Start screen notes this.
- **User refreshes mid-game** → state is lost. No persistence by design.
- **Duplicate answers within a session** → prevented; `buildRounds` samples without replacement.

## Testing

Vitest for `src/lib/game.ts`:

- `pickDistractors`
  - Returns exactly `optionCount - 1` entries
  - Never includes the answer
  - All entries share `answer.category` when category pool is large enough
  - Falls back to other categories when same-category pool is too small
  - No duplicates in returned list
- `scoreFor`
  - 1 → 100, 2 → 50, 3 → 25
- `buildRounds`
  - Returns exactly `min(roundCount, manifest.length)` rounds
  - No duplicate answers across rounds
  - Every round's `options` includes its `answer`
  - Every round's `options.length === optionCount`
- `shuffle`
  - Returns array of same length; same elements; does not mutate input

No component tests in this iteration. UI verification is manual in the browser.

## Deployment

GitHub Pages via `actions/deploy-pages`. Workflow on push to `main`:

1. Checkout
2. Setup Node
3. `npm ci`
4. `npm run test` (gate on green)
5. `npm run build` → `dist/`
6. Upload `dist/` as Pages artifact
7. Deploy

`vite.config.ts`:

```ts
export default defineConfig({
  plugins: [svelte()],
  base: '/viking-game/',
});
```

Manifest fetched via `${import.meta.env.BASE_URL}vikings.json` so it works in dev (`/`) and production (`/viking-game/`).

## Placeholders

`public/vikings.json` ships with 8 placeholder entries spanning 3 categories (ship, weapon, armor). Each `image` field references a labeled colored SVG in `public/images/` — distinct backgrounds and labels so the zoom mechanic is visible against varied content. Real images replace these by overwriting files; only edit the JSON when names/categories change.

## Out of Scope / Future Work

- Score persistence (localStorage or backend)
- Leaderboard
- Image preloading / lazy loading optimization (likely not needed at this scale)
- Internationalization
- Difficulty modes beyond round/option count (e.g. timer, fewer attempts)
- Touch gestures (pinch to zoom is unnecessary — zoom is game-driven)
