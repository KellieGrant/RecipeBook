import { cpSync, mkdirSync, writeFileSync } from 'node:fs'

mkdirSync('dist/server', { recursive: true })
mkdirSync('dist/.openai', { recursive: true })

writeFileSync(
  'dist/server/index.js',
  `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request)
  }
}\n`,
)

cpSync('.openai/hosting.json', 'dist/.openai/hosting.json')
