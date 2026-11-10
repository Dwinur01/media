import DOMPurify from 'dompurify'

/** Bersihkan SVG sebelum dipasang lewat dangerouslySetInnerHTML. */
export function sanitizeSvg(svg: string): string {
  return DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } })
}
