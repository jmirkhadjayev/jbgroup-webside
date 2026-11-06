import type { CollectionConfig } from 'payload'
import { adminOnly, publicRead } from '../access'

export const Services: CollectionConfig = {
  slug: 'services',
  access: { read: publicRead, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'order'] },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'text', type: 'textarea', required: true, localized: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
