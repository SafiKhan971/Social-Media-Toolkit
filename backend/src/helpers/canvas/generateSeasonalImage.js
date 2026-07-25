import { createCanvas, loadImage, registerFont  } from 'canvas'
import { drawHeader } from './components/header.js'
import { drawBackground } from './components/background.js'
import { drawCTA } from './components/cta.js'
import { drawFooter } from './components/footer.js'
import { wrapText } from './utils/wrapText.js'
import fs from 'fs'
import path from 'path'

export async function generateSeasonalImage({
  business,
  description,
  backgroundUrl,
  seasonalType
}) {
  const businessName = business.name
  const logoUrl = business?.logo ? path.join(process.cwd(), business.logo.replace(/^\//, '')) : null
  const phones = business.phones || []
  const website = business.website || ''
  const email = business.email || ''
  const officeAddress = business.officeAddress || ''
  

  const width = 1080
  const height = 1080

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Background
  await drawBackground(ctx, backgroundUrl, width, height)

  // Header
  await drawHeader(ctx, businessName, logoUrl, width)

  // Greeting based on seasonal type
  let greeting = ''
  switch (seasonalType) {
    case 'christmas':
      greeting = 'Merry Christmas!'
      break
    case 'new_year':
      greeting = 'Happy New Year!'
      break
    case 'eid_mubarak':
      greeting = 'Eid Mubarak!'
      break
    case 'diwali':
      greeting = 'Happy Diwali!'
      break
    case 'independence_day':
      greeting = 'Happy Independance Day!'
      break
  }

  // Greeting
  ctx.font = '100px Caveat'
  // ctx.font = '60px "Caveat"'
  ctx.textAlign = 'center'
  ctx.fillText(greeting, width / 2, 350)

  // Description (multi-line)
  ctx.font = 'bold italic 40px Times New Roman'
  ctx.textAlign = 'center'
  await wrapText(ctx, description, width / 2, 520, 900, 40)

  // CTA
  drawCTA(ctx, 'Book Now', width)

  // Footer
  drawFooter(ctx, business)

  // Convert to buffer
  const buffer = canvas.toBuffer('image/png')

  // Save file
  const fileName = `post-${Date.now()}.png`
  const filePath = path.join('uploads', fileName)

  fs.writeFileSync(filePath, buffer)

  return `/uploads/${fileName}`
}