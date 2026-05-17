import type { VikingThing } from './types';

export async function loadManifest(): Promise<VikingThing[]> {
  const url = `${import.meta.env.BASE_URL}vikings.json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load manifest: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Manifest is not an array');
  }
  return data as VikingThing[];
}

export function imageUrl(entry: VikingThing): string {
  return `${import.meta.env.BASE_URL}${entry.image}`;
}
