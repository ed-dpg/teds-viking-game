# Handoff: Runestone visual direction for Viking Image Guessing Game

## Overview

A full visual redesign of the Viking Image Guessing Game. The current
shipped version (plain wood + parchment + gold) reads "a bit flat";
**Runestone** replaces it with a carved-slate aesthetic: chiseled
depth on every surface, runic bands framing the central image, moss
green for correct, blood red for wrong, all set on a dark slate
background with a faint chisel-strike texture.

The product structure (Start → Game → End, three attempts per round,
zoom-out scoring) is **unchanged**. Only the visual layer and a small
amount of copy change.

## About the design files

The files in `reference/` are **design references created in HTML and
React** — prototypes that demonstrate the intended look and behavior,
not production code to copy directly.

The target codebase is the existing **Svelte 5 + Vite + TypeScript**
app at <https://github.com/ed-dpg/teds-viking-game>. The task is to
**recreate this design in the existing Svelte codebase using its
established patterns** — keep the file layout, the `$state` rune-based
state model, the pure-function game logic in `src/lib/game.ts`, and
the Vitest tests. Only the styling layer (`src/styles/theme.css`) and
the markup/style of the four components (`StartScreen.svelte`,
`GameScreen.svelte`, `EndScreen.svelte`, `ZoomedImage.svelte`) change.

The HTML/JSX references are there to show **how it should look and
feel** — port the visual treatment, don't transplant the React code.

## Fidelity

**High-fidelity.** All colors, type sizes, spacing, shadow stacks,
border treatments, motion durations and easing curves are final.
Reproduce pixel-for-pixel within the constraints of the existing
Svelte component layout.

## What changes vs. what doesn't

| Layer                          | Change?  | Notes                                                 |
| ------------------------------ | -------- | ----------------------------------------------------- |
| `src/lib/game.ts`              | **No**   | Pure game logic stays. All existing tests still pass. |
| `src/lib/types.ts`             | **No**   | Type model unchanged.                                 |
| `src/lib/manifest.ts`          | **No**   |                                                       |
| `src/lib/sound.ts`             | **No**   |                                                       |
| `public/vikings.json`          | **No**   | All 28 entries kept as-is.                            |
| `public/images/**`             | **No**   |                                                       |
| `src/styles/theme.css`         | **Yes**  | Rewritten — see "Theme tokens" below.                 |
| `src/App.svelte`               | Minor    | Body class + small copy edits in footer.              |
| `src/components/StartScreen.svelte` | **Yes** | Full restyle + minor copy.                       |
| `src/components/GameScreen.svelte`  | **Yes** | Full restyle, new result panel chrome.           |
| `src/components/EndScreen.svelte`   | **Yes** | Full restyle, larger score display.              |
| `src/components/ZoomedImage.svelte` | **Yes** | Frame becomes a stone aperture w/ runic bands.   |

## Theme tokens

Replace the contents of `src/styles/theme.css` with the token set
below. This is the canonical source — all component styles reference
these variables.

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

:root {
  /* Slate palette */
  --slate-deep:   #16140f;
  --slate-dark:   #1a1814;
  --slate-mid:    #2a2822;
  --slate-light:  #3a3833;

  --bone:         #c8c1a8;   /* main text on slate */
  --bone-dim:     #b2ab94;
  --bone-quiet:   #6e6850;   /* runic bands, captions */

  --moss:         #4a6741;   /* correct */
  --moss-bright:  #5a7a4e;
  --moss-deep:    #324327;
  --blood:        #8b1f1f;   /* wrong */
  --blood-deep:   #6a1717;
  --gold:         #c8a44c;   /* used sparingly — attempt dots only */

  /* Carved-relief shadow stacks. Apply these as the
     entire box-shadow value (or pair with one custom layer). */
  --carved-out: inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.7);
  --carved-in:  inset 0 1px 0 rgba(0,0,0,0.7), inset 0 -1px 0 rgba(255,255,255,0.06);
  --drop:    0 6px 18px rgba(0,0,0,0.55);
  --drop-lg: 0 12px 30px rgba(0,0,0,0.7);

  /* Text shadow used on every Cinzel heading */
  --carve-text-shadow: 1px 1px 0 rgba(0,0,0,0.6);

  /* Type */
  --font-display: 'Cinzel', serif;
  --font-body:    'Inter', system-ui, sans-serif;

  /* Radius (Runestone is sharp — small or zero) */
  --radius:    2px;
  --radius-sm: 2px;

  /* Motion */
  --dur-fast: 160ms;        /* hover */
  --dur-med:  220ms;        /* wrong shake / banner fade */
  --dur-slow: 360ms;        /* correct pulse */
  --dur-zoom: 480ms;        /* image zoom-out */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Page background

