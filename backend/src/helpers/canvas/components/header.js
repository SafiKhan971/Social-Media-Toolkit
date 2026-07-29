import { createCanvas, loadImage } from 'canvas'
import { getTextColor } from '../utils/getTextColor.js'


export async function drawHeader(ctx, businessName, logoUrl, width) {

  const ctaWidth = 300
  const ctaHeight = 70
  const ctaX = width / 2 - ctaWidth / 2
  const ctaY = 760
  
  const textColor = getTextColor(ctx, ctaX, ctaY, ctaWidth, ctaHeight)

  // Logo (top-left corner)
  if (logoUrl) {
    const logo = await loadImage(logoUrl)
    console.log('logo dimensions:', logo.width, logo.height)
    ctx.drawImage(logo, 40, 40, 120, 120)
  }

  // Business Name
  ctx.fillStyle = textColor
  ctx.font = 'bold 52px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(businessName, width / 2, 90)
}
