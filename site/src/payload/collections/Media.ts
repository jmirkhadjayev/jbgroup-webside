import path from 'path'
import type { CollectionConfig } from 'payload'
import { adminOnly, publicRead } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: publicRead,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  upload: {
    staticDir: path.resolve(process.cwd(), 'media'),
    mimeTypes: [
      'image/*',
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    ],
    imageSizes: [
      { name: 'card', width: 900, height: 675, position: 'centre' },
      { name: 'full', width: 1600, position: 'centre' },
    ],
  },
  admin: { useAsTitle: 'filename' },
  fields: [{ name: 'alt', type: 'text', localized: true }],
}