```css
body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 50% 0%, var(--slate-light) 0%, var(--slate-deep) 70%),
    var(--slate-deep);
  color: var(--bone);
  font-family: var(--font-body);
  position: relative;
}
body::before {
  /* Faint chisel-strike speckle overlay. SVG noise inlined as data URI. */
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='1' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.7  0 0 0 0 0.7  0 0 0 0 0.6  0 0 0 0.18 0'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>");
  mix-blend-mode: overlay; opacity: 0.55;
}
body > * { position: relative; z-index: 1; }
```

### Core primitives

Add these as global utility classes in `theme.css`:

```css
/* Carved INTO the slate (recessed) — panels for content blocks */
.slate-panel {
  background: linear-gradient(180deg, var(--slate-mid), var(--slate-dark));
  border-radius: var(--radius);
  box-shadow:
    inset 0 2px 0 rgba(0,0,0,0.7),
    inset 0 -2px 0 rgba(255,255,255,0.06),
    var(--drop-lg);
  padding: 28px 32px 32px;
}

/* Carved OUT of the slate (raised) — buttons / option tablets */
.slate-tablet {
  background: linear-gradient(180deg, #322f29 0%, #1f1d18 100%);
  color: var(--bone);
  border: none;
  border-radius: var(--radius);
  padding: 14px 16px;
  font-family: var(--font-display);
  font-size: 15px; font-weight: 600;
  letter-spacing: 0.08em;
  text-shadow: var(--carve-text-shadow);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.07),
    inset 0 -1px 0 rgba(0,0,0,0.7),
    inset 0 0 0 1px rgba(0,0,0,0.5),
    0 2px 4px rgba(0,0,0,0.55);
  cursor: pointer; text-align: left;
  transition: background var(--dur-fast) ease, box-shadow var(--dur-fast) ease,
              transform 120ms ease, color var(--dur-fast) ease;
}
.slate-tablet:hover:not(:disabled) {
  background: linear-gradient(180deg, #3a3730 0%, #25221c 100%);
  color: #e6dfc6;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.12),
    inset 0 -1px 0 rgba(0,0,0,0.7),
    inset 0 0 0 1px rgba(0,0,0,0.5),
    0 0 0 1px rgba(200,164,76,0.18),   /* faint gold glow on hover */
    0 4px 12px rgba(0,0,0,0.6);
}
.slate-tablet:active:not(:disabled) {
  transform: translateY(1px);
  box-shadow: var(--carved-in), 0 1px 2px rgba(0,0,0,0.5);
}
.slate-tablet:disabled { opacity: 0.55; cursor: not-allowed; }

/* Moss CTA — used for Begin, Next stone, Play again */
.slate-tablet--primary {
  background: linear-gradient(180deg, var(--moss-bright) 0%, var(--moss-deep) 100%);
  color: #e8dcb8;
  text-align: center;
  letter-spacing: 0.14em;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.22),
    inset 0 -1px 0 rgba(0,0,0,0.5),
    0 3px 10px rgba(0,0,0,0.6);
}
.slate-tablet--primary:hover:not(:disabled) {
  background: linear-gradient(180deg, #6a8c5a 0%, #3d5230 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.3),
    inset 0 -1px 0 rgba(0,0,0,0.5),
    0 0 0 1px rgba(74,103,65,0.5),
    0 6px 14px rgba(74,103,65,0.35),
    0 4px 10px rgba(0,0,0,0.55);
}

/* Correct & wrong answer states (applied to the same button when resolved) */
.slate-tablet--correct {
  background: linear-gradient(180deg, var(--moss-bright) 0%, var(--moss-deep) 100%);
  color: #e8dcb8;
  animation: rune-pulse 360ms ease-out;
}
.slate-tablet--wrong {
  background: linear-gradient(180deg, #7a2828 0%, #3a0e0e 100%);
  color: #e8dcb8;
  text-decoration: line-through;
  animation: rune-shake 220ms ease-in-out;
}

@keyframes rune-pulse {
  0%   { box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.5),
    0 0 0 0 rgba(90,122,78,0.7),
    0 3px 10px rgba(0,0,0,0.6); }
  100% { box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.5),
    0 0 0 14px rgba(90,122,78,0),
    0 3px 10px rgba(0,0,0,0.6); }
}
@keyframes rune-shake {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-7px); }
  60%      { transform: translateX(6px); }
  80%      { transform: translateX(-3px); }
}
@keyframes rune-fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes rune-reveal {
  from { opacity: 0; transform: scale(0.96); filter: blur(2px); }
  to   { opacity: 1; transform: scale(1);    filter: blur(0); }
}
```

