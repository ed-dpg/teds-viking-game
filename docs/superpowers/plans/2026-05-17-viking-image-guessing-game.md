# Viking Image Guessing Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a client-side Svelte 5 + Vite browser game where the player guesses zoomed-in viking-era items from a list of options, with 3 attempts per round (each zooming out further), and a final score.

**Architecture:** Single-page interactive app, no router. State lives in a `$state` rune in `App.svelte` and is swapped between Start / Game / End screens. Pure game logic in `src/lib/game.ts` is unit-tested with Vitest. Static deploy to GitHub Pages via Actions.

**Tech Stack:** Svelte 5 (runes), Vite, TypeScript, Vitest, plain CSS with custom properties, GitHub Pages.

---

## File Layout (target end state)

**Created files:**
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.node.json`
- `svelte.config.js`
- `vitest.config.ts`
- `index.html`
- `.gitignore`
- `.github/workflows/deploy.yml`
- `public/vikings.json`
- `public/images/longship.svg` (and 7 more placeholder SVGs)
- `public/images/placeholder.svg` (fallback)
- `src/main.ts`
- `src/app.d.ts`
- `src/App.svelte`
- `src/lib/types.ts`
- `src/lib/game.ts`
- `src/lib/game.test.ts`
- `src/lib/manifest.ts`
- `src/components/StartScreen.svelte`
- `src/components/GameScreen.svelte`
- `src/components/EndScreen.svelte`
- `src/components/ZoomedImage.svelte`
- `src/styles/theme.css`

---

## Task 1: Scaffold project with Vite + Svelte 5 + TypeScript

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `svelte.config.js`
- Create: `vitest.config.ts`
- Create: `index.html`
- Create: `.gitignore`
- Create: `src/main.ts`
- Create: `src/app.d.ts`
- Create: `src/App.svelte` (minimal placeholder)

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "viking-game",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-check --tsconfig ./tsconfig.json",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^5.0.0",
    "@tsconfig/svelte": "^5.0.4",
    "svelte": "^5.0.0",
    "svelte-check": "^4.0.0",
    "tslib": "^2.7.0",
    "typescript": "^5.6.0",
    "vite": "^5.4.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create `vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  base: '/viking-game/',
});
```

- [ ] **Step 3: Create `svelte.config.js`**

```js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
};
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "isolatedModules": true,
    "types": ["svelte", "vite/client", "vitest/globals"]
  },
  "include": ["src/**/*.ts", "src/**/*.svelte", "src/**/*.d.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 5: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts", "vitest.config.ts"]
}
```

- [ ] **Step 6: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 7: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/viking-game/images/placeholder.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Viking Image Guessing Game</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 8: Create `.gitignore`**

```
node_modules
dist
.DS_Store
*.log
.vite
coverage
```

- [ ] **Step 9: Create `src/app.d.ts`**

```ts
/// <reference types="svelte" />
/// <reference types="vite/client" />
```

- [ ] **Step 10: Create `src/main.ts`**

```ts
import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, { target: document.getElementById('app')! });

export default app;
```

- [ ] **Step 11: Create minimal `src/App.svelte`**

```svelte
<script lang="ts">
  // placeholder until Task 7 wires real screens
</script>

<main>
  <h1>Viking Image Guessing Game</h1>
</main>
```

- [ ] **Step 12: Install dependencies and verify build**

Run: `npm install`
Then run: `npm run build`
Expected: build succeeds, `dist/` directory created with `index.html` and asset files.

- [ ] **Step 13: Verify dev server starts**

Run: `npm run dev` (then Ctrl-C after confirming startup message)
Expected: Vite prints "Local: http://localhost:5173/viking-game/" without errors.

- [ ] **Step 14: Commit**

```bash
git add package.json vite.config.ts svelte.config.js tsconfig.json tsconfig.node.json vitest.config.ts index.html .gitignore src/app.d.ts src/main.ts src/App.svelte
git commit -m "chore: scaffold vite + svelte 5 + ts project"
```

Note: package-lock.json should also be added if generated.

---

## Task 2: Define shared TypeScript types

**Files:**
- Create: `src/lib/types.ts`

- [ ] **Step 1: Create `src/lib/types.ts`**

```ts
export type VikingThing = {
  id: string;
  name: string;
  image: string;
  category: string;
};

