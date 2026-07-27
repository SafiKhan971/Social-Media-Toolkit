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
  // Logo (top-left corner)
  if (logoUrl) {
    const logo = await loadImage(logoUrl)
    console.log('logo dimensions:', logo.width, logo.height)
    ctx.drawImage(logo, 40, 40, 120, 120)
  }

  // Business Name
  ctx.fillStyle = '#000'
  ctx.font = 'bold 52px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(businessName, width / 2, 90)

  // CTA
  ctx.textAlign = "center"
  ctx.fillStyle = "#000"
  ctx.font = "bold 36px Arial"

  ctx.fillText("Contact Us", width / 2, 900)

  // Footer
  const info = []
  
    if (business.phones?.length)
      info.push(`📞 ${business.phones.join(", ")}`)
  
    if (business.website)
      info.push(`🌐 ${business.website}`)
  
    if (business.email)
      info.push(`✉️ ${business.email}`)
  
    if (business.officeAddress)
      info.push(`📍 ${business.officeAddress}`)
  
    ctx.fillStyle = "#000"
    ctx.font = "bold 22px Arial"
    ctx.textAlign = "center"
  
    let y = 950
  
    info.forEach((item) => {
      wrapTextCenter(ctx, item, 540, y, 1000, 20)
      y += 25
    })

  // Convert to buffer
  const buffer = canvas.toBuffer('image/png')

  // Save file
  const fileName = `post-${Date.now()}.png`
  const filePath = path.join('uploads', fileName)

  fs.writeFileSync(filePath, buffer)

  return `/uploads/${fileName}`
}

