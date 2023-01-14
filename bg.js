
// const Q_PI = Math.PI/4
// const NEG_Q_PI = -Math.PI/4


function drawBackground(t, smooth=false) {
  // t = t % 2 ? t : t + 1000
  push()
  if (t===0) background(LAYERS[0].colors.bg)

  const strokeSize = 2//2/SCALE


  const frameAmt = 60
  const _t = int(t/frameAmt)
  const frame = t % frameAmt
  const frameIncrementH = H / frameAmt
  const frameIncrementW = W / frameAmt

  const start = T + (frame * frameIncrementH)
  const end = T + ((frame+1) * frameIncrementH)

  const _y = int(rnd(0, frameAmt))
  const _x = int(rnd(0, frameAmt))

  const startY = (smooth ? start : T + (_y * frameIncrementH))-20
  const endY = (smooth ? end : T + ((_y+6) * frameIncrementH))

  const startX = smooth
    ? L
    : L + (_x * frameIncrementW)
  const endX = smooth
    ? R
    : L + ((_x+6) * frameIncrementW)


  for (let y = startY; y < endY; y += strokeSize) {
    for (let x = startX-20; x < endX; x += strokeSize) {
      const layer = findActiveLayer(x, y, _t/200)
      drawBackgroundStroke(x, y, layer, strokeSize, LAYERS, _t)
    }
  }
  pop()
}

// function drawBackgroundStroke(x, y, layer, strokeSize, layers, t) {
//   // const baseLayer = layers[0]
//   // increase/decrease rnd hue/sat for graininess
//   // const colorMismatch = (
//   //   (layer.isColor && baseLayer.isDark) ||
//   //   (baseLayer.isColor && layer.isDark)
//   // )

//   // const colorMismatchIffy = (baseLayer.isLight && layer.isDark)

//   // const largeLayer = (layer.ix === 0 || layer.ix === layers.length - 1)

//   // const strokeMultiplier =
//   //   largeLayer && colorMismatch ? 1.25 :
//   //   largeLayer && colorMismatchIffy ? 1.15 :
//   //   1

//   // let diam = rnd(strokeSize, strokeSize*2) * strokeMultiplier
//   // let offset = strokeSize/2

//   // strokeWeight(diam/3.5)

//   const e = getElevation(x, y)


//   let hAdj = t * 5
//   let sAdj = SAT
//   let bAdj = 0
//   if (layer.gradient) {
//     const d =
//       dist(x, y, layer.gradient.focalPoint.x, layer.gradient.focalPoint.y)
//       / dist(L, B, R, T)

//     hAdj = map(d, 0, 1, 0, layer.gradient.hue) + t * 10
//     sAdj = map(d, 0, 1, 0, layer.gradient.sat)
//     bAdj = map(d, 0, 1, 0, layer.gradient.brt)

//   }

//   // stroke(
//   //   hfix(hue(layer.colors.bg) + rnd(-3, 3) + hAdj),
//   //   saturation(layer.colors.bg) + rnd(-5, 5) + sAdj,
//   //   brightness(layer.colors.bg) + rnd(-10, 0) + bAdj,
//   // )

//   const hGrain = GRAIN * 45 + 3
//   const sGrain = GRAIN * 10 + 5
//   const bGrain = GRAIN * 5 //* (strokeParams.potentialMismatch ? 0 : 1)

//   const { bShadow, sShadow } = getShadow(x, y, e, layer)


//   stroke(
//     adjColor(
//       hfix(hue(layer.colors.bg) + hAdj + rnd(-hGrain, hGrain)),
//       saturation(layer.colors.bg) + sAdj + rnd(-sGrain, sGrain) + sShadow,
//       brightness(layer.colors.bg) + bAdj + rnd(-10 - bGrain, 0) - bShadow,
//     )
//   )


//   // fill(
//   //   hfix(hue(layer.colors.bg) + rnd(-3, 3) + hAdj),
//   //   saturation(layer.colors.bg) + rnd(-5, 5) + sAdj,
//   //   brightness(layer.colors.bg) + rnd(-10, 0) + bAdj,
//   // )
//   // const angle = noise(x+W, y+H)

//   // const [x0, y0] = getXYRotation(PI+angle+rnd(NEG_Q_PI, Q_PI), strokeSize, x, y)
//   // const [x1, y1] = getXYRotation(angle+rnd(NEG_Q_PI, Q_PI), strokeSize, x, y)

//   // line(x0, y0, x1, y1)
//   point(x+rnd(-1, 1), y+rnd(-1, 1))
//   // rect(x0, y0, strokeSize, strokeSize)
// }





const Q_PI = Math.PI/4
const NEG_Q_PI = -Math.PI/4


// function drawBackground(t, smooth=false) {
//   push()
//   if (t===0) background(LAYERS[0].colors.bg)

