<script lang="ts">
  import type { Game, GameConfig, VikingThing } from './lib/types';
  import { buildRounds, scoreFor } from './lib/game';
  import { loadManifest } from './lib/manifest';
  import { playClick, playCorrect, playWrong } from './lib/sound';
  import StartScreen from './components/StartScreen.svelte';
  import GameScreen from './components/GameScreen.svelte';
  import EndScreen from './components/EndScreen.svelte';

  type Phase = 'loading' | 'error' | 'start' | 'playing' | 'end';

  let phase = $state<Phase>('loading');
  let manifest = $state<VikingThing[]>([]);
  let loadError = $state<string>('');
  let lastConfig = $state<GameConfig>({ roundCount: 10, optionCount: 4, language: 'english' });
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
      playCorrect();
    } else {
      round.picked = [...round.picked, option.id];
      if (round.attempt === 3) {
        round.result = 'lost';
      } else {
        round.attempt = (round.attempt + 1) as 1 | 2 | 3;
      }
      playWrong();
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

<div class="rune-shell">
  {#if phase === 'loading'}
    <p class="rune-caption">Loading…</p>
  {:else if phase === 'error'}
    <section class="slate-panel">
      <h2 class="rune-h2">Could not load game</h2>
      <p class="rune-body">{loadError}</p>
      <button
        class="slate-tablet slate-tablet--primary"
        onclick={() => { playClick(); fetchManifest(); }}
      >Retry</button>
    </section>
  {:else if phase === 'start'}
    <StartScreen initialConfig={lastConfig} manifestSize={manifest.length} onBegin={beginGame} />
  {:else if phase === 'playing' && game}
    <GameScreen
      round={game.rounds[game.index]}
      roundNumber={game.index + 1}
      totalRounds={game.rounds.length}
      totalScore={game.totalScore}
      language={game.config.language}
      onGuess={handleGuess}
      onNext={handleNext}
      onExit={playAgain}
    />
  {:else if phase === 'end' && game}
    <EndScreen rounds={game.rounds} totalScore={game.totalScore} onPlayAgain={playAgain} />
  {/if}

  <footer class="rune-footer">MADE BY TEDDY B · ALL RIGHTS RESERVED</footer>
</div>
