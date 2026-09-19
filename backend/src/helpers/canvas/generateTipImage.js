import { createCanvas, loadImage } from 'canvas'
import { drawHeader } from './components/header.js'
import { drawBackground } from './components/background.js'
import { drawCTA } from './components/cta.js'
import { drawFooter } from './components/footer.js'
import { wrapText } from './utils/wrapText.js'
import fs from 'fs'
import path from 'path'

export async function generateTipImage({ business, description, backgroundUrl }) {
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

  // Tip
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold italic 56px Times New Roman'

  ctx.fillText('Tip of the Day', width / 2, 250)

  // Seperator line
  const y = 275

  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2

  // Left
  ctx.beginPath()
  ctx.moveTo(100, y)
  ctx.lineTo(width / 2 - 18, y)
  ctx.stroke()

  // Right
  ctx.beginPath()
  ctx.moveTo(width / 2 + 18, y)
  ctx.lineTo(width - 100, y)
  ctx.stroke()

  // Diamond
  ctx.save()
  ctx.translate(width / 2, y)
  ctx.rotate(Math.PI / 4)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(-6, -6, 12, 12)
  ctx.restore()

  // Description (multi-line)
  ctx.font = 'bold italic 40px Times New Roman'
  ctx.textAlign = 'center'
  await wrapText(ctx, description, width / 2, 420, 900, 40)

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
