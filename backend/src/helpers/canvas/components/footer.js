import { wrapTextCenter } from "../utils/wrapTextCenter.js"

export function drawFooter(ctx, business) {
  const info = []

  if (business.phones?.length)
    info.push(`📞 ${business.phones.join(", ")}`)

  if (business.website)
    info.push(`🌐 ${business.website}`)

  if (business.email)
    info.push(`✉️ ${business.email}`)

  if (business.officeAddress)
    info.push(`📍 ${business.officeAddress}`)

  ctx.fillStyle = "#fff"
  ctx.font = "18px Arial"
  ctx.textAlign = "center"

  let y = 950

  info.forEach((item) => {
    wrapTextCenter(ctx, item, 540, y, 1000, 20)
    y += 25
  })
}