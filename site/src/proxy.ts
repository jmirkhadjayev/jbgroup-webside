import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Payload admin (/admin) va API (/api) middleware dan tashqarida qoladi
  // "/" (asosiy sahifa) yo‘naltirilmaydi — to‘g‘ridan-to‘g‘ri variant sahifasi ochiladi
  matcher: ['/((?!api|admin|variant|_next|_vercel|.*\\..*).+)'],
}
