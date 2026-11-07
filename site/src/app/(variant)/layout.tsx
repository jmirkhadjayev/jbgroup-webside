import type { Metadata } from 'next'
import SmoothScroll from '@/components/SmoothScroll'
// Shriftlar loyiha ichida (tarmoqqa bog‘liq emas): sarlavha — Playfair Display, matn — Manrope
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/600.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '../(frontend)/globals.css'
import './variant.css'

export const metadata: Metadata = {
  title: 'JB GROUP · Bojxona Ombori & Logistika Majmuasi',
  description: 'Xususiy bojxona ombori: bojxona nazorati ostida tovarlarni saqlash, qayta ishlash va jo‘natish.',
}

export default function VariantRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
