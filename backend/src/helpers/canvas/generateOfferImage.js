import { createCanvas, loadImage } from 'canvas'
import { drawHeader } from './components/header.js'
import { drawBackground } from './components/background.js'
import { drawCTA } from './components/cta.js'
import { drawFooter } from './components/footer.js'
import fs from 'fs'
import path from 'path'

export async function generateOfferImage({ business, description, packages, backgroundUrl}) {

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
      // Table format for > 2 packages
      const tableX = 100
      const tableY = 330
      const tableWidth = 880
      const colWidth = tableWidth / 3
      const rowHeight = 50
      const headerHeight = 50
      
      // Draw table header
      ctx.fillStyle = 'rgba(255,255,255,0.1)'
      ctx.fillRect(tableX, tableY, tableWidth, headerHeight)
      
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'
      ctx.lineWidth = 1
      ctx.strokeRect(tableX, tableY, tableWidth, headerHeight)
      
      // Draw header text
      ctx.textAlign = 'center'
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 24px Arial'
      ctx.fillText('Package Title', tableX + colWidth / 2, tableY + 35)
      ctx.fillText('Price', tableX + colWidth + colWidth / 2, tableY + 35)
      ctx.fillText('Services', tableX + colWidth * 2 + colWidth / 2, tableY + 35)
      
      // Draw table rows
      packageList.forEach((pkg, index) => {
        const services = pkg.services || []
        const estimatedRowsNeeded = Math.ceil(services.length / 2)
        const dynamicRowHeight = Math.max(50, 30 + estimatedRowsNeeded * 18)
        const rowY = tableY + headerHeight + index * (dynamicRowHeight + 1)
        
        // Draw row border
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'
        ctx.lineWidth = 1
        ctx.strokeRect(tableX, rowY, tableWidth, dynamicRowHeight)
        
        // Draw column dividers
        ctx.beginPath()
        ctx.moveTo(tableX + colWidth, rowY)
        ctx.lineTo(tableX + colWidth, rowY + dynamicRowHeight)
        ctx.stroke()
        
        ctx.beginPath()
        ctx.moveTo(tableX + colWidth * 2, rowY)
        ctx.lineTo(tableX + colWidth * 2, rowY + dynamicRowHeight)
        ctx.stroke()
        
        // Draw row data
        ctx.textAlign = 'center'
        ctx.fillStyle = '#ffffff'
        ctx.font = '18px Arial'
        
        // Package title
        ctx.fillText(pkg.title || 'Package', tableX + colWidth / 2, rowY + 32)
        
        // Price
        ctx.font = 'bold 20px Arial'
        ctx.fillText(`$${pkg.price || '0'}`, tableX + colWidth + colWidth / 2, rowY + 32)
        
        // Services (all services with wrapping)
        ctx.font = '14px Arial'
        ctx.textAlign = 'left'
        let serviceY = rowY + 18
        let currentLine = ''
        const servicesCellX = tableX + colWidth * 2 + 12
        const servicesCellWidth = colWidth - 24
        
        services.forEach((service, sIndex) => {
          const testLine = currentLine ? currentLine + ', ' + service : service
          const testWidth = ctx.measureText(testLine).width
          
          if (testWidth > servicesCellWidth && currentLine) {
            ctx.fillText(currentLine, servicesCellX, serviceY)
            currentLine = service
            serviceY += 18
          } else {
            currentLine = testLine
          }
          
          if (sIndex === services.length - 1 && currentLine) {
            ctx.fillText(currentLine, servicesCellX, serviceY)
          }
        })
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
        const services = (pkg.services || [])
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
        services.forEach((service) => {
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
  drawCTA(ctx, 'Book Now', width)

  // Footer
  drawFooter(ctx, business)

  // Save Image
  const buffer = canvas.toBuffer('image/png')

  const fileName = `package-${Date.now()}.png`
  const filePath = path.join('uploads', fileName)

  fs.writeFileSync(filePath, buffer)

  return `/uploads/${fileName}`
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath()

  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)

  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  )

  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)

  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)

  ctx.closePath()
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