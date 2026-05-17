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
    if (confirm('Exit to menu? Your current saga will be lost.')) {
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

  function tabletClass(option: VikingThing): string {
    if ((round.result === 'won' || round.result === 'lost') && option.id === round.answer.id) {
      return 'slate-tablet slate-tablet--correct';
    }
    if (round.picked.includes(option.id)) {
      return 'slate-tablet slate-tablet--wrong';
    }
    return 'slate-tablet';
  }

  function isDisabled(option: VikingThing): boolean {
    if (round.result !== 'pending') return true;
    return round.picked.includes(option.id);
  }

  const attemptDots = $derived(
    (() => {
      const used = round.result === 'pending' ? round.attempt - 1 : round.attempt;
      return [1, 2, 3].map((n) => (n <= used ? '●' : '○')).join('');
    })(),
  );

  const hint = $derived(
    round.attempt === 1
      ? 'A first guess scores the most. Be sure of it.'
      : round.attempt === 2
        ? 'Each wrong stroke widens the view.'
        : 'One stone remains. Strike true.',
  );
</script>

<section class="game">
  <header class="rune-header">
    <span class="rune-stat">Round {roundNumber} / {totalRounds}</span>
    <span class="rune-stat">Score: {totalScore}</span>
    <span class="rune-dots" aria-label="Attempts used">{attemptDots}</span>
    <button type="button" class="icon-tablet" aria-label="Exit to menu" onclick={handleExit}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          fill="currentColor"
          d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
        />
      </svg>
    </button>
    <button
      type="button"
      class="icon-tablet"
      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
      aria-pressed={muted}
      onclick={toggleMute}
    >
      {#if muted}
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M3 9v6h4l5 5V4L7 9H3zm13.59 3L19 9.41 17.59 8 15 10.59 12.41 8 11 9.41 13.59 12 11 14.59 12.41 16 15 13.41 17.59 16 19 14.59 16.59 12z"
          />
        </svg>
      {:else}
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05c1.48-.71 2.5-2.22 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
          />
        </svg>
      {/if}
    </button>
  </header>

  <div class="rune-grid">
    {#key round.answer.id}
      <ZoomedImage
        src={imageUrl(round.answer)}
        alt="Zoomed viking item — guess what it is"
        attempt={round.attempt}
        focal={round.focal}
        revealed={round.result !== 'pending'}
      />
    {/key}

    <div class="answer-col">
      <div class="rune-options">
        {#each round.options as option (option.id)}
          <button
            type="button"
            class={tabletClass(option)}
            disabled={isDisabled(option)}
            onclick={() => onGuess(option)}
          >
            {displayName(option)}
          </button>
        {/each}
      </div>

      {#if round.result === 'pending'}
        <p class="rune-caption hint">{hint}</p>
      {:else}
        <div class="rune-result {round.result === 'lost' ? 'rune-result--lost' : ''}">
          <div class="verdict">
            {#if round.result === 'won'}
              Correct · +{round.pointsEarned}
            {:else}
              Out of guesses
            {/if}
          </div>
          <p class="rune-body">
            {#if round.result === 'lost' && language === 'oldNorse'}
              It was a <em>{round.answer.oldNorse}</em> ({round.answer.name}). {round.answer.description}
            {:else if round.result === 'lost'}
              It was a <em>{round.answer.name}</em>. {round.answer.description}
            {:else}
              {round.answer.description}
            {/if}
          </p>
          <div class="next-row">
            <button class="slate-tablet slate-tablet--primary next-cta" onclick={handleNext}>
              {roundNumber < totalRounds ? 'Next stone' : 'See results'}
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
    gap: 18px;
  }
  .answer-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .hint {
    font-style: italic;
    padding: 0 4px;
  }
  .next-row {
    display: flex;
    justify-content: flex-end;
  }
  .next-cta {
    padding: 10px 22px;
    min-width: 140px;
    font-size: 14px;
  }
</style>
