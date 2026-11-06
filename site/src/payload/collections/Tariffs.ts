import type { CollectionConfig } from 'payload'
import { adminOnly, publicRead } from '../access'

export const Tariffs: CollectionConfig = {
  slug: 'tariffs',
  access: { read: publicRead, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'date', 'order'] },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'date', type: 'text', admin: { description: 'Masalan: 2026-01-01' } },
    { name: 'file', type: 'upload', relationTo: 'media', required: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
