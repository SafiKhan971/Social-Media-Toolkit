import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import path from 'path'

export async function generateBeforeAfterImage({ business, description, backgroundUrl, beforeImage, afterImage }) {
  const businessName = business.name
  const logoUrl = business?.logo ? path.join(process.cwd(), business.logo.replace(/^\//, '')) : null
  const beforeImageUrl = beforeImage?.path ? path.join(process.cwd(), beforeImage.path.replace(/^\//, '')) : null
  const afterImageUrl = afterImage?.path ? path.join(process.cwd(), afterImage.path.replace(/^\//, '')) : null
  const phones = business.phones || []
  const website = business.website || ''
  const email = business.email || ''
  const officeAddress = business.officeAddress || ''

  console.log('beforeImage', beforeImageUrl)
  console.log('afterImage', afterImageUrl)

  const width = 1080
  const height = 1080

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Background
  // const bg = await loadImage(backgroundUrl)
  // ctx.drawImage(bg, 0, 0, width, height)

  // Dark overlay
  // ctx.fillStyle = 'rgba(0, 0, 0, 0.60)'
  // ctx.fillRect(0, 0, width, height)

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

  // Heading
  ctx.fillStyle = '#FFC107'
  ctx.font = 'bold 34px Arial'
  ctx.fillText('Before & After', width / 2, 350)

  // Divider
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.moveTo(80, 190)
  ctx.lineTo(1000, 190)
  ctx.stroke()

  const beforeX = 80
  const beforeY = 240
  const imageWidth = 420
  const imageHeight = 600

  const afterX = 580
  const afterY = 240

  // Vertical Divider
  ctx.strokeStyle = 'rgba(255,255,255,.4)'
  ctx.lineWidth = 3

  ctx.beginPath()
  ctx.moveTo(540, 220)
  ctx.lineTo(540, 860)
  ctx.stroke()

  // Label "BEFORE"
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 38px Arial'
  ctx.fillText('BEFORE', 290, 220)

  // Label "AFTER"
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 38px Arial'
  ctx.fillText('AFTER', 790, 220)


  // Draw the before and after images with rounded corners
  function drawCoverImage(ctx, image, x, y, w, h) {
    const imgRatio = image.width / image.height
    const boxRatio = w / h

    let sx = 0
    let sy = 0
    let sw = image.width
    let sh = image.height

    if (imgRatio > boxRatio) {
      sw = image.height * boxRatio
      sx = (image.width - sw) / 2
    } else {
      sh = image.width / boxRatio
      sy = (image.height - sh) / 2
    }

    drawRoundedRect(ctx, x, y, w, h, 20)

    ctx.save()
    ctx.clip()

    ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h)

    ctx.restore()
  }

  // Draw the before and after images if they exist
  if (beforeImageUrl && fs.existsSync(beforeImageUrl)) {
    const img = await loadImage(beforeImageUrl)
    drawCoverImage(ctx, img, beforeX, beforeY, imageWidth, imageHeight)
  }

  if (afterImageUrl && fs.existsSync(afterImageUrl)) {
    const img = await loadImage(afterImageUrl)
    drawCoverImage(ctx, img, afterX, afterY, imageWidth, imageHeight)
  }

  // Description
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 36px Arial'

  ctx.fillText('See the Amazing Transformation!', width / 2, 930)

  // Bottom Call To Action
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 36px Arial'

  ctx.fillText('Book Now', width / 2, 900)

  // Footer with contact information
  const footerY = 950
  const contactInfo = []

  if (phones && phones.length > 0) {
    contactInfo.push(`📞 ${phones.join(', ')}`)
  }

  if (website) {
    contactInfo.push(`🌐 ${website}`)
  }

  if (email) {
    contactInfo.push(`✉️ ${email}`)
  }

  if (officeAddress) {
    contactInfo.push(`📍 ${officeAddress}`)
  }

  if (contactInfo.length > 0) {
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffffff'
    ctx.font = '18px Arial'
    let currentY = footerY

    contactInfo.forEach(info => {
      wrapTextCenter(ctx, info, width / 2, currentY, 1000, 20)
      currentY += 25
    })
  }

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
