
// TODO rule neighbor probabilities, starting threshold, + spacing should be set into multiple different strategies

// gradual: lower initial threshold, higher threshold diff, subtle changes
// chaotic: lower initial threshold, low threshold diff, drastic changes
// decay: mid initial threshold, low threshold diff, drastic (but bounded) changes, cutoff at top




/*
These look good

neon -> neon


*/


let LAYERS = []



function setLayers(layerN, startingElevation=false) {
  const avgElevation = findAvgElevation()
  const r = rules(layerN)

  const ruleNames = Object.keys(r)

  const hueDiff = chance(
    [1, 0],
    [2, 100],
    [2, 150],
    [2, 180],
  ) * posOrNeg()

  const baseHue = rnd(360)


  const layers = [{
    ix: 0,
    threshold: 0,
    ...r[
      sample(ruleNames)
      // 'blackAndWhite'
    ](baseHue, MAX_GRADIENT/rnd(3, 15), 0)
  }]

  let hueIx = 0
  const huePresets = getHuePresets(baseHue)
  const nextHue = (previousHue) => previousHue + HUE_DIFF

  const newLayer = (previousLayer, threshold, ix) => {
    const maxGrad = ix === layerN-1 ? MAX_GRADIENT/rnd(3, 8) : MAX_GRADIENT

    let nextLayer
    if (COLOR_RULE === 5 && !(ix % 2)) {
      nextLayer = LAYERS[0]

    } else if (COLOR_RULE === 5 && ix % 2) {
      const altHueDiff = chance(
        [1, 20],
        [1, 120],
        [1, 180],
      )

      const h = hfix(previousLayer.baseHue + 20)
      nextLayer = r[alternateRule](h, maxGrad, ix, previousLayer.isDark)

    } else {
      const nextRule = chance(...previousLayer.neighbors)
      const h = nextRule === 'blackAndWhite' || nextRule === 'whiteAndBlack'
        ? previousLayer.baseHue
        : nextHue(previousLayer.baseHue)
      nextLayer = r[nextRule](h, maxGrad, ix, previousLayer.isDark)
    }

    return {
      ...nextLayer,
      ix,
      threshold,
    }
  }

  for (let i = 1; i < layerN; i++) {
    const previousLayer = layers[i-1]
    const threshold = i === layerN - 1
      ? 1
      : previousLayer.threshold + THRESHOLD_DIFF

    layers.push(newLayer(previousLayer, threshold, i))
  }

  return layers
}



const GRADIEN_PRB = 0.0625
const getGradient = (force, mx=360) => {
  return rnd() < GRADIEN_PRB || force
    ? {
      focalPoint: {
        x: rnd(L, R),
        y: rnd(T, B)
      },
      hue: rnd(mx/4, mx) * posOrNeg(),
      sat: 0,
      brt: 0,
    }
    : null
}

