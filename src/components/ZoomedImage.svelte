<script lang="ts">
  import type { Attempt } from '../lib/types';

  type Props = {
    src: string;
    alt: string;
    attempt: Attempt;
    focal: { x: number; y: number };
    revealed?: boolean;
  };

  let { src, alt, attempt, focal, revealed = false }: Props = $props();

  const zoomByAttempt: Record<Attempt, number> = { 1: 4, 2: 2, 3: 1 };
  let scale = $derived(revealed ? 1 : zoomByAttempt[attempt]);

  const RUNES_TOP = 'ᚦᚨᛞᛚᚱᛏᛒᚢᛜ';
  const RUNES_BOTTOM = 'ᛟᛗᚲᛇᚷᛁᛉᚹᛊ';

  function handleError(e: Event) {
    const img = e.currentTarget as HTMLImageElement;
    img.src = `${import.meta.env.BASE_URL}images/placeholder.svg`;
  }
</script>

<div class="stone-aperture">
  <div class="runic-band runic-band--top">{RUNES_TOP}</div>
  <div class="stone-window">
    <img
      {src}
      {alt}
      onerror={handleError}
      style:transform-origin="{focal.x}% {focal.y}%"
      style:transform="scale({scale})"
    />
    <div class="vignette"></div>
    <div class="corner-moss bl"></div>
    <div class="corner-moss tr"></div>
  </div>
  <div class="runic-band runic-band--bottom">{RUNES_BOTTOM}</div>
</div>
