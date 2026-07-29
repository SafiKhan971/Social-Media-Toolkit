import { createCanvas, loadImage } from 'canvas'
import { drawHeader } from './components/header.js'
import { drawBackground } from './components/background.js'
import { drawCTA } from './components/cta.js'
import { drawFooter } from './components/footer.js'
import { wrapText } from './utils/wrapText.js'
import { wrapTextCenter } from './utils/wrapTextCenter.js'
import fs from 'fs'
import path from 'path'

export async function generateExternalImage({ business, description, backgroundUrl }) {
  const businessName = business.name
  const logoUrl = business?.logo ? path.join(process.cwd(), business.logo.replace(/^\//, '')) : null

  const width = 1080
  const height = 1080

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Background
  const bg = await loadImage(backgroundUrl)
  ctx.drawImage(bg, 0, 0, width, height)

  // Header
  await drawHeader(ctx, businessName, logoUrl, width)

  // CTA
  drawCTA(ctx, 'Contact Us', width)

  // Footer
  drawFooter(ctx, business, width)

  // Convert to buffer
  const buffer = canvas.toBuffer('image/png')

  // Save file
  const fileName = `post-${Date.now()}.png`
  const filePath = path.join('uploads', fileName)

  fs.writeFileSync(filePath, buffer)

  return `/uploads/${fileName}`
}
