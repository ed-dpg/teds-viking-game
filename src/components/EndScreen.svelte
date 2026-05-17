<script lang="ts">
  import type { Round } from '../lib/types';
  import { playClick } from '../lib/sound';

  type Props = {
    rounds: Round[];
    totalScore: number;
    onPlayAgain: () => void;
  };

  let { rounds, totalScore, onPlayAgain }: Props = $props();

  const maxScore = $derived(rounds.length * 100);
  const correctCount = $derived(rounds.filter((r) => r.result === 'won').length);
  const ratio = $derived(maxScore > 0 ? totalScore / maxScore : 0);
  const verdict = $derived(
    ratio >= 0.85
      ? 'A saga worth remembering.'
      : ratio >= 0.6
        ? 'A respectable tally.'
        : ratio >= 0.3
          ? 'The skald may yet polish your name.'
          : 'The longhouse hears no songs tonight.',
  );

  const RUNES_SHORT = 'ᚱᛏᛒ';

  function handlePlayAgain() {
    playClick();
    onPlayAgain();
  }
</script>

<section class="slate-panel end">
  <div class="runic-band runic-band--top short">{RUNES_SHORT}</div>

  <h1 class="rune-skal">Skál!</h1>

  <div class="rune-score-display">
    {totalScore} <span class="score-max">/ {maxScore}</span>
  </div>

  <p class="rune-body subline">{correctCount} of {rounds.length} relics named correctly.</p>

  <p class="rune-caption verdict">{verdict}</p>

  <button class="slate-tablet slate-tablet--primary play-again-cta" onclick={handlePlayAgain}>
    Play again
  </button>

  <div class="runic-band runic-band--bottom short">{RUNES_SHORT}</div>
</section>

<style>
  .end {
    display: grid;
    gap: 18px;
    justify-items: center;
    text-align: center;
    padding: 44px 32px 36px;
  }
  .runic-band.short {
    padding: 0;
  }
  .subline {
    font-size: 16px;
    margin: 0;
  }
  .verdict {
    font-style: italic;
    font-size: 14px;
    max-width: 480px;
  }
  .play-again-cta {
    padding: 14px 30px;
    min-width: 220px;
    margin-top: 8px;
    font-size: 15px;
  }
</style>
