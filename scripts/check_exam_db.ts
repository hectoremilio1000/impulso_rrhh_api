import 'reflect-metadata'
import { Ignitor } from '@adonisjs/core'

const APP_ROOT = new URL('../', import.meta.url)
const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

const ignitor = new Ignitor(APP_ROOT, { importer: IMPORTER })
const app = await ignitor.createApp('console')
app.booting(async () => {
  await import('#start/env')
})
await app.init()
await app.boot()

const { default: Database } = await import('@adonisjs/lucid/services/db')

const candidateId = Number(process.argv[2] || 0) || null
const whereClause = candidateId ? `WHERE candidate_id = ${candidateId}` : ''

const [psych] = await Database.rawQuery(`
  SELECT id, candidate_id, taken_at, score, passed,
         JSON_LENGTH(answers_json) AS answers_len,
         JSON_LENGTH(ai_report_json) AS report_len,
         answers_json, ai_report_json
  FROM psych_tests
  ${whereClause}
  ORDER BY id DESC
  LIMIT 5
`)

const [practical] = await Database.rawQuery(`
  SELECT id, candidate_id, taken_at, score, passed,
         JSON_LENGTH(answers_json) AS answers_len,
         JSON_LENGTH(ai_report_json) AS report_len,
         answers_json, ai_report_json
  FROM practical_tests
  ${whereClause}
  ORDER BY id DESC
  LIMIT 5
`)

console.log('psych_tests:', psych)
console.log('practical_tests:', practical)

await Database.manager.closeAll()
