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
      ? `Only ${manifestSize} relics catalogued — that's how many rounds you'll play.`
      : '',
  );

  const RUNES_SHORT = 'ᚱᛏᛒ';
</script>

<section class="slate-panel start">
  <div class="runic-band runic-band--top short">{RUNES_SHORT}</div>

  <div class="title-block">
    <h1 class="rune-h1">Norse Mysteries</h1>
    <p class="rune-caption subtitle">Three chances per round. Read the stones.</p>
  </div>

  <div class="field-grid">
    <div class="rune-field">
      <label for="rounds">Rounds</label>
      <select id="rounds" class="rune-select" bind:value={roundCount}>
        <option value={5}>V · 5</option>
        <option value={10}>X · 10</option>
        <option value={15}>XV · 15</option>
      </select>
    </div>
    <div class="rune-field">
      <label for="choices">Choices</label>
      <select id="choices" class="rune-select" bind:value={optionCount}>
        <option value={3}>III · 3</option>
        <option value={4}>IV · 4</option>
        <option value={5}>V · 5</option>
        <option value={6}>VI · 6</option>
      </select>
    </div>
    <div class="rune-field">
      <label for="tongue">Tongue</label>
      <select id="tongue" class="rune-select" bind:value={language}>
        <option value="english">English</option>
        <option value="oldNorse">Old Norse</option>
      </select>
    </div>
  </div>

  {#if cappedNote}
    <p class="rune-caption capped-note">{cappedNote}</p>
  {/if}

  <button
    class="slate-tablet slate-tablet--primary begin-cta"
    onclick={() => {
      playClick();
      onBegin({ roundCount, optionCount, language });
    }}
  >
    Begin the saga
  </button>

  <div class="runic-band runic-band--bottom short">{RUNES_SHORT}</div>
</section>

<style>
  .start {
    display: grid;
    gap: 20px;
  }
  .runic-band.short {
    padding: 0;
  }
  .title-block {
    text-align: center;
    display: grid;
    gap: 8px;
  }
  .subtitle {
    font-size: 14px;
    letter-spacing: 0.08em;
  }
  .field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-top: 8px;
  }
  .capped-note {
    font-style: italic;
    text-align: center;
  }
  .begin-cta {
    font-size: 16px;
    padding: 16px 24px;
    justify-self: center;
    min-width: 220px;
  }
  @media (max-width: 540px) {
    .field-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
