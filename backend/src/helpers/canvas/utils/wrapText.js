export function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  let lines = 0

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' '

    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      ctx.fillText(line, x, y)
      line = words[i] + ' '
      y += lineHeight
      lines++
    } else {
      line = testLine
    }
  }

  ctx.fillText(line, x, y)
  lines++

  return lines
}