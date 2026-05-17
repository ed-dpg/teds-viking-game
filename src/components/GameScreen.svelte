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
