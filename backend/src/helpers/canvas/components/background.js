import { loadImage } from 'canvas'

export async function drawBackground(ctx, backgroundUrl, width, height) {
  const bg = await loadImage(backgroundUrl)

  ctx.drawImage(bg, 0, 0, width, height)

  // Dark overlay
  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  ctx.fillRect(0, 0, width, height)

  // Inner border
  const padding = 30
  const radius = 20

  drawRoundedRect(ctx, padding, padding, width - padding * 2, height - padding * 2, radius)

  ctx.strokeStyle = 'rgba(255,255,255,0.8)'
  ctx.lineWidth = 4
  ctx.stroke()
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
