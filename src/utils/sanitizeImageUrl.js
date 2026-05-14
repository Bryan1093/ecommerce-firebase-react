export const DEFAULT_IMAGE_PLACEHOLDER =
  'https://placehold.co/600x600/eef2ff/1f2937?text=Producto'

export const sanitizeImageUrl = (value, fallback = DEFAULT_IMAGE_PLACEHOLDER) => {
  const candidate = String(value || '').trim()

  if (!candidate) {
    return fallback
  }

  try {
    const parsed = new URL(candidate)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : fallback
  } catch {
    return fallback
  }
}
