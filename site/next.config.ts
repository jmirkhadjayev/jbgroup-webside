import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

// PAGES_BUILD=1 — GitHub Pages uchun statik eksport (Payload/server qismisiz)
const PAGES = process.env.PAGES_BUILD === '1'
// GitHub Pages: /jbgroup-webside (standart). Netlify va boshqa root domenlar: PAGES_BASE=root
const PAGES_BASE =
  process.env.PAGES_BASE === 'root' ? '' : (process.env.PAGES_BASE ?? '/jbgroup-webside')

// next-intl plagini @swc/core ni yuklaydi (Cloudflare build'da native fayl keshi xato beradi),
// statik Pages build'ga u kerak emas — shuning uchun faqat oddiy rejimda yuklanadi.
const withNextIntl = (config: NextConfig): NextConfig => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require('next-intl/plugin')
  const createNextIntlPlugin = mod.default ?? mod
  return createNextIntlPlugin('./src/i18n/request.ts')(config)
}

const baseConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

const pagesConfig: NextConfig = {
  ...baseConfig,
  output: 'export',
  ...(PAGES_BASE ? { basePath: PAGES_BASE } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: PAGES_BASE },
}

export default PAGES ? pagesConfig : withPayload(withNextIntl(baseConfig))