The full reference is in `reference/runestone.css` — copy the exact
values from there. The summary above hits the highlights.

---

## Screens

### Screen 1 · Start screen (`StartScreen.svelte`)

**Purpose:** configure round count / option count / language, then begin.

**Layout:**
- A `.slate-panel` centered in an 880px-max-width column.
- Inside: `runic-band` top → centered title block → 3-column select row → `.slate-tablet--primary` Begin button → `runic-band` bottom.
- Vertical gap between groups: 20px.

**Components:**

| Element              | Spec                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Runic band (top)     | Cinzel · 13px · letter-spacing 0.32em · color `--bone-quiet` · text-shadow `--carve-text-shadow` · `white-space: nowrap`. Use the 3-rune short string `"ᚱᛏᛒ"`. |
| Title                | Cinzel 700 · 38px · letter-spacing 0.12em · color `--bone` · text-shadow `1px 1px 0 rgba(0,0,0,0.7), -1px -1px 0 rgba(255,255,255,0.04)`. Copy: **"Viking Image Guessing"** (note: no "Game" — shorter feels carved). |
| Subtitle             | Inter · 14px · letter-spacing 0.08em · color `--bone-quiet`. Copy: **"Three chances per round. Read the stones."**                    |
| Field group          | 3-column CSS grid · 16px gap.                                                                                                         |
| Field label          | Cinzel · 12px · uppercase · letter-spacing 0.18em · color `--bone-quiet` · text-shadow `--carve-text-shadow`. Labels: `Rounds`, `Choices`, `Tongue`. |
| Native `<select>`    | See `.rune-select` in reference CSS. Appearance:none, inset shadow stack, custom chevron via data-URI. Cinzel 16px, padded `12px 36px 12px 14px`. |
| Round options        | `V · 5`, `X · 10`, `XV · 15` (default 10).                                                                                            |
| Choice options       | `III · 3`, `IV · 4`, `V · 5`, `VI · 6` (default 4).                                                                                   |
| Language options     | `English`, `Old Norse` (default English).                                                                                             |
| Capped note          | Inter italic · 13px · color `--bone-quiet` · centered. Copy: `Only {N} relics catalogued — that's how many rounds you'll play.`       |
| Begin CTA            | `.slate-tablet--primary`. 16px Cinzel, padded `16px 24px`, min-width 220px, justify-self center. Copy: **"Begin the saga"**.          |
| Runic band (bottom)  | Same as top. String `"ᚱᛏᛒ"`.                                                                                                          |

**Reference:** `reference/RuneStart.jsx` (React) and the top of `reference/Runestone.html`.

