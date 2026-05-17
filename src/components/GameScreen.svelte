<script lang="ts">
  import type { Language, Round, VikingThing } from '../lib/types';
  import { imageUrl } from '../lib/manifest';
  import { isMuted, playClick, setMuted } from '../lib/sound';
  import ZoomedImage from './ZoomedImage.svelte';

  type Props = {
    round: Round;
    roundNumber: number;
    totalRounds: number;
    totalScore: number;
    language: Language;
    onGuess: (option: VikingThing) => void;
    onNext: () => void;
    onExit: () => void;
  };

  let { round, roundNumber, totalRounds, totalScore, language, onGuess, onNext, onExit }: Props = $props();

  let muted = $state(isMuted());

  function toggleMute() {
    muted = !muted;
    setMuted(muted);
    playClick();
  }

  function handleExit() {
    playClick();
    if (confirm('Exit to menu? Your current game will be lost.')) {
      onExit();
    }
  }

  function handleNext() {
    playClick();
    onNext();
  }

  function displayName(thing: VikingThing): string {
    return language === 'oldNorse' ? thing.oldNorse : thing.name;
  }

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
      .map((n) =>
        n <= round.attempt - 1 || (round.result !== 'pending' && n <= round.attempt) ? '●' : '○',
      )
      .join(''),
  );
</script>

<section class="game">
  <header>
    <span class="counter">Round {roundNumber} / {totalRounds}</span>
    <span class="score">Score: {totalScore}</span>
    <span class="attempts" aria-label="Attempts used">{attemptDots}</span>
    <button type="button" class="icon-btn" aria-label="Exit to menu" onclick={handleExit}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          fill="currentColor"
          d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
        />
      </svg>
    </button>
    <button
      type="button"
      class="icon-btn"
      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
      aria-pressed={muted}
      onclick={toggleMute}
    >
      {#if muted}
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M3 9v6h4l5 5V4L7 9H3zm13.59 3L19 9.41 17.59 8 15 10.59 12.41 8 11 9.41 13.59 12 11 14.59 12.41 16 15 13.41 17.59 16 19 14.59 16.59 12z"
          />
        </svg>
      {:else}
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05c1.48-.71 2.5-2.22 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
          />
        </svg>
      {/if}
    </button>
  </header>

  <div class="game-body">
    <div class="image-col">
      {#key round.answer.id}
        <ZoomedImage
          src={imageUrl(round.answer)}
          alt="Zoomed viking item — guess what it is"
          attempt={round.attempt}
          focal={round.focal}
          revealed={round.result !== 'pending'}
        />
      {/key}
    </div>

    <div class="answer-col">
      <div class="options">
        {#each round.options as option (option.id)}
          <button
            class={buttonClass(option)}
            disabled={isDisabled(option)}
            onclick={() => onGuess(option)}
          >
            {displayName(option)}
          </button>
        {/each}
      </div>

      {#if round.result !== 'pending'}
        <div class="result panel">
          <p class="result-line">
            {#if round.result === 'won'}
              <strong>Correct!</strong> +{round.pointsEarned}
            {:else if language === 'oldNorse'}
              <strong>Out of guesses.</strong> It was a <em>{round.answer.oldNorse}</em>.
            {:else}
              <strong>Out of guesses.</strong> It was a <em>{round.answer.name}</em>.
            {/if}
          </p>
          {#if language === 'oldNorse'}
            <p class="english-name">{round.answer.name}</p>
          {/if}
          <p class="description">{round.answer.description}</p>
          <div class="result-actions">
            <button class="primary" onclick={handleNext}>
              {roundNumber < totalRounds ? 'Next' : 'See results'}
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
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
  button.icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--radius);
    color: var(--bg-parchment);
    line-height: 0;
  }
  button.icon-btn:hover:not(:disabled) {
    background: transparent;
    border-color: var(--gold);
    color: var(--gold);
    transform: none;
  }
  button.icon-btn[aria-pressed='true'] {
    color: var(--iron);
  }
  .game-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    gap: 1.25rem;
    align-items: start;
  }
  @media (max-width: 640px) {
    .game-body {
      grid-template-columns: 1fr;
    }
  }
  .answer-col {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  @media (max-width: 380px) {
    .options {
      grid-template-columns: 1fr;
    }
  }
  .result {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .result-line {
    margin: 0;
  }
  .english-name {
    margin: 0;
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--ink);
  }
  .description {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--ink);
  }
  .result-actions {
    display: flex;
    justify-content: flex-end;
  }
  button.primary {
    background: var(--gold);
    border-color: var(--gold);
    color: var(--ink);
    font-weight: 700;
  }
</style>
