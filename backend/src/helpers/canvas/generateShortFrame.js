import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import path from 'path'

const WIDTH = 1080
const HEIGHT = 1920

function coverDraw(ctx, image, width, height) {
  const targetRatio = width / height
  const imageRatio = image.width / image.height
  let sx = 0
  let sy = 0
  let sw = image.width
  let sh = image.height

  if (imageRatio > targetRatio) {
    sw = image.height * targetRatio
    sx = (image.width - sw) / 2
  } else {
    sh = image.width / targetRatio
    sy = (image.height - sh) / 2
  }

  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, width, height)
}

export async function generateShortFrame({ backgroundPath, outputPath }) {
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')

  const background = await loadImage(backgroundPath)
  coverDraw(ctx, background, WIDTH, HEIGHT)

  const topGradient = ctx.createLinearGradient(0, 0, 0, 320)
  topGradient.addColorStop(0, 'rgba(0,0,0,0.55)')
  topGradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = topGradient
  ctx.fillRect(0, 0, WIDTH, 320)

  const bottomGradient = ctx.createLinearGradient(0, HEIGHT - 820, 0, HEIGHT)
  bottomGradient.addColorStop(0, 'rgba(0,0,0,0)')
  bottomGradient.addColorStop(1, 'rgba(0,0,0,0.82)')
  ctx.fillStyle = bottomGradient
  ctx.fillRect(0, HEIGHT - 820, WIDTH, 820)

  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'left'
  ctx.font = 'bold 36px Arial'
  ctx.fillText('YouTube Short', 64, 92)

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, canvas.toBuffer('image/png'))
  return outputPath
}
