import { loadImage } from 'canvas'

export async function drawBackground(ctx, backgroundUrl, width, height) {
  const bg = await loadImage(backgroundUrl)

  ctx.drawImage(bg, 0, 0, width, height)

  // Dark overlay
  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  ctx.fillRect(0, 0, width, height)
}
