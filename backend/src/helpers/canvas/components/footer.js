import { wrapText } from '../utils/wrapText.js'
import { drawRoundedRect } from '../utils/drawRoundedRect.js'

export function drawFooter(ctx, business, width) {
  const cardWidth = 960
  const cardHeight = 90
  const cardX = (width - cardWidth) / 2
  const cardY = 920

  // Card
  drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 18)

  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.fill()

  ctx.strokeStyle = 'rgba(0,0,0,0.15)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Divider
  ctx.beginPath()
  ctx.moveTo(cardX + 300, cardY + 12)
  ctx.lineTo(cardX + 300, cardY + cardHeight - 12)
  ctx.strokeStyle = '#d8d8d8'
  ctx.stroke()

  ctx.fillStyle = '#222'
  ctx.textAlign = 'left'
  ctx.font = '18px Arial'

  // Left column (Phones)
  let phoneY = cardY + 30

  business.phones?.forEach(phone => {
    ctx.fillText(`📞 ${phone}`, cardX + 20, phoneY)
    phoneY += 24
  })

  // Right column (Website, Email, Address)
  let infoY = cardY + 25

  if (business.website) {
    ctx.fillText(`🌐 ${business.website}`, cardX + 325, infoY)
    infoY += 22
  }

  if (business.email) {
    ctx.fillText(`📧 ${business.email}`, cardX + 325, infoY)
    infoY += 22
  }

  if (business.officeAddress) {
    wrapText(ctx, `📍 ${business.officeAddress}`, cardX + 325, infoY, 610, 22)
  }
}
