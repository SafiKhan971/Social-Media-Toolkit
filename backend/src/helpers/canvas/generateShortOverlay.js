import { createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'

const WIDTH = 1080
const HEIGHT = 1920

export async function generateShortOverlay({ outputPath }) {
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')

  const topGradient = ctx.createLinearGradient(0, 0, 0, 280)
  topGradient.addColorStop(0, 'rgba(0,0,0,0.45)')
  topGradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = topGradient
  ctx.fillRect(0, 0, WIDTH, 280)

  const bottomGradient = ctx.createLinearGradient(0, HEIGHT - 820, 0, HEIGHT)
  bottomGradient.addColorStop(0, 'rgba(0,0,0,0)')
  bottomGradient.addColorStop(1, 'rgba(0,0,0,0.78)')
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
