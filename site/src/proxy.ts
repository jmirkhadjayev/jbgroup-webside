import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Payload admin (/admin) va API (/api) middleware dan tashqarida qoladi
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}
