import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { withPayload } from '@payloadcms/next/withPayload'

// PAGES_BUILD=1 — GitHub Pages uchun statik eksport (Payload/server qismisiz)
const PAGES = process.env.PAGES_BUILD === '1'
const PAGES_BASE = '/webside-jbgroup'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const baseConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

const pagesConfig: NextConfig = {
  ...baseConfig,
  output: 'export',
  basePath: PAGES_BASE,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: PAGES_BASE },
}

export default PAGES ? pagesConfig : withPayload(withNextIntl(baseConfig))
