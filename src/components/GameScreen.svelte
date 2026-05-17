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
  </header>

  <div class="game-body">
    <div class="image-col">
      <ZoomedImage
        src={imageUrl(round.answer)}
        alt="Zoomed viking item — guess what it is"
        attempt={round.attempt}
        focal={round.focal}
      />
    </div>

    <div class="answer-col">
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
          <p class="result-line">
            {#if round.result === 'won'}
              <strong>Correct!</strong> +{round.pointsEarned}
            {:else}
              <strong>Out of guesses.</strong> It was a <em>{round.answer.name}</em>.
            {/if}
          </p>
          <p class="description">{round.answer.description}</p>
          <div class="result-actions">
            <button class="primary" onclick={onNext}>
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