export type GameConfig = {
  roundCount: number;
  optionCount: number;
};

export type Attempt = 1 | 2 | 3;

export type Round = {
  answer: VikingThing;
  options: VikingThing[];
  focal: { x: number; y: number };
  attempt: Attempt;
  picked: string[];
  result: 'pending' | 'won' | 'lost';
  pointsEarned: number;
};

export type Game = {
  config: GameConfig;
  rounds: Round[];
  index: number;
  totalScore: number;
};
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: define core game types"
```

---

## Task 3: Implement and test `shuffle` helper

**Files:**
- Create: `src/lib/game.ts`
- Create: `src/lib/game.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/game.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { shuffle } from './game';

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    const result = shuffle([1, 2, 3, 4, 5]);
    expect(result).toHaveLength(5);
  });

  it('contains the same elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle([...input]);
    expect(result.sort()).toEqual(input.sort());
  });

  it('does not mutate the input', () => {
    const input = [1, 2, 3, 4, 5];
    const snapshot = [...input];
    shuffle(input);
    expect(input).toEqual(snapshot);
  });

  it('produces a deterministic order when given a seeded rng', () => {
    // rng returns 0, then 0.5, then 0.9, then 0 — repeating
    const seq = [0, 0.5, 0.9, 0];
    let i = 0;
    const rng = () => seq[i++ % seq.length];
    const a = shuffle([1, 2, 3, 4], rng);
    i = 0;
    const b = shuffle([1, 2, 3, 4], rng);
    expect(a).toEqual(b);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/game.test.ts`
Expected: FAIL with "Cannot find module './game'" or similar.

- [ ] **Step 3: Create `src/lib/game.ts` with shuffle implementation**

```ts
export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/game.test.ts`
Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/game.ts src/lib/game.test.ts
git commit -m "feat: add shuffle helper with seedable rng"
```

---

## Task 4: Implement and test `scoreFor`

**Files:**
- Modify: `src/lib/game.ts`
- Modify: `src/lib/game.test.ts`

- [ ] **Step 1: Add failing test**

Append to `src/lib/game.test.ts`:

```ts
import { scoreFor } from './game';

describe('scoreFor', () => {
  it('returns 100 for attempt 1', () => {
    expect(scoreFor(1)).toBe(100);
  });
  it('returns 50 for attempt 2', () => {
    expect(scoreFor(2)).toBe(50);
  });
  it('returns 25 for attempt 3', () => {
    expect(scoreFor(3)).toBe(25);
  });
});
```

Also update the top import to include `scoreFor`:

```ts
import { shuffle, scoreFor } from './game';
```

(Remove the now-duplicate `import { scoreFor } from './game';` if both appear — keep one combined import at the top.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/game.test.ts`
Expected: FAIL with "scoreFor is not a function" or "not exported".

- [ ] **Step 3: Add `scoreFor` to `src/lib/game.ts`**

The full file should now look like this (note the import is at the top):

```ts
import type { Attempt } from './types';

export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function scoreFor(attempt: Attempt): number {
  return { 1: 100, 2: 50, 3: 25 }[attempt];
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/game.test.ts`
Expected: all tests pass (shuffle + scoreFor).

- [ ] **Step 5: Commit**

```bash
git add src/lib/game.ts src/lib/game.test.ts
git commit -m "feat: add scoreFor mapping"
```

---

## Task 5: Implement and test `pickDistractors`

**Files:**
- Modify: `src/lib/game.ts`
- Modify: `src/lib/game.test.ts`

- [ ] **Step 1: Write failing tests**

Append to `src/lib/game.test.ts` (and update top imports to add `pickDistractors`):

```ts
import { pickDistractors } from './game';
import type { VikingThing } from './types';

function make(id: string, category: string): VikingThing {
  return { id, name: id, image: `${id}.svg`, category };
}

describe('pickDistractors', () => {
  const pool: VikingThing[] = [
    make('longship', 'ship'),
    make('knarr', 'ship'),
    make('drakkar', 'ship'),
    make('faering', 'ship'),
    make('ulfberht', 'weapon'),
    make('axe', 'weapon'),
    make('spear', 'weapon'),
    make('helmet', 'armor'),
  ];
  const answer = pool[0]; // longship / ship

  it('returns exactly optionCount - 1 distractors', () => {
    const result = pickDistractors(answer, pool, 4);
    expect(result).toHaveLength(3);
  });

  it('never includes the answer', () => {
    const result = pickDistractors(answer, pool, 4);
    expect(result.some((d) => d.id === answer.id)).toBe(false);
  });

  it('prefers same-category entries when pool is large enough', () => {
    const result = pickDistractors(answer, pool, 4);
    expect(result.every((d) => d.category === 'ship')).toBe(true);
  });

  it('falls back to other categories when same-category pool is too small', () => {
    const smallAnswer = make('helmet', 'armor');
    const smallPool = [smallAnswer, ...pool.filter((p) => p.category !== 'armor')];
    const result = pickDistractors(smallAnswer, smallPool, 4);
    expect(result).toHaveLength(3);
    expect(result.some((d) => d.id === smallAnswer.id)).toBe(false);
  });

  it('returns no duplicates', () => {
    const result = pickDistractors(answer, pool, 4);
    const ids = result.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/game.test.ts`
Expected: FAIL ("pickDistractors is not a function" / not exported).

- [ ] **Step 3: Implement `pickDistractors` in `src/lib/game.ts`**

Update the top `import type` to add `VikingThing`:

```ts
import type { Attempt, VikingThing } from './types';
```

Then append the new function:

```ts
export function pickDistractors(
  answer: VikingThing,
  pool: VikingThing[],
  optionCount: number,
  rng: () => number = Math.random,
): VikingThing[] {
  const need = optionCount - 1;
  const others = pool.filter((p) => p.id !== answer.id);
  const sameCategory = others.filter((p) => p.category === answer.category);
  const otherCategory = others.filter((p) => p.category !== answer.category);

  const picked: VikingThing[] = [];
  const sameShuffled = shuffle(sameCategory, rng);
  for (const item of sameShuffled) {
    if (picked.length >= need) break;
    picked.push(item);
  }
  if (picked.length < need) {
    const otherShuffled = shuffle(otherCategory, rng);
    for (const item of otherShuffled) {
      if (picked.length >= need) break;
      picked.push(item);
    }
  }
  return picked;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/game.test.ts`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/game.ts src/lib/game.test.ts
git commit -m "feat: add pickDistractors with same-category preference"
```

---

## Task 6: Implement and test `buildRounds`

**Files:**
- Modify: `src/lib/game.ts`
- Modify: `src/lib/game.test.ts`

- [ ] **Step 1: Write failing tests**

Append to `src/lib/game.test.ts` (and update top imports to include `buildRounds`):

```ts
import { buildRounds } from './game';

describe('buildRounds', () => {
  const pool: VikingThing[] = [
    make('longship', 'ship'),
    make('knarr', 'ship'),
    make('drakkar', 'ship'),
    make('ulfberht', 'weapon'),
    make('axe', 'weapon'),
    make('spear', 'weapon'),
    make('helmet', 'armor'),
    make('chainmail', 'armor'),
  ];

  it('returns exactly roundCount rounds when manifest is large enough', () => {
    const rounds = buildRounds({ roundCount: 5, optionCount: 4 }, pool);
    expect(rounds).toHaveLength(5);
  });

  it('caps rounds at manifest length when manifest is smaller', () => {
    const rounds = buildRounds({ roundCount: 20, optionCount: 4 }, pool);
    expect(rounds).toHaveLength(pool.length);
  });

  it('has no duplicate answers across rounds', () => {
    const rounds = buildRounds({ roundCount: 5, optionCount: 4 }, pool);
    const ids = rounds.map((r) => r.answer.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every round options array includes the answer', () => {
    const rounds = buildRounds({ roundCount: 5, optionCount: 4 }, pool);
    for (const r of rounds) {
      expect(r.options.some((o) => o.id === r.answer.id)).toBe(true);
    }
  });

  it('every round has exactly optionCount options', () => {
    const rounds = buildRounds({ roundCount: 5, optionCount: 4 }, pool);
    for (const r of rounds) {
      expect(r.options).toHaveLength(4);
    }
  });

  it('initializes each round with attempt=1, no picks, pending result, zero points', () => {
    const rounds = buildRounds({ roundCount: 3, optionCount: 4 }, pool);
    for (const r of rounds) {
      expect(r.attempt).toBe(1);
      expect(r.picked).toEqual([]);
      expect(r.result).toBe('pending');
      expect(r.pointsEarned).toBe(0);
    }
  });

  it('focal points are within 25-75 range', () => {
    const rounds = buildRounds({ roundCount: 8, optionCount: 4 }, pool);
    for (const r of rounds) {
      expect(r.focal.x).toBeGreaterThanOrEqual(25);
      expect(r.focal.x).toBeLessThanOrEqual(75);
      expect(r.focal.y).toBeGreaterThanOrEqual(25);
      expect(r.focal.y).toBeLessThanOrEqual(75);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/game.test.ts`
Expected: FAIL ("buildRounds is not a function" / not exported).

- [ ] **Step 3: Add `buildRounds` to `src/lib/game.ts`**

Update the top `import type` to add `GameConfig` and `Round`:

```ts
import type { Attempt, GameConfig, Round, VikingThing } from './types';
```

Then append the new functions:

```ts
function randomInRange(min: number, max: number, rng: () => number): number {
  return min + rng() * (max - min);
}

export function buildRounds(
  config: GameConfig,
  pool: VikingThing[],
  rng: () => number = Math.random,
): Round[] {
  const answerCount = Math.min(config.roundCount, pool.length);
  const answers = shuffle(pool, rng).slice(0, answerCount);

  return answers.map((answer): Round => {
    const distractors = pickDistractors(answer, pool, config.optionCount, rng);
    const options = shuffle([answer, ...distractors], rng);
    return {
      answer,
      options,
      focal: {
        x: randomInRange(25, 75, rng),
        y: randomInRange(25, 75, rng),
      },
      attempt: 1,
      picked: [],
      result: 'pending',
      pointsEarned: 0,
    };
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/game.test.ts`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/game.ts src/lib/game.test.ts
git commit -m "feat: add buildRounds for session construction"
```

---

## Task 7: Create placeholder images and manifest

**Files:**
- Create: `public/vikings.json`
- Create: `public/images/longship.svg`
- Create: `public/images/knarr.svg`
- Create: `public/images/drakkar.svg`
- Create: `public/images/ulfberht.svg`
- Create: `public/images/axe.svg`
- Create: `public/images/spear.svg`
- Create: `public/images/helmet.svg`
- Create: `public/images/chainmail.svg`
- Create: `public/images/placeholder.svg`

- [ ] **Step 1: Create `public/images/placeholder.svg` (generic fallback)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <rect width="800" height="450" fill="#5a5450"/>
  <text x="400" y="225" text-anchor="middle" dominant-baseline="middle" font-family="Inter, sans-serif" font-size="32" fill="#e8dcb8">Image unavailable</text>
</svg>
```

- [ ] **Step 2: Create a placeholder SVG for each entry**

Use this template, swapping `BG`, `FG`, and `LABEL` for each file:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <rect width="800" height="450" fill="BG"/>
  <circle cx="400" cy="225" r="100" fill="FG" opacity="0.7"/>
  <text x="400" y="225" text-anchor="middle" dominant-baseline="middle" font-family="Cinzel, serif" font-size="40" font-weight="600" fill="#1a120a">LABEL</text>
  <text x="400" y="380" text-anchor="middle" font-family="Inter, sans-serif" font-size="18" fill="#1a120a" opacity="0.7">placeholder</text>
</svg>
```

Use these palette swaps per file:

| File              | BG        | FG        | LABEL        |
| ----------------- | --------- | --------- | ------------ |
| longship.svg      | `#4a6c8c` | `#c8a44c` | Longship     |
| knarr.svg         | `#5a8ca0` | `#c8a44c` | Knarr        |
| drakkar.svg       | `#3a5a78` | `#e8dcb8` | Drakkar      |
| ulfberht.svg      | `#8b1f1f` | `#e8dcb8` | Ulfberht     |
| axe.svg           | `#7a3a2a` | `#c8a44c` | Axe          |
| spear.svg         | `#5a4a3a` | `#e8dcb8` | Spear        |
| helmet.svg        | `#4a4a4a` | `#c8a44c` | Helmet       |
| chainmail.svg     | `#3a3a3a` | `#a0a0a0` | Chainmail    |

- [ ] **Step 3: Create `public/vikings.json`**

```json
[
  { "id": "longship",  "name": "Longship",       "image": "longship.svg",  "category": "ship" },
  { "id": "knarr",     "name": "Knarr",          "image": "knarr.svg",     "category": "ship" },
  { "id": "drakkar",   "name": "Drakkar",        "image": "drakkar.svg",   "category": "ship" },
  { "id": "ulfberht",  "name": "Ulfberht Sword", "image": "ulfberht.svg",  "category": "weapon" },
  { "id": "axe",       "name": "Dane Axe",       "image": "axe.svg",       "category": "weapon" },
  { "id": "spear",     "name": "Spear",          "image": "spear.svg",     "category": "weapon" },
  { "id": "helmet",    "name": "Spangenhelm",    "image": "helmet.svg",    "category": "armor" },
  { "id": "chainmail", "name": "Chainmail Hauberk", "image": "chainmail.svg", "category": "armor" }
]
```

- [ ] **Step 4: Verify files exist**

Run: `ls public/images/ && cat public/vikings.json | head -5`
Expected: 9 SVG files listed (8 entries + placeholder), JSON prints opening lines.

- [ ] **Step 5: Commit**

```bash
git add public/
git commit -m "feat: add placeholder images and manifest"
```

---

## Task 8: Implement `manifest.ts` loader

**Files:**
- Create: `src/lib/manifest.ts`

- [ ] **Step 1: Create `src/lib/manifest.ts`**

```ts
import type { VikingThing } from './types';

export async function loadManifest(): Promise<VikingThing[]> {
  const url = `${import.meta.env.BASE_URL}vikings.json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load manifest: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Manifest is not an array');
  }
  return data as VikingThing[];
}

export function imageUrl(entry: VikingThing): string {
  return `${import.meta.env.BASE_URL}images/${entry.image}`;
}
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/manifest.ts
git commit -m "feat: add manifest loader"
```

---

## Task 9: Create theme stylesheet

**Files:**
- Create: `src/styles/theme.css`

- [ ] **Step 1: Create `src/styles/theme.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --bg-wood: #2b1d12;
  --bg-parchment: #e8dcb8;
  --ink: #1a120a;
  --gold: #c8a44c;
  --iron: #5a5450;
  --blood: #8b1f1f;
  --moss: #4a6741;

  --font-display: 'Cinzel', serif;
  --font-body: 'Inter', system-ui, sans-serif;

  --radius: 6px;
  --shadow-card: 0 6px 24px rgba(0, 0, 0, 0.45);
}

* {
  box-sizing: border-box;
}

html,
body,
#app {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

body {
  background:
    radial-gradient(ellipse at top, #3a2818 0%, #1f140a 70%),
    var(--bg-wood);
  color: var(--bg-parchment);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3 {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: 0.02em;
  margin: 0 0 0.5em;
}

button {
  font-family: var(--font-body);
  font-size: 1rem;
  cursor: pointer;
  border: 1px solid var(--gold);
  border-radius: var(--radius);
  padding: 0.6em 1.2em;
  background: var(--bg-parchment);
  color: var(--ink);
  transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
}

button:hover:not(:disabled) {
  background: #f0e3bf;
  transform: translateY(-1px);
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

button.correct {
  background: var(--moss);
  color: var(--bg-parchment);
  border-color: var(--moss);
  animation: pulse 300ms ease-out;
}

button.wrong {
  background: var(--blood);
  color: var(--bg-parchment);
  border-color: var(--blood);
  text-decoration: line-through;
  animation: shake 200ms ease-in-out;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(74, 103, 65, 0.6);
  }
  100% {
    box-shadow: 0 0 0 12px rgba(74, 103, 65, 0);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-6px);
  }
  75% {
    transform: translateX(6px);
  }
}

.panel {
  background: var(--bg-parchment);
  color: var(--ink);
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
}

.app-shell {
  max-width: 760px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
```

- [ ] **Step 2: Import in `src/main.ts`**

Replace the contents of `src/main.ts` with:

```ts
import { mount } from 'svelte';
import './styles/theme.css';
import App from './App.svelte';

const app = mount(App, { target: document.getElementById('app')! });

export default app;
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/theme.css src/main.ts
git commit -m "feat: add nordic theme stylesheet"
```

---

## Task 10: Build `ZoomedImage` component

**Files:**
- Create: `src/components/ZoomedImage.svelte`

- [ ] **Step 1: Create `src/components/ZoomedImage.svelte`**

```svelte
<script lang="ts">
  import type { Attempt } from '../lib/types';

  type Props = {
    src: string;
    alt: string;
    attempt: Attempt;
    focal: { x: number; y: number };
  };

  let { src, alt, attempt, focal }: Props = $props();

  const zoomByAttempt: Record<Attempt, number> = { 1: 4, 2: 2, 3: 1 };
  let scale = $derived(zoomByAttempt[attempt]);

  function handleError(e: Event) {
    const img = e.currentTarget as HTMLImageElement;
    img.src = `${import.meta.env.BASE_URL}images/placeholder.svg`;
  }
</script>

<div class="frame">
  <img
    {src}
    {alt}
    onerror={handleError}
    style:transform-origin="{focal.x}% {focal.y}%"
    style:transform="scale({scale}) translate({50 - focal.x}%, {50 - focal.y}%)"
  />
</div>

<style>
  .frame {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: #000;
    border-radius: var(--radius);
    border: 2px solid var(--gold);
    box-shadow: 0 0 0 6px var(--bg-wood), var(--shadow-card);
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 400ms ease-out;
    will-change: transform;
  }
</style>
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ZoomedImage.svelte
git commit -m "feat: add ZoomedImage with focal-point transform"
```

---

## Task 11: Build `StartScreen` component

**Files:**
- Create: `src/components/StartScreen.svelte`

- [ ] **Step 1: Create `src/components/StartScreen.svelte`**

```svelte
<script lang="ts">
  import type { GameConfig } from '../lib/types';

  type Props = {
    initialConfig: GameConfig;
    manifestSize: number;
    onBegin: (config: GameConfig) => void;
  };

  let { initialConfig, manifestSize, onBegin }: Props = $props();

  let roundCount = $state(initialConfig.roundCount);
  let optionCount = $state(initialConfig.optionCount);

  let effectiveRounds = $derived(Math.min(roundCount, manifestSize));
  let cappedNote = $derived(
    roundCount > manifestSize
      ? `Only ${manifestSize} items available — that's how many rounds you'll play.`
      : '',
  );
</script>

<section class="panel start">
  <h1>Viking Image Guessing Game</h1>
  <p>Guess the viking object before the image zooms out. Three chances per round.</p>

  <label>
    Rounds
    <select bind:value={roundCount}>
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={15}>15</option>
    </select>
  </label>

  <label>
    Answer choices
    <select bind:value={optionCount}>
      <option value={3}>3</option>
      <option value={4}>4</option>
      <option value={5}>5</option>
      <option value={6}>6</option>
    </select>
  </label>

  {#if cappedNote}
    <p class="note">{cappedNote}</p>
  {/if}

  <button class="primary" onclick={() => onBegin({ roundCount: effectiveRounds, optionCount })}>
    Begin
  </button>
</section>

<style>
  .start {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-weight: 600;
  }
  select {
    font-family: var(--font-body);
    font-size: 1rem;
    padding: 0.4em 0.6em;
    border: 1px solid var(--iron);
    border-radius: var(--radius);
    background: white;
    color: var(--ink);
  }
  .note {
    color: var(--iron);
    font-style: italic;
    margin: 0;
  }
  button.primary {
    background: var(--gold);
    border-color: var(--gold);
    color: var(--ink);
    font-weight: 700;
    margin-top: 0.5rem;
  }
</style>
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/StartScreen.svelte
git commit -m "feat: add StartScreen with config selectors"
```

---

## Task 12: Build `GameScreen` component

**Files:**
- Create: `src/components/GameScreen.svelte`

- [ ] **Step 1: Create `src/components/GameScreen.svelte`**

```svelte
<script lang="ts">
  import type { Round, VikingThing } from '../lib/types';
  import { imageUrl } from '../lib/manifest';
  import ZoomedImage from './ZoomedImage.svelte';

  type Props = {
    round: Round;
    roundNumber: number;
    totalRounds: number;
    totalScore: number;
    onGuess: (option: VikingThing) => void;
    onNext: () => void;
  };

  let { round, roundNumber, totalRounds, totalScore, onGuess, onNext }: Props = $props();

  function buttonClass(option: VikingThing): string {
    if (round.result === 'won' && option.id === round.answer.id) return 'correct';
    if (round.result === 'lost' && option.id === round.answer.id) return 'correct';
    if (round.picked.includes(option.id)) return 'wrong';
    return '';
  }

  function isDisabled(option: VikingThing): boolean {
    if (round.result !== 'pending') return true;
    return round.picked.includes(option.id);
  }

  const attemptDots = $derived(
    [1, 2, 3]
      .map((n) => (n <= round.attempt - 1 || round.result !== 'pending' && n <= round.attempt ? '●' : '○'))
      .join(''),
  );
</script>

<section class="game">
  <header>
    <span class="counter">Round {roundNumber} / {totalRounds}</span>
    <span class="score">Score: {totalScore}</span>
    <span class="attempts" aria-label="Attempts used">{attemptDots}</span>
  </header>

  <ZoomedImage
    src={imageUrl(round.answer)}
    alt="Zoomed viking item — guess what it is"
    attempt={round.attempt}
    focal={round.focal}
  />

  <div class="options">
    {#each round.options as option (option.id)}
      <button
        class={buttonClass(option)}
        disabled={isDisabled(option)}
        onclick={() => onGuess(option)}
      >
        {option.name}
      </button>
    {/each}
  </div>

  {#if round.result !== 'pending'}
    <div class="result panel">
      {#if round.result === 'won'}
        <strong>Correct!</strong> +{round.pointsEarned}
      {:else}
        <strong>Out of guesses.</strong> It was a <em>{round.answer.name}</em>.
      {/if}
      <button class="primary" onclick={onNext}>
        {roundNumber < totalRounds ? 'Next' : 'See results'}
      </button>
    </div>
  {/if}
</section>

<style>
  .game {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    font-family: var(--font-display);
    font-size: 1.1rem;
  }
  .attempts {
    letter-spacing: 0.2em;
    color: var(--gold);
  }
  .options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  @media (max-width: 480px) {
    .options {
      grid-template-columns: 1fr;
    }
  }
  .result {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
  button.primary {
    background: var(--gold);
    border-color: var(--gold);
    color: var(--ink);
    font-weight: 700;
  }
</style>
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/GameScreen.svelte
git commit -m "feat: add GameScreen with options grid and result banner"
```

---

## Task 13: Build `EndScreen` component

**Files:**
- Create: `src/components/EndScreen.svelte`

- [ ] **Step 1: Create `src/components/EndScreen.svelte`**

```svelte
<script lang="ts">
  import type { Round } from '../lib/types';

  type Props = {
    rounds: Round[];
    totalScore: number;
    onPlayAgain: () => void;
  };

  let { rounds, totalScore, onPlayAgain }: Props = $props();

  const maxScore = rounds.length * 100;
  const correctCount = rounds.filter((r) => r.result === 'won').length;
</script>

<section class="panel end">
  <h1>Skál!</h1>
  <p class="score-line">{totalScore} / {maxScore}</p>
  <p>{correctCount} of {rounds.length} correct</p>

  <button class="primary" onclick={onPlayAgain}>Play again</button>
</section>

<style>
  .end {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  .score-line {
    font-family: var(--font-display);
    font-size: 2.5rem;
    color: var(--blood);
    margin: 0;
  }
  button.primary {
    background: var(--gold);
    border-color: var(--gold);
    color: var(--ink);
    font-weight: 700;
    margin-top: 0.75rem;
  }
</style>
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/EndScreen.svelte
git commit -m "feat: add EndScreen with final score"
```

---

## Task 14: Wire screens together in `App.svelte`

**Files:**
- Modify: `src/App.svelte`

- [ ] **Step 1: Replace `src/App.svelte` contents**

```svelte
<script lang="ts">
  import type { Game, GameConfig, VikingThing } from './lib/types';
  import { buildRounds, scoreFor } from './lib/game';
  import { loadManifest } from './lib/manifest';
  import StartScreen from './components/StartScreen.svelte';
  import GameScreen from './components/GameScreen.svelte';
  import EndScreen from './components/EndScreen.svelte';

  type Phase = 'loading' | 'error' | 'start' | 'playing' | 'end';

  let phase = $state<Phase>('loading');
  let manifest = $state<VikingThing[]>([]);
  let loadError = $state<string>('');
  let lastConfig = $state<GameConfig>({ roundCount: 10, optionCount: 4 });
  let game = $state<Game | null>(null);

  async function fetchManifest() {
    phase = 'loading';
    loadError = '';
    try {
      manifest = await loadManifest();
      phase = 'start';
    } catch (err) {
      loadError = err instanceof Error ? err.message : String(err);
      phase = 'error';
    }
  }

  function beginGame(config: GameConfig) {
    lastConfig = config;
    const rounds = buildRounds(config, manifest);
    game = { config, rounds, index: 0, totalScore: 0 };
    phase = 'playing';
  }

  function handleGuess(option: VikingThing) {
    if (!game) return;
    const round = game.rounds[game.index];
    if (round.result !== 'pending') return;

    if (option.id === round.answer.id) {
      round.pointsEarned = scoreFor(round.attempt);
      round.result = 'won';
      game.totalScore += round.pointsEarned;
    } else {
      round.picked = [...round.picked, option.id];
      if (round.attempt === 3) {
        round.result = 'lost';
      } else {
        round.attempt = (round.attempt + 1) as 1 | 2 | 3;
      }
    }
  }

  function handleNext() {
    if (!game) return;
    if (game.index + 1 >= game.rounds.length) {
      phase = 'end';
    } else {
      game.index += 1;
    }
  }

  function playAgain() {
    game = null;
    phase = 'start';
  }

  fetchManifest();
</script>

<div class="app-shell">
  {#if phase === 'loading'}
    <p>Loading…</p>
  {:else if phase === 'error'}
    <section class="panel">
      <h2>Could not load game</h2>
      <p>{loadError}</p>
      <button onclick={fetchManifest}>Retry</button>
    </section>
  {:else if phase === 'start'}
    <StartScreen initialConfig={lastConfig} manifestSize={manifest.length} onBegin={beginGame} />
  {:else if phase === 'playing' && game}
    <GameScreen
      round={game.rounds[game.index]}
      roundNumber={game.index + 1}
      totalRounds={game.rounds.length}
      totalScore={game.totalScore}
      onGuess={handleGuess}
      onNext={handleNext}
    />
  {:else if phase === 'end' && game}
    <EndScreen rounds={game.rounds} totalScore={game.totalScore} onPlayAgain={playAgain} />
  {/if}
</div>
```

- [ ] **Step 2: Run type-check**

Run: `npm run check`
Expected: no errors.

- [ ] **Step 3: Run all tests**

Run: `npm run test`
Expected: all logic tests pass.

- [ ] **Step 4: Manual browser verification**

Run: `npm run dev`
Open `http://localhost:5173/viking-game/` in a browser. Verify:
- Start screen loads with selectors and "Begin" button
- Begin starts a round; image is visibly zoomed (4×)
- Picking a wrong option marks it red and the image zooms out
- Picking the correct option marks it green and shows points
- Clicking Next advances rounds
- End screen shows the final score and offers Play again
- Play again returns to Start

Stop the dev server with Ctrl-C.

- [ ] **Step 5: Commit**

```bash
git add src/App.svelte
git commit -m "feat: wire start, game, and end screens with state machine"
```

---

## Task 15: Add GitHub Pages deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify build artifact paths**

Run: `npm run build && ls dist/index.html dist/assets`
Expected: `dist/index.html` exists; `dist/assets` directory has hashed JS/CSS files.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add github pages deploy workflow"
```

---

## Task 16: Final verification

**Files:** none

- [ ] **Step 1: Run full test suite**

Run: `npm run test`
Expected: all tests pass.

- [ ] **Step 2: Run type-check**

Run: `npm run check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds, `dist/` is populated.

- [ ] **Step 4: Production preview smoke test**

Run: `npm run preview` (then Ctrl-C after browser check)
Open the printed URL in a browser. Click through a full game start-to-end, then play again. Verify behavior matches Task 14 acceptance.

- [ ] **Step 5: Confirm clean git status**

Run: `git status`
Expected: clean working tree, all changes committed.
