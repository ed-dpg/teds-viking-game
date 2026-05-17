<script lang="ts">
  import type { Round } from '../lib/types';

  type Props = {
    rounds: Round[];
    totalScore: number;
    onPlayAgain: () => void;
  };

  let { rounds, totalScore, onPlayAgain }: Props = $props();

  const maxScore = $derived(rounds.length * 100);
  const correctCount = $derived(rounds.filter((r) => r.result === 'won').length);
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
