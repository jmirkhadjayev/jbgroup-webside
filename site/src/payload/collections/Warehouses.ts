import type { CollectionConfig } from 'payload'
import { adminOnly, publicRead } from '../access'

export const Warehouses: CollectionConfig = {
  slug: 'warehouses',
  access: { read: publicRead, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'area', 'order'] },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'type', type: 'text', localized: true },
    { name: 'area', type: 'number', required: true, admin: { description: 'm²' } },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
