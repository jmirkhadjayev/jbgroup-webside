import type { CollectionConfig } from 'payload'
import { adminOnly, publicRead } from '../access'

export const Team: CollectionConfig = {
  slug: 'team',
  access: { read: publicRead, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'role', 'order'] },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true, localized: true },
    { name: 'bio', type: 'textarea', localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
