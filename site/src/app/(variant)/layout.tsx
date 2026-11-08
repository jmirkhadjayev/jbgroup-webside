import type { Metadata } from 'next'
import SmoothScroll from '@/components/SmoothScroll'
// Shrift loyiha ichida (tarmoqqa bog‘liq emas): Onest — barcha matn, sarlavha va raqamlar
import '@fontsource/onest/400.css'
import '@fontsource/onest/500.css'
import '@fontsource/onest/600.css'
import '@/styles/globals.css'
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
