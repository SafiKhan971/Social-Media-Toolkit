import { createCanvas, loadImage, registerFont } from 'canvas'
import { drawHeader } from './components/header.js'
import { drawBackground } from './components/background.js'
import { drawCTA } from './components/cta.js'
import { drawFooter } from './components/footer.js'
import { wrapText } from './utils/wrapText.js'
import { drawRoundedRect } from './utils/drawRoundedRect.js'
import fs from 'fs'
import path from 'path'

export async function generateSeasonalImage({ business, description, backgroundUrl, seasonalType }) {
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

  // ==============================
  // Seasonal Greeting & Description
  // ==============================

  // Helper function
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

  // ------------------------------
  // Greeting
  // ------------------------------

  ctx.textAlign = 'center'

  ctx.shadowColor = 'rgba(0,0,0,0.6)'
  ctx.shadowBlur = 20
  ctx.shadowOffsetY = 4

  ctx.fillStyle = '#FFD700'
  ctx.font = 'bold 90px Caveat'

  ctx.fillText(greeting, width / 2, 340)

  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  // Decorative divider

  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.moveTo(250, 375)
  ctx.lineTo(830, 375)
  ctx.stroke()

  // Decorative stars

  ctx.fillStyle = '#FFD700'
  ctx.font = '26px Arial'

  ctx.fillText('✦', 220, 382)
  ctx.fillText('✦', 860, 382)

  // ------------------------------
  // Description Card
  // ------------------------------

  ctx.font = 'italic 34px Georgia'

  const cardWidth = 860
  const maxTextWidth = cardWidth - 80
  const lineHeight = 42
  const paddingY = 35

  const lineCount = getLineCount(ctx, description, maxTextWidth)

  const cardHeight = lineCount * lineHeight + paddingY * 2

  const cardX = (width - cardWidth) / 2
  const cardY = 410

  // Glass Card

  drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 20)

  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.fill()

  ctx.strokeStyle = 'rgba(255,255,255,0.20)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Quote marks

  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.font = 'bold 70px Georgia'

  ctx.textAlign = 'left'
  ctx.fillText('“', cardX + 20, cardY + 60)

  ctx.textAlign = 'right'
  ctx.fillText('”', cardX + cardWidth - 20, cardY + cardHeight - 20)

  // Description

  ctx.textAlign = 'center'
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'italic 34px Georgia'

  ctx.shadowColor = 'rgba(0,0,0,0.45)'
  ctx.shadowBlur = 8
  ctx.shadowOffsetY = 2

  wrapText(ctx, description, width / 2, cardY + paddingY + 10, maxTextWidth, lineHeight)

  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0
  ctx.shadowColor = 'transparent'

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