---

### Screen 2 · Game screen (`GameScreen.svelte`)

**Purpose:** show the zoomed image, four (or N) answer tablets, attempt counter; on resolve, show the result panel and a Next CTA.

**Layout:**

```
┌────────────────────────────────────────────────────────────────┐
│  Round X / Y      Score: NNN       ●●○      [back]  [sound]   │ ← rune-header
├────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐  ┌──────────────────┐ ┌──────────────────┐    │
│ │ runic-band  │  │  Option A        │ │  Option B        │    │
│ │             │  └──────────────────┘ └──────────────────┘    │
│ │ ╔═══════╗   │  ┌──────────────────┐ ┌──────────────────┐    │
│ │ ║ IMAGE ║   │  │  Option C        │ │  Option D        │    │
│ │ ║       ║   │  └──────────────────┘ └──────────────────┘    │
│ │ ║       ║   │                                                │
│ │ ╚═══════╝   │  Hint caption  ·or·  Result panel              │
│ │ runic-band  │                                                │
│ └─────────────┘                                                │
└────────────────────────────────────────────────────────────────┘
```

CSS grid: `grid-template-columns: 360px 1fr; gap: 28px;` (above
700px). Collapse to single column below 700px.

**Components:**

| Element                | Spec                                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header `.rune-header`  | `display: grid; grid-template-columns: 1fr auto auto auto auto; gap: 22px; align-items: center;`. 4px top padding.                                |
| Round / Score          | Cinzel · 17px · letter-spacing 0.1em · color `--bone` · text-shadow `--carve-text-shadow`. Copy: `Round 3 / 10` (thin space around `/`).          |
| Attempt dots           | Cinzel · 22px · letter-spacing 0.3em · color `--moss-bright` · text-shadow `--carve-text-shadow`. `●` filled, `○` empty.                          |
| Icon tablet            | 36×36, `.icon-tablet` recessed slate square. Material icons (back arrow, volume-up, volume-off) at 18×18, currentColor. Hover: color → `--moss-bright` + 1px gold ring. Pressed: color → `--bone-quiet`. |
| Stone aperture         | `.stone-aperture` wraps `runic-band` + `.stone-window` + `runic-band`. 12px 16px 14px padding. Aspect ratio of inner window 3 / 4.                |
| Stone window (image)   | `position: relative; overflow: hidden; background: #000;` Inset shadows for chiseled-into-stone depth + corner moss glow + inner vignette.        |
| Image transform        | `transform-origin: {focal.x}% {focal.y}%; transform: scale({4|2|1});`. Transition `transform 480ms cubic-bezier(0.16, 1, 0.3, 1)`.                |
| Runic bands            | Cinzel · 13px · letter-spacing 0.32em · color `--bone-quiet`. Top string `"ᚦᚨᛞᛚᚱᛏᛒᚢᛜ"`, bottom string `"ᛟᛗᚲᛇᚷᛁᛉᚹᛊ"`. `white-space: nowrap`.       |
| Options grid           | `grid-template-columns: 1fr 1fr; gap: 12px;`.                                                                                                     |
| Option button          | `.slate-tablet` (see primitives). Cinzel 15px, padded `14px 16px`, text-align left. On resolve, the answer gets `.slate-tablet--correct`; picked wrong ones get `.slate-tablet--wrong`. |
| Hint caption (pending) | Inter italic · 13px · color `--bone-quiet` · 4px horizontal padding. Copy by attempt: attempt 1 = `"A first guess scores the most. Be sure of it."`, attempt 2 = `"Each wrong stroke widens the view."`, attempt 3 = `"One stone remains. Strike true."` |
| Result panel           | `.rune-result`. See below.                                                                                                                        |

**Result panel `.rune-result`:**

