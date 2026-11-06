import type { Access } from 'payload'

// Hamma o‘qiy oladi (sayt ochiq), faqat tizimga kirgan admin yozadi.
export const publicRead: Access = () => true
export const adminOnly: Access = ({ req }) => Boolean(req.user)
// Ariza (inquiry) hamma yuborishi mumkin, lekin o‘qish faqat admin uchun.
export const publicCreate: Access = () => true
