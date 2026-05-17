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

  function handleError(e: Event) {
    const img = e.currentTarget as HTMLImageElement;
    img.src = `${import.meta.env.BASE_URL}images/placeholder.svg`;
  }
</script>

<div class="frame">
  <img
    {src}
    {alt}
    onerror={handleError}
    style:transform-origin="{focal.x}% {focal.y}%"
    style:transform="scale({scale})"
  />
</div>

<style>
  .frame {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    background: #000;
    border-radius: var(--radius);
    border: 2px solid var(--gold);
    box-shadow: 0 0 0 6px var(--bg-wood), var(--shadow-card);
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 400ms ease-out;
    will-change: transform;
  }
</style>
