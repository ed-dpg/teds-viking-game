<script lang="ts">
  import type { GameConfig, Language } from '../lib/types';
  import { playClick } from '../lib/sound';

  type Props = {
    initialConfig: GameConfig;
    manifestSize: number;
    onBegin: (config: GameConfig) => void;
  };

  let { initialConfig, manifestSize, onBegin }: Props = $props();

  // svelte-ignore state_referenced_locally
  let roundCount = $state(initialConfig.roundCount);
  // svelte-ignore state_referenced_locally
  let optionCount = $state(initialConfig.optionCount);
  // svelte-ignore state_referenced_locally
  let language = $state<Language>(initialConfig.language);

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

  <label>
    Language
    <select bind:value={language}>
      <option value="english">English</option>
      <option value="oldNorse">Old Norse (hard)</option>
    </select>
  </label>

  {#if cappedNote}
    <p class="note">{cappedNote}</p>
  {/if}

  <button
    class="primary"
    onclick={() => {
      playClick();
      onBegin({ roundCount, optionCount, language });
    }}
  >
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
