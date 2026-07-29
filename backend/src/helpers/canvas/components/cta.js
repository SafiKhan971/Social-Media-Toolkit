import { getTextColor } from '../utils/getTextColor.js'

export function drawCTA(ctx, text, width) {
  const ctaWidth = 300
  const ctaHeight = 70
  const ctaX = width / 2 - ctaWidth / 2
  const ctaY = 760
  
  const textColor = getTextColor(ctx, ctaX, ctaY, ctaWidth, ctaHeight)

  ctx.textAlign = 'center'
  ctx.fillStyle = textColor
  ctx.font = 'bold 36px Arial'

  ctx.fillText(text, width / 2, 900)
}
