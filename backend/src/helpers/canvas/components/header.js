import { createCanvas, loadImage } from 'canvas'

export async function drawHeader(ctx, businessName, logoUrl, width) {
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
}
