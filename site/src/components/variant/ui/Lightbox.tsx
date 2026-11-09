'use client'

import Image from 'next/image'
import type { Dict } from '../i18n'

export type ZoomState = { src: string; alt: string } | null

// To‘liq ekranli rasm oynasi: yaqinlashtirish/kichraytirish, Escape yoki "×" bilan yopish
export function Lightbox({
  zoom,
  zoomed,
  onClose,
  onToggleZoom,
  t,
}: {
  zoom: NonNullable<ZoomState>
  zoomed: boolean
  onClose: () => void
  onToggleZoom: () => void
  t: Dict
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={zoom.alt}
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-navy/95 backdrop-blur-sm"
    >
      <div className="absolute left-4 top-4 z-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleZoom()
          }}
          className="h-10 rounded-full border border-paper/30 bg-paper/10 px-5 text-sm text-paper backdrop-blur-md transition-colors hover:border-gold hover:text-gold"
        >
          {zoomed ? t.ui.zoomOut : t.ui.zoomIn}
        </button>
      </div>
      <button
        type="button"
        aria-label={t.ui.close}
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 bg-paper/10 text-xl text-paper backdrop-blur-md transition-colors hover:border-gold hover:text-gold"
      >
        ×
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute inset-0 p-4 pt-20 md:p-10 md:pt-24 ${zoomed ? 'overflow-auto' : 'overflow-hidden'}`}
      >
        <div className={`relative mx-auto ${zoomed ? 'h-[200%] w-[200%]' : 'h-full w-full'}`}>
          <Image src={zoom.src} alt={zoom.alt} fill sizes="100vw" className="object-contain" />
        </div>
      </div>
    </div>
  )
}
