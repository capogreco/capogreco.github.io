const draw = SVG().addTo ('#svg_div').size ('400', '300')

const bg_colour_0 = new SVG.Color ({ h: 0,   s: 100, l: 50 })
const bg_colour_1 = new SVG.Color ({ h: 360, s: 100, l: 50 })
const background = draw.rect (400, 300).fill (bg_colour_0)
background.animate (15000).ease ('-').fill (bg_colour_1).loop ()

const square = draw.rect (100, 100).move (150, 100).fill('hotpink')
square.animate (15000).ease ('-').rotate (360).loop ()
