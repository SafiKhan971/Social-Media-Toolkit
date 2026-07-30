import { createCanvas, loadImage } from 'canvas'
import { drawHeader } from './components/header.js'
import { drawBackground } from './components/background.js'
import { drawCTA } from './components/cta.js'
import { drawFooter } from './components/footer.js'
import { wrapText } from './utils/wrapText.js'
import { drawRoundedRect } from './utils/drawRoundedRect.js'
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

  function getLineCount(ctx, text, maxWidth) {
    const words = text.split(' ')
    let line = ''
    let lines = 1

    for (const word of words) {
      const testLine = line + word + ' '

      if (ctx.measureText(testLine).width > maxWidth && line) {
        lines++
        line = word + ' '
      } else {
        line = testLine
      }
    }

    return lines
  }

  // ============================
  // Quote Card
  // ============================

  function getLineCount(ctx, text, maxWidth) {
    const words = text.split(' ')
    let line = ''
    let lines = 1

    for (const word of words) {
      const testLine = line + word + ' '

      if (ctx.measureText(testLine).width > maxWidth && line !== '') {
        lines++
        line = word + ' '
      } else {
        line = testLine
      }
    }

    return lines
  }

  const quoteX = 140
  const quoteY = 170
  const quoteWidth = 800

  ctx.font = 'italic 34px Georgia'

  const maxWidth = quoteWidth - 120
  const lineHeight = 42
  const verticalPadding = 35

  const lineCount = getLineCount(ctx, description, maxWidth)

  const quoteHeight = lineCount * lineHeight + verticalPadding * 2

  // Draw Card
  drawRoundedRect(ctx, quoteX, quoteY, quoteWidth, quoteHeight, 18)

  ctx.fillStyle = 'rgba(0,0,0,0.55)'
  ctx.fill()

  ctx.strokeStyle = 'rgba(255,255,255,0.20)'
  ctx.lineWidth = 2
  ctx.stroke()

  // ============================
  // Quote Marks
  // ============================

  ctx.shadowColor = 'rgba(0,0,0,0.6)'
  ctx.shadowBlur = 8
  ctx.shadowOffsetY = 2

  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.font = 'bold 80px Georgia'

  // Opening quote
  ctx.textAlign = 'left'
  ctx.fillText('“', quoteX + 18, quoteY + 68)

  // Closing quote
  ctx.textAlign = 'right'
  ctx.fillText('”', quoteX + quoteWidth - 18, quoteY + quoteHeight - 18)

  // ============================
  // Quote Text
  // ============================

  ctx.fillStyle = '#fff'
  ctx.font = 'italic 34px Georgia'
  ctx.textAlign = 'center'

  await wrapText(ctx, description, width / 2, quoteY + verticalPadding + 12, maxWidth, lineHeight)

  // Remove shadow
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0
  ctx.shadowColor = 'transparent'

  // CTA
  drawCTA(ctx, 'Contact Us', width)

  // Footer
  await drawFooter(ctx, business, width)

  // Convert to buffer
  const buffer = canvas.toBuffer('image/png')

  // Save file
  const fileName = `post-${Date.now()}.png`
  const filePath = path.join('uploads', fileName)

  fs.writeFileSync(filePath, buffer)

  return `/uploads/${fileName}`
}