- Background `linear-gradient(180deg, #232118, #16140f)`. Padding `18px 22px`. Left border `4px solid --moss` (or `--blood` when lost). Box shadow `inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.6), 0 6px 18px rgba(0,0,0,0.55)`.
- Animation: `rune-fade-up 260ms ease-out`.
- Content (in order):
  1. **Verdict** — Cinzel 18px · letter-spacing 0.12em · text-shadow `--carve-text-shadow`. Won: `"Correct · +{points}"` in `--moss-bright`. Lost: `"Out of guesses"` in `#b33b3b`.
  2. **Body** — Inter 15px · line-height 1.6 · color `--bone-dim`. On win: just the description. On loss (English): `It was a {answer.name}. {description}`. On loss (Old Norse): `It was a {answer.oldNorse} ({answer.name}). {description}`.
  3. **Next CTA** — right-aligned `.slate-tablet--primary` · padding `10px 22px` · font-size 14px · min-width 140px. Copy: `"Next stone"` for normal rounds, `"See results"` for the final round.

---

### Screen 3 · End screen (`EndScreen.svelte`)

**Purpose:** show final score and a play-again CTA.

**Layout:** centered in the same `.slate-panel`. `display: grid; gap: 18px; justify-items: center; text-align: center; padding: 44px 32px 36px;`.

**Components:**

| Element       | Spec                                                                                                                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Runic band    | Same short string `"ᚱᛏᛒ"` top and bottom.                                                                                                                                                                                                  |
| "Skál!"       | Cinzel 700 · 56px · letter-spacing 0.18em · color `--bone` · text-shadow `2px 2px 0 rgba(0,0,0,0.7), -1px -1px 0 rgba(255,255,255,0.06), 0 0 16px rgba(74,103,65,0.2)`.                                                                    |
| Score line    | Cinzel 700 · 88px · letter-spacing 0.04em · line-height 0.9 · color `--moss-bright` · text-shadow `2px 2px 0 rgba(0,0,0,0.7), -1px -1px 0 rgba(255,255,255,0.04), 0 0 28px rgba(74,103,65,0.4)`. Animation: `rune-reveal 600ms ease-out`. The `/ {max}` half: Cinzel 600 · 44px · color `--bone-dim` · letter-spacing 0.06em · text-shadow `--carve-text-shadow`. |
| Subline       | Inter 16px · color `--bone-dim`. Copy: `{N} of {total} relics named correctly.`                                                                                                                                                            |
| Verdict       | Inter italic · 14px · color `--bone-quiet`. Choose by ratio `score/max`: ≥0.85 `"A saga worth remembering."`, ≥0.60 `"A respectable tally."`, ≥0.30 `"The skald may yet polish your name."`, else `"The longhouse hears no songs tonight."`. |
| Play again    | `.slate-tablet--primary`, padding `14px 30px`, min-width 220, margin-top 8, font-size 15. Copy: **"Play again"**.                                                                                                                          |

---

### Screen 4 · Image frame (`ZoomedImage.svelte`)

The frame becomes a **stone aperture** with runic bands. Replace the
current 3:4 wood-mat frame with the structure documented under
"Stone aperture" / "Stone window" above. The `transform: scale()`
behavior driven by `attempt` is **identical** to today — only the
chrome around the image changes. Bump the transition from `400ms` to
`480ms` and switch easing to `cubic-bezier(0.16, 1, 0.3, 1)`.

**Important:** keep using `transform-origin: {focal.x}% {focal.y}%` —
the focal-point math from the spec is unchanged.

---

## Interactions & behavior (unchanged from current product, but motion specs updated)

| Event                       | Behavior                                                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Hover a tablet              | 160ms bg/box-shadow transition. Slight gold-ring glow. Text brightens.                                                         |
| Press a tablet              | `transform: translateY(1px)`. Shadow flips to inset (`--carved-in`).                                                           |
| Click wrong option          | Apply `.slate-tablet--wrong` to that button → triggers `rune-shake 220ms`. Image animates from current `scale()` to next zoom level over 480ms. Update `attempt`. |
| Click correct option        | Apply `.slate-tablet--correct` to the answer button → triggers `rune-pulse 360ms`. All options disable. Compute `pointsEarned` from `scoreFor(attempt)`. |
| Round resolves              | Result panel mounts with `rune-fade-up 260ms`. Image scales fully out to `scale(1)`.                                          |
| Click Next stone            | Round index increments OR phase becomes `end`.                                                                                 |
| Reach end                   | End screen mounts. Score display runs `rune-reveal 600ms`.                                                                     |
| Click back icon             | `window.confirm('Exit to menu? Your current saga will be lost.')` — only the confirm text changes ("saga" instead of "game").  |
| Mute toggle                 | Pressed icon goes to `--bone-quiet` color. No other change.                                                                    |

