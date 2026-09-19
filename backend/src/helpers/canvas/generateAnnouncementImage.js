import { createCanvas, loadImage } from 'canvas'
import { drawHeader } from './components/header.js'
import { drawBackground } from './components/background.js'
import { drawCTA } from './components/cta.js'
import { drawFooter } from './components/footer.js'
import { wrapText } from './utils/wrapText.js'
import fs from 'fs'
import path from 'path'

export async function generateAnnouncementImage({ business, description, backgroundUrl }) {
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

  // Accouncement Icon
  ctx.font = '70px Arial'
  ctx.fillText('📢', width / 2, 250)

  // Heading
  ctx.fillStyle = '#FFC107'
  ctx.font = 'bold 58px Arial'
  ctx.fillText('ANNOUNCEMENT', width / 2, 350)

  // Seperator line
  ctx.strokeStyle = '#FFC107'
  ctx.lineWidth = 3

  ctx.beginPath()
  ctx.moveTo(260, 285)
  ctx.lineTo(820, 285)
  ctx.stroke()

  // Description (multi-line)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 44px Georgia'
  ctx.textAlign = 'center'

  await wrapText(ctx, description, width / 2, 450, 760, 56)

  // CTA
  drawCTA(ctx, 'Contact Us', width)

  // Footer
  drawFooter(ctx, business, width)

  // Save Image
  const buffer = canvas.toBuffer('image/png')

  const fileName = `package-${Date.now()}.png`
  const filePath = path.join('uploads', fileName)

  fs.writeFileSync(filePath, buffer)

  return `/uploads/${fileName}`
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath()

  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)

  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)

  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)

  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)

  ctx.closePath()
}
