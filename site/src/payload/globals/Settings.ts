import type { GlobalConfig } from 'payload'
import { adminOnly, publicRead } from '../access'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: { read: publicRead, update: adminOnly },
  fields: [
    { name: 'license', type: 'text', required: true, defaultValue: '[Litsenziya raqami]' },
    { name: 'address', type: 'text', required: true, localized: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'hours', type: 'text', localized: true },
    { name: 'mapQuery', type: 'text', defaultValue: '41.269669,69.324979' },
    {
      name: 'stats',
      type: 'group',
      fields: [
        { name: 'area', type: 'number', defaultValue: 12000, admin: { description: 'm² maydon (namuna)' } },
        { name: 'capacity', type: 'number', defaultValue: 5000, admin: { description: 'tonna sig‘im (namuna)' } },
        { name: 'years', type: 'number', defaultValue: 10, admin: { description: 'yil faoliyat (namuna)' } },
      ],
    },
  ],
}
