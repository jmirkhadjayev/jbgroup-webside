import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Warehouses } from './payload/collections/Warehouses'
import { Services } from './payload/collections/Services'
import { Team } from './payload/collections/Team'
import { Tariffs } from './payload/collections/Tariffs'
import { Inquiries } from './payload/collections/Inquiries'
import { Settings } from './payload/globals/Settings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-only-secret-change-me',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Xususiy bojxona ombori' },
  },
  collections: [Users, Media, Warehouses, Services, Team, Tariffs, Inquiries],
  globals: [Settings],
  editor: lexicalEditor(),
  localization: {
    locales: [
      { label: 'O‘zbekcha', code: 'uz' },
      { label: 'Русский', code: 'ru' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'uz',
    fallback: true,
  },
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URL || 'file:./data/payload.db' },
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
