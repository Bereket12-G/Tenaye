import puppeteer from 'puppeteer'

const BASE = 'http://localhost:4173'
const shots = [
  { path: '/', file: 'landing.png' },
  { path: '/community', file: 'community.png' },
  { path: '/teams', file: 'teams.png' },
  { path: '/progress', file: 'progress.png' },
]

const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] })
const page = await browser.newPage()
page.setViewport({ width: 1366, height: 800 })

for (const s of shots) {
  await page.goto(BASE + s.path, { waitUntil: 'networkidle0' })
  await page.screenshot({ path: s.file, fullPage: true })
  console.log('Saved', s.file)
}

await browser.close()