//   const strokeSize = 2//2/SCALE


//   const frameAmt = 60
//   const _t = int(t/frameAmt)
//   const frame = t % frameAmt
//   const frameIncrement = H / frameAmt

//   const start = T + (frame * frameIncrement)
//   const end = T + ((frame+1) * frameIncrement)

//   const _y = int(rnd(0, frameAmt))
//   const _x = int(rnd(0, frameAmt))

//   const startY = (smooth ? start : T + (_y * frameIncrement))
//   const endY = (smooth ? end : T + ((_y+6) * frameIncrement))

//   const startX = (smooth ? L : L + (_x * frameIncrement))
//   const endX = (smooth ? R : L + ((_x+6) * frameIncrement))


//   for (let y = startY; y < endY; y += strokeSize) {
//     for (let x = startX; x < endX; x += strokeSize) {
//       const layer = findActiveLayer(x, y, _t/200)
//       drawBackgroundStroke(x, y, layer, strokeSize, LAYERS, _t)
//     }
//   }
//   pop()
// }

function drawBackgroundStroke(x, y, layer, strokeSize, layers, t) {
  const baseLayer = layers[0]
  // increase/decrease rnd hue/sat for graininess
  const colorMismatch = (
    (layer.isColor && baseLayer.isDark) ||
    (baseLayer.isColor && layer.isDark)
  )

  const colorMismatchIffy = (baseLayer.isLight && layer.isDark)

  const largeLayer = (layer.ix === 0 || layer.ix === layers.length - 1)

  const strokeMultiplier =
    largeLayer && colorMismatch ? 1.25 :
    largeLayer && colorMismatchIffy ? 1.15 :
    1

  let diam = rnd(strokeSize, strokeSize*2) * strokeMultiplier
  let offset = strokeSize/2

  strokeWeight(diam/3.5)

  const e = getElevation(x, y)


  let hAdj = t * 5
  let sAdj = SAT
  let bAdj = 0
  if (layer.gradient) {
    const d = layer.gradient.useElevation
      ? (e * 10)
      : dist(x, y, layer.gradient.focalPoint.x, layer.gradient.focalPoint.y)
        / dist(L, B, R, T)

    hAdj = map(d, 0, 1, 0, layer.gradient.hue) + t * 10
    sAdj = map(d, 0, 1, 0, layer.gradient.sat)
    bAdj = map(d, 0, 1, 0, layer.gradient.brt)

  }

  const hGrain = GRAIN * 45 + 3
  const sGrain = GRAIN * 10 + 5
  const bGrain = GRAIN * 5 //* (strokeParams.potentialMismatch ? 0 : 1)

  const { bShadow, sShadow } = getShadow(x, y, e, layer)


  stroke(
    adjColor(
      hfix(hue(layer.colors.bg) + hAdj + rnd(-hGrain, hGrain)),
      saturation(layer.colors.bg) + sAdj + rnd(-sGrain, sGrain) + sShadow,
      brightness(layer.colors.bg) + bAdj + rnd(-10 - bGrain, 0) - bShadow,
    )
  )

  // fill(
  //   hfix(hue(layer.colors.bg) + rnd(-3, 3) + hAdj),
  //   saturation(layer.colors.bg) + rnd(-5, 5) + sAdj,
  //   brightness(layer.colors.bg) + rnd(-10, 0) + bAdj,
  // )
  // const angle = noise(x+W, y+H)

  // const [x0, y0] = getXYRotation(PI+angle+rnd(NEG_Q_PI, Q_PI), strokeSize, x, y)
  // const [x1, y1] = getXYRotation(angle+rnd(NEG_Q_PI, Q_PI), strokeSize, x, y)

  // line(x0, y0, x1, y1)
  point(x+rnd(-1,1), y+rnd(-1,1))
  // rect(x0, y0, strokeSize, strokeSize)
}



function getShadow(x, y, e, layer) {
  const shadow = max(
    0,
    getElevation(x+SHADOW_X, y+SHADOW_Y) - e,
  ) * SHADOW_MAGNITUDE * (NOISE_DIVISOR*SCALE)/300

  const l = map(luminance(layer.colors.bg), 0, 255, 0.5, 1)
  const g = layer.gradient ? min(abs(layer.gradient.hue)/50, 1)*4 : 1
  let bShadow = 0, sShadow = 0
  if (layer.isDark) {
    bShadow = shadow * 500
    sShadow = shadow * 500

  } else if (layer.isColor) {
    magnitude = g * 150 * l
    bShadow = shadow * magnitude
    sShadow = shadow * magnitude * (layer.gradient ? 4 : 2)

  } else if (layer.isLight) {
    bShadow = shadow*100*g
    sShadow = shadow*100*g
  }

  return { sShadow, bShadow }
}
