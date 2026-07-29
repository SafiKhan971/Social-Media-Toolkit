import { createCanvas, loadImage, registerFont } from 'canvas'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const fontPath = path.join(
  __dirname,
  '../../../assets/fonts/NotoNaskhArabic.ttf'
)

console.log(fontPath)
console.log(fs.existsSync(fontPath))

registerFont(fontPath, {
  family: 'Urdu',
})

export async function generateUrduPostImage({
  business,
  description,
  logoUrl,
  backgroundUrl,
}) {
  const businessName = business.name

  const phones = business.phones || []
  const website = business.website || ''
  const email = business.email || ''
  const officeAddress = business.officeAddress || ''

  const width = 1080
  const height = 1080

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Background
  const bg = await loadImage(backgroundUrl)
  ctx.drawImage(bg, 0, 0, width, height)

  // Dark overlay
  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  ctx.fillRect(0, 0, width, height)

  // Logo
  if (logoUrl) {
    const logo = await loadImage(logoUrl)
    ctx.drawImage(logo, 40, 40, 120, 120)
  }

  // Business Name
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 52px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(businessName, width / 2, 90)

  // Urdu Quote
  ctx.fillStyle = '#ffffff'
  ctx.font = '52px Urdu'
  ctx.textAlign = 'right'

  wrapUrduText(
    ctx,
    description,
    width - 90,
    300,
    900,
    70
  )

  // CTA
  ctx.textAlign = 'center'
  ctx.font = 'bold 36px Arial'
  ctx.fillText('Contact Us', width / 2, 900)

  // Footer
  ctx.font = '18px Arial'
  ctx.textAlign = 'center'

  const contact = []

  if (phones.length) contact.push(`📞 ${phones.join(', ')}`)
  if (website) contact.push(`🌐 ${website}`)
  if (email) contact.push(`✉️ ${email}`)
  if (officeAddress) contact.push(`📍 ${officeAddress}`)

  let y = 950

  contact.forEach((item) => {
    ctx.fillText(item, width / 2, y)
    y += 24
  })

  const buffer = canvas.toBuffer('image/png')

  const fileName = `urdu-post-${Date.now()}.png`
  const filePath = path.join('uploads', fileName)

  fs.writeFileSync(filePath, buffer)

  return `/uploads/${fileName}`
}

function wrapUrduText(
  ctx,
  text,
  x,
  y,
  maxWidth,
  lineHeight
) {
  const words = text.split(' ')
  let line = ''

  for (let i = 0; i < words.length; i++) {
    const testLine = words[i] + ' ' + line

    const width = ctx.measureText(testLine).width

    if (width > maxWidth && i > 0) {
      ctx.fillText(line, x, y)
      line = words[i]
      y += lineHeight
    } else {
      line = testLine
    }
  }

  ctx.fillText(line, x, y)
}