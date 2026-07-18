import { createCanvas, loadImage, registerFont  } from 'canvas'
import fs from 'fs'
import path from 'path'

export async function generateSeasonalImage({
  business,
  tagline,
  backgroundUrl,
  seasonalType
}) {
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
  ctx.font = 'bold 52px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(businessName, width / 2, 90)

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

  // Greeting
  ctx.font = '100px Caveat'
  // ctx.font = '60px "Caveat"'
  ctx.textAlign = 'center'
  ctx.fillText(greeting, width / 2, 350)

  // Description (multi-line)
  ctx.font = 'bold italic 40px Times New Roman'
  ctx.textAlign = 'center'
  wrapText(ctx, tagline, width / 2, 520, 900, 40)

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

    contactInfo.forEach((info) => {
      wrapTextCenter(ctx, info, width / 2, currentY, 1000, 20)
      currentY += 25
    })
  }

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