import type { CollectionConfig } from 'payload'
import { adminOnly, publicCreate } from '../access'

// Saytdagi "Xabar qoldiring" formasidan kelgan so‘rovlar
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  access: {
    create: publicCreate,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'phone', 'createdAt'] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'message', type: 'textarea' },
  ],
}
