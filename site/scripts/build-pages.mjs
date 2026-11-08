// GitHub Pages uchun statik build.
// Server qismlari (Payload, /admin, API, eski ko‘p tilli sayt, middleware) build vaqtida
// vaqtincha chetlatiladi va tugagach qaytariladi. Natija: ./out papkasi.
import { execSync } from 'node:child_process'
import { existsSync, renameSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const moves = [
  [join(root, 'src/app/(payload)'), join(root, 'src/app/_payload-off')],
  [join(root, 'src/app/(frontend)'), join(root, 'src/app/_frontend-off')],
  [join(root, 'src/proxy.ts'), join(root, 'src/_proxy-off.ts')],
]

const restore = () => {
  for (const [from, to] of moves) {
    if (existsSync(to) && !existsSync(from)) renameSync(to, from)
  }
}

process.on('SIGINT', () => {
  restore()
  process.exit(1)
})

try {
  for (const [from, to] of moves) {
    if (existsSync(from)) renameSync(from, to)
  }
  rmSync(join(root, 'out'), { recursive: true, force: true })
  rmSync(join(root, '.next'), { recursive: true, force: true }) // eski dev tiplari tip-tekshiruvni buzmasin
  execSync('npx next build', {
    stdio: 'inherit',
    env: { ...process.env, PAGES_BUILD: '1' },
  })
  console.log('Pages build tayyor: out/')
} finally {
  restore()
}
