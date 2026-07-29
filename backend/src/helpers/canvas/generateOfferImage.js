import { createCanvas, loadImage } from 'canvas'
import { drawHeader } from './components/header.js'
import { drawBackground } from './components/background.js'
import { drawCTA } from './components/cta.js'
import { drawFooter } from './components/footer.js'
import { drawRoundedRect } from './utils/drawRoundedRect.js'
import fs from 'fs'
import path from 'path'

export async function generateOfferImage({ business, description, packages, backgroundUrl }) {
  const businessName = business.name
  const logoUrl = business?.logo ? path.join(process.cwd(), business.logo.replace(/^\//, '')) : null
  const phones = business.phones || []
  const website = business.website || ''
  const email = business.email || ''
  const officeAddress = business.officeAddress || ''

  const width = 1080
  const height = 1080

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Background
  await drawBackground(ctx, backgroundUrl, width, height)

  // Header
  await drawHeader(ctx, businessName, logoUrl, width)

  // description
  if (description) {
    ctx.font = 'bold italic 28px Times New Roman'
    ctx.fillStyle = '#f5f5f5'
    wrapTextCenter(ctx, description, width / 2, 135, 700, 36)
  }

  const packageList = Array.isArray(packages) && packages.length > 0 ? packages : []

  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 36px Arial'
  ctx.fillText('Our Packages', width / 2, 290)

  if (packageList.length > 0) {
    const isTableFormat = packageList.length > 2

    if (isTableFormat) {
      const tableX = 80
      const tableY = 320
      const tableWidth = 920

      const titleWidth = 250
      const priceWidth = 140
      const servicesWidth = tableWidth - titleWidth - priceWidth

      const headerHeight = 55

      // Calculate row heights
      const rowHeights = packageList.map(pkg => {
        const services = pkg.services || []
        return Math.max(90, 28 + services.length * 22)
      })

      const tableHeight = headerHeight + rowHeights.reduce((a, b) => a + b, 0)

      // ============================
      // Glass Card
      // ============================

      drawRoundedRect(ctx, tableX, tableY, tableWidth, tableHeight, 18)

      ctx.fillStyle = 'rgba(0,0,0,0.60)'
      ctx.fill()

      ctx.strokeStyle = 'rgba(255,255,255,0.25)'
      ctx.lineWidth = 2
      ctx.stroke()

      // ============================
      // Header
      // ============================

      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      ctx.fillRect(tableX, tableY, tableWidth, headerHeight)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 24px Arial'
      ctx.textAlign = 'center'

      ctx.fillText('Package', tableX + titleWidth / 2, tableY + 36)

      ctx.fillText('Price', tableX + titleWidth + priceWidth / 2, tableY + 36)

      ctx.fillText('Services', tableX + titleWidth + priceWidth + servicesWidth / 2, tableY + 36)

      // ============================
      // Rows
      // ============================

      let currentY = tableY + headerHeight

      packageList.forEach((pkg, index) => {
        const rowHeight = rowHeights[index]
        const services = pkg.services || []

        // Alternate background
        ctx.fillStyle = index % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'

        ctx.fillRect(tableX, currentY, tableWidth, rowHeight)

        // Separator
        if (index !== 0) {
          ctx.beginPath()
          ctx.moveTo(tableX + 20, currentY)
          ctx.lineTo(tableX + tableWidth - 20, currentY)
          ctx.strokeStyle = 'rgba(255,255,255,0.15)'
          ctx.lineWidth = 1
          ctx.stroke()
        }

        const centerY = currentY + rowHeight / 2 + 8

        // -------------------
        // Package Title
        // -------------------

        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 22px Arial'
        ctx.textAlign = 'center'

        ctx.fillText(pkg.title || 'Package', tableX + titleWidth / 2, centerY)

        // -------------------
        // Price
        // -------------------

        ctx.fillStyle = '#FFD166'
        ctx.font = 'bold 24px Arial'

        ctx.fillText(`$${pkg.price || 0}`, tableX + titleWidth + priceWidth / 2, centerY)

        // -------------------
        // Services
        // -------------------

        ctx.textAlign = 'left'
        ctx.fillStyle = 'rgba(255,255,255,0.95)'
        ctx.font = 'bold italic 18px Arial'

        let serviceY = currentY + 28

        services.forEach(service => {
          ctx.fillText(`• ${service}`, tableX + titleWidth + priceWidth + 20, serviceY)

          serviceY += 22
        })

        currentY += rowHeight
      })
    } else {
      // Card format for 1-2 packages
      let packageFontSize = 30
      if (packageList.length === 2) packageFontSize = 27

      const cardWidth = packageList.length === 1 ? 700 : 480
      const gap = 20

      // Calculate centered startX
      const totalWidth = cardWidth * packageList.length + gap * (packageList.length - 1)
      const startX = (width - totalWidth) / 2
      const startY = 330
      const baseCardHeight = 160
      const serviceItemHeight = 36

      packageList.forEach((pkg, index) => {
        const services = pkg.services || []
        const cardHeight = baseCardHeight + services.length * serviceItemHeight

        const x = startX + index * (cardWidth + gap)
        const y = startY

        drawRoundedRect(ctx, x, y, cardWidth, cardHeight, 18)
        ctx.fillStyle = 'rgba(255,255,255,0.02)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.8)'
        ctx.lineWidth = 2
        ctx.stroke()

        // Title and Price horizontally separated by dash
        ctx.textAlign = 'center'
        ctx.fillStyle = '#ffffff'
        ctx.font = `bold ${packageFontSize}px Arial`
        const titlePriceText = `${pkg.title || 'Package'} - $${pkg.price || '0'}`
        wrapTextCenter(ctx, titlePriceText, x + cardWidth / 2, y + 45, cardWidth - 40, 28)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#ffffff'
        ctx.font = `${packageFontSize}px Arial`

        let serviceY = y + 90
        services.forEach(service => {
          const dotSize = Math.round(packageFontSize * 0.15)
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(x + 16, serviceY - 8, dotSize, 0, Math.PI * 2)
          ctx.fill()
          wrapText(ctx, service, x + 42, serviceY, cardWidth - 58, 22)
          serviceY += serviceItemHeight
        })
      })
    }
  }

  // CTA
  drawCTA(ctx, 'Contact Us', width)

  // Footer
  drawFooter(ctx, business)

  // Save Image
  const buffer = canvas.toBuffer('image/png')

  const fileName = `package-${Date.now()}.png`
  const filePath = path.join('uploads', fileName)

  fs.writeFileSync(filePath, buffer)

  return `/uploads/${fileName}`
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' '
    const width = ctx.measureText(testLine).width

    if (width > maxWidth && i > 0) {
      ctx.fillText(line, x, y)
      line = words[i] + ' '
      y += lineHeight
    } else {
      line = testLine
    }
  }

  ctx.fillText(line, x, y)
}

function wrapTextCenter(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' '
    const width = ctx.measureText(testLine).width

    if (width > maxWidth && i > 0) {
      ctx.fillText(line, x, y)
      line = words[i] + ' '
      y += lineHeight
    } else {
      line = testLine
    }
  }

  ctx.fillText(line, x, y)
}
