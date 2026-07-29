import { wrapTextCenter } from '../utils/wrapTextCenter.js'
import { getTextColor } from '../utils/getTextColor.js'

export function drawFooter(ctx, business, width) {

  const ctaWidth = 300
  const ctaHeight = 70
  const ctaX = width / 2 - ctaWidth / 2
  const ctaY = 760
  
  const textColor = getTextColor(ctx, ctaX, ctaY, ctaWidth, ctaHeight)

  const info = []

  if (business.phones?.length) info.push(`📞 ${business.phones.join(', ')}`)

  if (business.website) info.push(`🌐 ${business.website}`)

  if (business.email) info.push(`✉️ ${business.email}`)

  if (business.officeAddress) info.push(`📍 ${business.officeAddress}`)

  ctx.fillStyle = textColor
  ctx.font = '22px Arial'
  ctx.textAlign = 'center'

  let y = 950

  info.forEach(item => {
    wrapTextCenter(ctx, item, 540, y, 1000, 20)
    y += 25
  })
}
