import type { MediaDoc } from './types'

// Payload upload maydoni: obyekt yoki id bo‘lishi mumkin (depth=0 bo‘lsa).
export function mediaUrl(media: MediaDoc | number | null | undefined, size?: 'card' | 'full'): string | null {
  if (!media || typeof media !== 'object') return null
  if (size && media.sizes?.[size]?.url) return media.sizes[size]!.url!
  return media.url ?? null
}
