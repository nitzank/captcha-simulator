const IMAGES = [
  '/placeholders/placeholder-1.webp',
  '/placeholders/placeholder-2.webp',
  '/placeholders/placeholder-3.webp',
  '/placeholders/placeholder-4.webp',
  '/placeholders/placeholder-5.webp',
  '/placeholders/placeholder-6.webp',
  '/placeholders/placeholder-7.webp',
  '/placeholders/placeholder-8.webp',
  '/placeholders/placeholder-9.webp',
  '/placeholders/placeholder-10.webp',
];

export function getDefaultImage(index: number): string {
  return IMAGES[index % IMAGES.length];
}