const rules = (layerN) => {
  const black = color(0, 0, 10)
  const whiteBg = color(0, 0, 90)
  const whiteStroke = color(0, 0, 85)

  const GRADIENT_PRB = 0.09
  const getGradient = (force, mx=360) => {
    return rnd() < GRADIENT_PRB || force
      ? {
        focalPoint: {
          x: rnd(L, R),
          y: rnd(T, B)
        },
        useElevation: rnd() < 0.9,
        hue: rnd(mx/4, mx) * posOrNeg(),
        sat: 2,
        brt: 1,
      }
      : null
  }

  return {
    blackAndWhite: (baseHue, _, ix, __) => {
      let key
      if ([2, 4].includes(COLOR_RULE)) key = 'light'
      else if (COLOR_RULE === 3) key = 'dark'
      else if (COLOR_RULE === 4) key = 'color'
      else key = 'all'

      const neighbors = {
        contrast: [
          [1, 'whiteAndBlack'],
          [1, 'bright']
        ],
        light: [
          [8, 'whiteAndBlack'],
          [2, 'bright'],
        ],
        dark: [
          [1, 'neon']
        ],
        color: [
          [1, 'bright']
        ],
        all: [
          [7, 'whiteAndBlack'],
          [3, 'bright'],
          [3, 'neon']
        ]
      }[key]

      return {
        name: 'blackAndWhite',
        baseHue,
        colors: {
          bg: black,
          primary: whiteStroke,
          secondary: whiteStroke,
          tertiary: whiteStroke,
          quarternary: whiteStroke,
          street: whiteStroke,
          circle: whiteStroke,
        },
        neighbors,
        gradient: null,
        isDark: true,
        isColor: false,
        isLight: false,
      }
    },

    whiteAndBlack: (baseHue, _, ix, __) => {
      let key
      if (COLOR_RULE === 1) key = 'contrast'
      else if (COLOR_RULE === 3) key = 'dark'
      else if ([2, 4].includes(COLOR_RULE)) key = 'color'
      else key = 'all'

      const neighbors = {
        contrast: [
          [layerN > 3 ? 1 : 0, 'bright'],
          [3, 'blackAndWhite'],
        ],
        dark: [
          [5, 'blackAndWhite'],
          [5, 'neon'],
        ],
        color: [
          [1, 'bright']
        ],
        all: [
          [6, 'blackAndWhite'],
          [5, 'neon'],
          [5, 'bright']
        ],
      }[key]

      return {
        name: 'whiteAndBlack',
        baseHue,
        colors: {
          bg: whiteBg,
          primary: black,
          secondary: black,
          tertiary: black,
          quarternary: black,
          street: black,
          circle: black,
        },
        neighbors,
        gradient: null,
        isDark: false,
        isColor: false,
        isLight: true,
      }
    },

    neon: (baseHue, gradientMax, ix) => {
      const bg = adjColor(baseHue, 30, 12)
      let c = adjColor(baseHue, 55, 92)

      if (contrast(bg, c) > -0.5) {
        c = setContrastC2(bg, c, -0.5)
      }

      let key
      if (COLOR_RULE === 3) key = 'dark'
      else if (layerN === 2) key = 'color'
      else if (COLOR_RULE === 1) key = 'contrast'
      else if (COLOR_RULE === 2) key = 'light'
      else if (COLOR_RULE === 4) key = 'color'
      else key = 'all'

      const neighbors = {
        contrast: [
          [1, 'bright'],
        ],
        dark: [
          [2, 'blackAndWhite'],
          [1, 'neon'],
        ],
        light: [
          [2, 'whiteAndBlack'],
          [1, 'bright'],
        ],
        color: [
          [1, 'bright']
        ],
        all: [
          [4, 'bright'],
          [5, 'blackAndWhite'],
          [3, 'whiteAndBlack'],
          [2, 'neon'],
        ],
      }[key]

      return {
        name: 'neon',
        baseHue,
        colors: {
          bg,
          primary: c,
          secondary: c,
          tertiary: c,
          quarternary: c,
          street: c,
          circle: c,
        },
        neighbors,
        gradient: getGradient(FORCE_GRADIENTS, gradientMax),
        isDark: true,
        isColor: false,
        isLight: false,
      }
    },

    bright: (baseHue, gradientMax, ix, __) => {
      const c1 = adjColor(baseHue, 55, 95)


      let key
      if (COLOR_RULE === 1) key = 'contrast'
      else if (COLOR_RULE === 2) key = 'light'
      else if (COLOR_RULE === 3) key = 'dark'
      else if (COLOR_RULE === 4) key = 'color'
      else key = 'all'

      const neighbors = {
        contrast: [
          [3, 'blackAndWhite'],
          [layerN > 3 ? 1 : 0, 'whiteAndBlack'],
          [3, 'neon'],
        ],
        dark: [
          [2, 'blackAndWhite'],
          [1, 'neon'],
        ],
        light: [
          [1, 'whiteAndBlack'],
        ],
        color: [
          [1, 'bright'],
        ],
        all: [
          [4, 'blackAndWhite'],
          [2, 'whiteAndBlack'],
          [1, 'neon'],
        ],
      }[key]

      return {
        name: 'bright',
        baseHue,
        colors: {
          bg: c1,
        },
        neighbors,
        gradient: getGradient(FORCE_GRADIENTS, gradientMax),
        isDark: false,
        isColor: true,
        isLight: false,
      }
    },

    paper: (baseHue, gradientMax, ix, __) => {
      const c1 = color(hfix(baseHue), 8, 91)

      let key
      if (COLOR_RULE === 2) key = 'light'
      else if (COLOR_RULE === 3) key = 'dark'
      else if (COLOR_RULE === 4) key = 'color'
      else key = 'all'

      const neighbors = {

        dark: [
          [1, 'blackAndWhite'],
          [layerN > 2 ? 1 : 0, 'neon'],
          [1, 'burnt'],
        ],
        light: [
          [1, 'whiteAndBlack'],
          [1, 'bright'],
          [1, 'faded'],
        ],
        color: [
          [1, 'bright'],
          [1, 'faded'],
        ],
        all: [
          [6, 'blackAndWhite'],
          [layerN > 2 ? 6 : 0, 'neon'],
          [7, 'burnt'],
          [1, 'whiteAndBlack'],
          [1, 'bright'],
          [2, 'faded'],
        ],
      }[key]

      return {
        name: 'paper',
        baseHue,
        colors: {
          bg: c1,
        },
        neighbors,
        gradient: getGradient(true, FORCE_GRADIENTS ? gradientMax : rnd(90)),
        isDark: false,
        isColor: false,
        isLight: true,
      }
    },

    faded: (baseHue, gradientMax, ix, __) => {
      const c1 = adjColor(baseHue, 35, 95)

      let key
      if (COLOR_RULE === 2) key = 'light'
      else if (COLOR_RULE === 3) key = 'dark'
      else if (COLOR_RULE === 4) key = 'color'
      else key = 'all'

      const neighbors = {
        dark: [
          [1, 'blackAndWhite'],
          [1, 'neon'],
          [2, 'burnt'],
        ],
        light: [
          [1, 'whiteAndBlack'],
          [1, 'bright'],
          [2, 'paper'],
        ],
        color: [
          [1, 'bright'],
        ],
        all: [
          [2, 'burnt'],
          [2, 'paper'],
          [12, 'blackAndWhite'],
          [5, 'neon'],
          [5, 'whiteAndBlack'],
          [1, 'bright'],
        ],
      }[key]

      return {
        name: 'faded',
        baseHue,
        colors: {
          bg: c1,
        },
        neighbors,
        gradient: getGradient(FORCE_GRADIENTS, FORCE_GRADIENTS ? gradientMax : rnd(75)),
        isDark: false,
        isColor: true,
        isLight: false,
      }
    },

    burnt: (baseHue, gradientMax, ix) => {
      const c1 = color(hfix(baseHue), 35, 15)
      const d = HUE_DIFF > 0 ? 1 : -1

      const c2 = color(hfix(baseHue + HUE_DIFF), 50, 85)
      const c3 = color(hfix(baseHue + HUE_DIFF-30*d), 50, 85)
      const c4 = color(hfix(baseHue + HUE_DIFF-60*d), 50, 85)

      let key
      if (COLOR_RULE === 3) key = 'dark'
      else if (layerN === 2) key = 'color'
      else if (COLOR_RULE === 2) key = 'light'
      else if (COLOR_RULE === 4) key = 'color'
      else key = 'all'

      const neighbors = {
        dark: [
          [3, 'blackAndWhite'],
          [2, 'neon'],
        ],
        light: [
          [2, 'whiteAndBlack'],
          [1, 'bright'],
          [2, 'faded'],
        ],
        color: [
          [1, 'bright'],
          [2, 'faded'],
        ],
        all: [
          [6, 'whiteAndBlack'],
          [4, 'faded'],
          [8, 'blackAndWhite'],
          [4, 'neon'],
          [7, 'bright'],
        ],
      }[key]

      return {
        name: 'burnt',
        baseHue,
        colors: {
          bg: c1,
          primary: c2,
          secondary: c2,
          tertiary: c3,
          quarternary: c3,
          street: c4,
          circle: c4,
        },
        neighbors,
        gradient: getGradient(FORCE_GRADIENTS, gradientMax),
        isDark: true,
        isColor: false,
        isLight: false,
      }
    },
  }
}



