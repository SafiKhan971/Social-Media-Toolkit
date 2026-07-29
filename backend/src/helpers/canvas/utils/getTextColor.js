export function getTextColor(ctx, x, y, width, height) {
    const imageData = ctx.getImageData(x, y, width, height).data

    let totalBrightness = 0
    const pixelCount = imageData.length / 4

    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i]
      const g = imageData[i + 1]
      const b = imageData[i + 2]

      // Perceived brightness
      totalBrightness += 0.299 * r + 0.587 * g + 0.114 * b
    }

    const averageBrightness = totalBrightness / pixelCount

    // Bright background -> black text
    // Dark background -> white text
    return averageBrightness > 150 ? '#000' : '#fff'
  }