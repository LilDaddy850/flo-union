import type { ImageMetadata } from 'astro';

const mods = import.meta.glob<{ default: ImageMetadata }>('/src/assets/photos/*.jpg', { eager: true });

export const photos: Record<string, ImageMetadata> = {};
for (const [path, mod] of Object.entries(mods)) {
  const stem = path.split('/').pop()!.replace(/\.jpg$/, '');
  photos[stem] = mod.default;
}

/** Look up a processed job photo by stem (e.g. "newbuild-04"). Throws at build time if missing. */
export function photo(stem: string): ImageMetadata {
  const p = photos[stem];
  if (!p) throw new Error(`Unknown photo "${stem}". Known: ${Object.keys(photos).sort().join(', ')}`);
  return p;
}
