import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import path from 'path'

export async function generatePackagePostImage({
  businessName,
  tagline,
  packageData,
  logoUrl,
  backgroundUrl,
}) {
  const width = 1080
  const height = 1080

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Background
  const bg = await loadImage(backgroundUrl)
  ctx.drawImage(bg, 0, 0, width, height)

  // Dark overlay
  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  ctx.fillRect(0, 0, width, height)

  // Logo
  if (logoUrl) {
    const logo = await loadImage(logoUrl)
    ctx.drawImage(logo, 40, 40, 110, 110)
  }

  // Business name
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 52px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(businessName, width / 2, 90)

  // Tagline
  if (tagline) {
    ctx.font = '28px Arial'
    ctx.fillStyle = '#f5f5f5'
    wrapTextCenter(ctx, tagline, width / 2, 135, 700, 36)
  }

  // White Card
  drawRoundedRect(ctx, 170, 230, 740, 620, 24)

  ctx.fillStyle = '#ffffff'
  ctx.fill()

  // Package Title
  ctx.textAlign = 'center'
  ctx.fillStyle = '#222222'
  ctx.font = 'bold 48px Arial'

  ctx.fillText(packageData.title, width / 2, 310)

  // Price
  ctx.fillStyle = '#0f766e'
  ctx.font = 'bold 64px Arial'

  ctx.fillText(`$${packageData.price}`, width / 2, 390)

  // Divider
  ctx.strokeStyle = '#dddddd'
  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.moveTo(250, 430)
  ctx.lineTo(830, 430)
  ctx.stroke()

  // Services heading
  ctx.textAlign = 'left'
  ctx.fillStyle = '#222222'
  ctx.font = 'bold 34px Arial'

  ctx.fillText('Included Services', 240, 490)

  // Services
  ctx.font = '28px Arial'

  let y = 540

  packageData.services.forEach((service) => {
    ctx.fillStyle = '#0f766e'
    ctx.fillText('✓', 240, y)

    ctx.fillStyle = '#333333'
    wrapText(ctx, service, 280, y, 520, 34)

    y += 50
  })

  // Bottom Call To Action
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 36px Arial'

  ctx.fillText('Book Now', width / 2, 980)

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
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  )

  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)

  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)

  ctx.closePath()
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' '
    const width = ctx.measureText(testLine).width

    if (width > maxWidth && i > 0) {
      ctx.fillText(line, x, y)
      line = words[i] + ' '
      y += lineHeight
    } else {
      line = testLine
    }
  }

  ctx.fillText(line, x, y)
}

function wrapTextCenter(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' '
    const width = ctx.measureText(testLine).width

    if (width > maxWidth && i > 0) {
      ctx.fillText(line, x, y)
      line = words[i] + ' '
      y += lineHeight
    } else {
      line = testLine
    }
  }

  ctx.fillText(line, x, y)
}