function adjSat(sat, hue) {
  // const h = ((hue + 90) % 180) / 180
  // return sat - map(h, 0, 1, 0, 50)

  hue = hfix(hue)

  let amt = 0
  if (hue >= 90 && hue <= 150) {
    amt = 1 - abs(120 - hue) / 30

  } else if (hue >= 270 && hue <= 330) {
    amt = 1 - abs(300 - hue) / 30
  }

  return sat - map(amt, 0, 1, 0, 20)
}












function findActiveLayer(x, y, z) {
  const n = getElevation(x, y, z)

  for (let i = 0; i < LAYERS.length; i++) {
    if (n < LAYERS[i].threshold) return LAYERS[i]
  }
  return LAYERS[LAYERS.length - 1]
}





function findAvgElevation() {
  let elevationSum = 0
  let elevationIx = 0
  const step = 30
  for (let x = L; x < R; x += step)
  for (let y = T; y < B; y += step) {
    elevationSum += getElevation(x, y)
    elevationIx++
  }
  return elevationSum/elevationIx
}

function getElevation(x, y, z) {
  const offset = SYMMETRICAL_NOISE ? 0 : 100000
  return noise(
    (x+offset)/NOISE_DIVISOR,
    (y+offset)/NOISE_DIVISOR,
    z
  )
}

const setContrastC2 = (_c1, _c2, newContrast=0.4) => {
  const _contrast = contrast(_c1, _c2)

  const amt = (newContrast - _contrast)/0.3

  return color(
    hue(_c2),
    saturation(_c2) + 20*amt,
    brightness(_c2) - 30*amt
  )
}


function getHuePresets(baseHue) {
  switch (abs(HUE_DIFF)) {
    case 0: return [baseHue]
    case 10: return [baseHue, baseHue+10, baseHue+20, baseHue+30, baseHue+40, baseHue+50, baseHue+60]
    case 20: return [baseHue, baseHue + 20, baseHue - 20]
    case 100: return [baseHue, baseHue + 120, baseHue + 180]
    case 120: return [baseHue, baseHue + 120, baseHue - 120]
    case 150: return [baseHue, baseHue + 150, baseHue + 210]
    case 180: return [baseHue, baseHue + 180]
  }
}
