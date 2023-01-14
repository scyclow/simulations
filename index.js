/*


A Simulated Mystical Experience
A Simulation of a Mystical Experience
Simulation of a Mystical Experience (SoaMe)

*/


let SIZE, SCALE, L, R, T, B, W, H

function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'maps-' + Date.now(), 'png');
  }
}


let SYMMETRICAL_NOISE, NOISE_DIVISOR, TURBULENCE, IGNORE_STREET_CAP, STREET_TURBULENCE, HARD_CURVES


let SAT

function setup() {
  SIZE = min(window.innerWidth, window.innerHeight)
  __canvas = createCanvas(innerWidth, innerHeight);
  noiseSeed(rnd(1000000) + rnd(1000000) + rnd(1000))
  colorMode(HSB, 360, 100, 100, 100)


  SCALE = SIZE/800

  W = width
  H = height
  L = -width/2
  R = width/2
  T = -height/2
  B = height/2

  // chaos budget
    // turbulence
    // street turbulence
    // zoom
    // hard curves
    // noise divisor
    // # layers


  SAT = chance(
    [10, -100],
    [80, 0],
    [10, 100],
  )

  MAX_GRADIENT = 8000
    // prb(0.05)
      // ? rnd(720, 3000)
      // : 200

  GRAIN = rnd() < 0.5 ? 0 : rnd(0.2, 0.7)
  SHADOW_X = rnd(-8, 8)
  SHADOW_Y = rnd(-8, 8)
  SHADOW_MAGNITUDE = rnd(10, 30)
  // chance(
  //   [15, 0],
  //   [50, 1],
  //   [30, 2],
  //   [MAX_GRADIENT > 200 ? 20 : 1, 15],
  // )

  COLOR_RULE = 1
  FORCE_GRADIENTS = prb(0.03)
  HUE_DIFF = chance(
    [3, 0],
    [2, 20],
    [1, 100],
    [2, 120],
    [1, 150],
    [3, 180],
  ) * posOrNeg()


  SYMMETRICAL_NOISE = prb(0.75)

  NOISE_DIVISOR = rnd(70, 500)//rnd(100, 750)

  THRESHOLD_DIFF = prb(0.8) ? 0.02 : rnd(0.02, 0.25)

  const layerN = rnd(30, 60)
  // chance(
  //   [15, 1],
  //   [10, 2],
  //   [27, 3],
  //   [27, 4],
  //   [11, 8],
  //   [9, 12],
  //   [1, 30],
  // )


  let thresholdAdj = 0
  if (layerN === 30) {
    thresholdAdj = 0.02
  } else if (NOISE_DIVISOR < 100) {
    thresholdAdj = map(100 - NOISE_DIVISOR, 0, 25, 0.4, 0.6)
  }
  thresholdAdj = rnd(0.01, 0.3)
  LAYERS = setLayers(layerN, thresholdAdj)
    // thresholdAdj)
}


t = 0
function draw() {

  // noLoop()

  translate(width/2, height/2)
  scale(SCALE)


  const START = Date.now()

  const preRender = 200
  if (t === 0) {
    times(preRender, i => {

      drawBackground(i)
      // drawBackground(i, true)
    })
  }

  drawBackground(t+preRender)


  t++

  // console.log(Date.now() - START)
}