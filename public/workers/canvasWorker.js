const canvasSize = 512
const halfSize = canvasSize / 2
const offscrCanvas = new OffscreenCanvas(canvasSize, canvasSize)
const ctx = offscrCanvas.getContext('2d')
// ctx.fillStyle = "#fff"
// ctx.fillRect(0, 0, offscrCanvas.width, offscrCanvas.height)
const brightnessRange = { min: 0, max: 100 }

function randomFromRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min) + 1
}

function randomSla(hue) {
  let s = 100
  if (Math.random() > 0.6) {
    // saturation from 0.2 to 1
    s = Math.random() * (100 - 0.2) + 0.2
  }

  const l = Math.random() * (100 - 0) + 1

  let a = 1
  if (Math.random() > 0.6) {
    // alpha from 0.1 to 1
    a = Math.random() * 0.6 + 0.4
  }

  return `hsla(${hue}, ${s}%, ${l}%, ${a})`
}

function drawTriangle(hue) {
  // random x and y coordinates for the triangle vertices
  const x1 = Math.floor(Math.random() * offscrCanvas.width)
  const y1 = Math.floor(Math.random() * offscrCanvas.height)
  const x2 = Math.floor(Math.random() * offscrCanvas.width)
  const y2 = Math.floor(Math.random() * offscrCanvas.height)
  const x3 = Math.floor(Math.random() * offscrCanvas.width)
  const y3 = Math.floor(Math.random() * offscrCanvas.height)

  // draw the triangle
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.lineTo(x3, y3)
  ctx.closePath()

  // fill with random tone
  ctx.fillStyle = randomSla(hue)
  ctx.fill()
}

function drawEllipse(hue) {
  // random x and y for the center of the ellipse
  const x = Math.floor(Math.random() * offscrCanvas.width)
  const y = Math.floor(Math.random() * offscrCanvas.height)
  // random width and height for the ellipse from 5 to 200
  const w = Math.floor(Math.random() * 190 + 10) + 1
  const h = Math.floor(Math.random() * 190 + 10) + 1
  // random rotation angle in radians for the ellipse
  const angle = Math.random() * 2 * Math.PI
  
  // save the canvas before rotation
  ctx.save()
  // translate the canvas to the center of the ellipse
  ctx.translate(x + w / 2, y + h / 2)
  // rotate the canvas by the random angle
  ctx.rotate(angle)
  // draw the ellipse
  ctx.beginPath()
  ctx.ellipse(-w / 2, -h / 2, w, h, 0, 0, 2 * Math.PI)
  // fill with random tone
  ctx.fillStyle = randomSla(hue)
  ctx.fill()
  // restore the canvas after rotation
  ctx.restore()
}

function drawCanvas(data) {
  const { hue } = data

  const numOfShapes = randomFromRange(15, 25)
  for (let i = 0; i < numOfShapes; i++) {
    if (Math.random() >= 0.5) {
      drawTriangle(hue)
    } else {
      drawEllipse(hue)
    }
  }
}

function cropCanvas() {
  // copy the center region of the canvas (250x250)
  const croppedCanvasBitmap = offscrCanvas.transferToImageBitmap()
  const croppedCanvas = new OffscreenCanvas(halfSize, halfSize)
  const croppedCtx = croppedCanvas.getContext('2d')
  croppedCtx.drawImage(croppedCanvasBitmap, 0, 0, halfSize, halfSize, 0, 0, halfSize, halfSize)

  // flip the cropped canvas horizontally
  const flippedCanvasX = new OffscreenCanvas(halfSize, halfSize)
  const flippedCtxX = flippedCanvasX.getContext('2d')
  flippedCtxX.scale(-1, 1)
  flippedCtxX.drawImage(croppedCanvas, -halfSize, 0)

  // flip the cropped canvas vertically
  const flippedCanvasY = new OffscreenCanvas(halfSize, halfSize)
  const flippedCtxY = flippedCanvasY.getContext('2d')
  flippedCtxY.scale(1, -1)
  flippedCtxY.drawImage(croppedCanvas, 0, -halfSize)

  // rotate the cropped canvas by 180 degrees
  const rotatedCanvas = new OffscreenCanvas(halfSize, halfSize)
  const rotatedCtx = rotatedCanvas.getContext('2d')
  rotatedCtx.rotate(Math.PI)
  rotatedCtx.drawImage(croppedCanvas, -halfSize, -halfSize)

  // put the four canvases together
  const finalCanvas = new OffscreenCanvas(canvasSize, canvasSize)
  const finalCtx = finalCanvas.getContext('2d')
  finalCtx.drawImage(croppedCanvas, 0, 0)
  finalCtx.drawImage(flippedCanvasX, halfSize, 0)
  finalCtx.drawImage(flippedCanvasY, 0, halfSize)
  finalCtx.drawImage(rotatedCanvas, halfSize, halfSize)

  return finalCanvas
}

onmessage = async function(event) {
  const message = event.data
  if (message.type === 'init') {
    drawCanvas(message.data)
    const finalCanvas = cropCanvas()
    const pngBlob = await finalCanvas.convertToBlob({ type: 'image/png' })
    postMessage({ type: 'image', data: pngBlob })
  }
};
