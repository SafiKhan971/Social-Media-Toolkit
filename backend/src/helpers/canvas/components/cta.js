export function drawCTA(ctx, text, width) {
  ctx.textAlign = "center"
  ctx.fillStyle = "#fff"
  ctx.font = "bold 36px Arial"

  ctx.fillText(text, width / 2, 900)
}