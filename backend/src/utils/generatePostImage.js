import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import path from 'path'

export async function generatePostImage({
  businessName,
  description,
  logoUrl,
  backgroundUrl,
}) {

  const width = 1080
  const height = 1080

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Background image
  const bg = await loadImage(backgroundUrl)
  ctx.drawImage(bg, 0, 0, width, height)

  // Dark overlay (opacity layer)
  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  ctx.fillRect(0, 0, width, height)

  // Logo (top-left corner)
  if (logoUrl) {
    const logo = await loadImage(logoUrl)
    console.log('logo dimensions:', logo.width, logo.height)
    ctx.drawImage(logo, 40, 40, 120, 120)
  }

  // Business Name
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 60px Arial'
  ctx.fillText(businessName, 40, 250)

  // Description (multi-line)
  ctx.font = '30px Arial'
  wrapText(ctx, description, 40, 320, 900, 40)

  // Convert to buffer
  const buffer = canvas.toBuffer('image/png')

  // Save file
  const fileName = `post-${Date.now()}.png`
  const filePath = path.join('uploads', fileName)

  fs.writeFileSync(filePath, buffer)

  return `/uploads/${fileName}`
}

// helper function
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y)
      line = words[n] + ' '
      y += lineHeight
    } else {
      line = testLine
    }
  }

  ctx.fillText(line, x, y)
}