**No new accessibility regressions.** Keep all `aria-label`s and the `aria-pressed` on the mute button. Keep the keyboard focus rings on selects (use `:focus { outline: none; box-shadow: var(--carved-in), 0 0 0 1px rgba(74,103,65,0.6); }` — i.e. focus shows a moss outline ring instead of a default blue).

## Copy changes (full list)

| Surface                     | Was                                                              | Now                                                              |
| --------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Start title                 | "Viking Image Guessing Game"                                     | "Viking Image Guessing"                                          |
| Start subtitle              | "Guess the viking object before the image zooms out. Three chances per round." | "Three chances per round. Read the stones."           |
| Start field labels          | "Rounds", "Answer choices", "Language"                           | "Rounds", "Choices", "Tongue"                                    |
| Start round options         | "5", "10", "15"                                                  | "V · 5", "X · 10", "XV · 15"                                     |
| Start choice options        | "3", "4", "5", "6"                                               | "III · 3", "IV · 4", "V · 5", "VI · 6"                           |
| Start language options      | "English", "Old Norse (hard)"                                    | "English", "Old Norse"                                           |
| Start capped note           | "Only N items available — that's how many rounds you'll play."   | "Only N relics catalogued — that's how many rounds you'll play." |
| Start CTA                   | "Begin"                                                          | "Begin the saga"                                                 |
| Game hint (new)             | _none_                                                           | Three rotating italic captions per attempt — see Game screen.    |
| Game result win             | "Correct! +N"                                                    | "Correct · +N"                                                   |
| Game result loss            | "Out of guesses. It was a {name}."                               | "Out of guesses" (verdict) + "It was a {name}. {description}" (body) |
| Game next CTA               | "Next" / "See results"                                           | "Next stone" / "See results"                                     |
| Game exit confirm           | "Exit to menu? Your current game will be lost."                  | "Exit to menu? Your current saga will be lost."                  |
| End title                   | "Skál!"                                                          | "Skál!" (unchanged but bigger)                                   |
| End subline                 | "N of M correct"                                                 | "N of M relics named correctly."                                 |
| End verdict (new)           | _none_                                                           | Four-tier italic verdict — see End screen.                       |
| End CTA                     | "Play again"                                                     | "Play again" (unchanged)                                         |
| Footer                      | "Made by Teddy B. All rights reserved."                          | "MADE BY TEDDY B · ALL RIGHTS RESERVED" — Cinzel 11px uppercase, letter-spacing 0.2em, color `--bone-quiet`. |

## State management

**No changes.** Continue with the existing `$state`-based store in
`App.svelte` (`phase`, `manifest`, `lastConfig`, `game`). The
component prop signatures stay the same. The game logic (`buildRounds`,
`pickDistractors`, `scoreFor`, `shuffle`) in `src/lib/game.ts` is
unchanged — re-run `npm run test` after the visual update and confirm
all existing tests still pass.

## Design tokens (quick reference)

**Colors:**
- Slate: `#16140f` `#1a1814` `#2a2822` `#3a3833`
- Bone: `#c8c1a8` `#b2ab94` `#6e6850`
- Moss: `#4a6741` `#5a7a4e` `#324327`
- Blood: `#8b1f1f` `#6a1717`
- Gold: `#c8a44c` (attempt dots only, sparingly)

