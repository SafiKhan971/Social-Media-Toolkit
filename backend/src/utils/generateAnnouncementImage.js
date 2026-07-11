import { createCanvas, loadImage } from 'canvas'
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
  const bg = await loadImage(backgroundUrl)
  ctx.drawImage(bg, 0, 0, width, height)

  // Dark overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.60)'
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

  wrapText(ctx, description, width / 2, 450, 760, 56)

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
