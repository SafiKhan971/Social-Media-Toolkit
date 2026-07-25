import { createCanvas, loadImage } from 'canvas'
import { drawHeader } from './components/header.js'
import { drawBackground } from './components/background.js'
import { drawCTA } from './components/cta.js'
import { drawFooter } from './components/footer.js'
import { wrapText } from './utils/wrapText.js'
import fs from 'fs'
import path from 'path'

export async function generateQuoteImage({ business, description, backgroundUrl }) {
  const businessName = business.name
  const logoUrl = business?.logo ? path.join(process.cwd(), business.logo.replace(/^\//, '')) : null

  const width = 1080
  const height = 1080

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Background
  await drawBackground(ctx, backgroundUrl, width, height)

  // Header
  await drawHeader(ctx, businessName, logoUrl, width)

  // Description (multi-line)
  ctx.font = 'bold italic 40px Times New Roman'
  ctx.textAlign = 'center'
  wrapText(ctx, description, width / 2, 320, 900, 40)

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