**Type:**
- Display: **Cinzel** 500/600/700 — every heading + every button label.
- Body: **Inter** 400/600/700 — descriptions, hint captions, sublines.
- Cinzel sizes used: 11 / 12 / 13 / 15 / 16 / 17 / 18 / 22 / 38 / 44 / 56 / 88.
- Inter sizes used: 13 / 14 / 15 / 16.

**Spacing scale (4pt):** 4 · 8 · 12 · 16 · 18 · 20 · 22 · 24 · 28 · 32 · 44.

**Radius:** 2px everywhere.

**Shadows:** two carved-relief stacks (`--carved-out`, `--carved-in`) and two drop shadows (`--drop`, `--drop-lg`). Compose by appending custom layers — see `runestone.css` for every exact stack used.

**Motion:**
- 160ms hover, ease.
- 220ms wrong-shake, ease-in-out.
- 260ms result fade-up, ease-out.
- 360ms correct pulse, ease-out.
- 480ms image zoom, cubic-bezier(0.16, 1, 0.3, 1).
- 600ms end-screen score reveal, ease-out.

## Assets

- **Fonts:** Cinzel + Inter, loaded from Google Fonts via the existing `@import` in `theme.css`. No font files to ship.
- **Icons:** Three Material-derived inline SVGs already present in the codebase (back arrow + speaker-on + speaker-off). Keep them inline; just change their CSS color via `currentColor`.
- **Rune glyphs:** Unicode characters in the Cinzel fallback chain. No font asset required — they render as serif glyphs at small size with the carved text-shadow, which reads as faintly weathered. Strings used:
  - Top band (game screen): `ᚦᚨᛞᛚᚱᛏᛒᚢᛜ`
  - Bottom band (game screen): `ᛟᛗᚲᛇᚷᛁᛉᚹᛊ`
  - Short band (start + end screens): `ᚱᛏᛒ`
- **Object photos:** All 28 PNGs in `public/images/**` are unchanged. Keep as-is.
- **Body chisel-strike texture:** SVG noise filter inlined as a data URI in `body::before` (see "Page background"). No external file.

## Files in this bundle

```
design_handoff_runestone/
├── README.md                       ← this file
└── reference/
    ├── Runestone.html              ← the working prototype (open in a browser)
    ├── runestone.css               ← every CSS rule used; the canonical visual reference
    ├── colors_and_type.css         ← upstream design-system tokens that runestone.css extends
    ├── RuneCommon.jsx              ← runic strings, icons, dots helper, StoneAperture component
    ├── RuneStart.jsx               ← start screen
    ├── RuneGame.jsx                ← game screen (header, image, options, result)
    ├── RuneEnd.jsx                 ← end screen
    ├── vikings.sample.js           ← small in-memory subset of the real manifest
    └── assets/image-placeholder.svg ← onerror fallback (already mirrors public/images/placeholder.svg)
```

To see the design behavior live, open `reference/Runestone.html` in a
browser. It runs entirely client-side, no build step needed.

## Acceptance checklist

- [ ] `npm run test` still passes — no game-logic edits leaked in.
- [ ] Start screen matches the layout + copy spec; selects show roman-numeral options; Begin says "Begin the saga".
- [ ] Game header shows round/score/dots/icons on one line, with dots in moss green and Cinzel typography.
- [ ] Image sits in a chiseled stone aperture with two runic bands and corner moss glow.
- [ ] Wrong guess triggers shake on the offending button and zooms the image out over 480ms.
- [ ] Correct guess triggers the moss pulse and reveals the result panel with `rune-fade-up`.
- [ ] Result panel has a 4px left border (moss when won, blood when lost), Cinzel verdict, Inter body, right-aligned moss CTA.
- [ ] Per-attempt hint captions appear under the options when pending.
- [ ] End screen renders "Skál!" + a large carved score with the `/ N` half dimmed, plus the four-tier verdict.
- [ ] Hover, press, focus, disabled states all match `runestone.css`.
- [ ] No emoji introduced anywhere.
- [ ] On mobile (≤700px), the game body collapses to a single column.
