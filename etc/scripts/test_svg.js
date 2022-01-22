const draw = SVG().addTo ('#svg_div').size ('400', '300')

const bg_colour_0 = new SVG.Color ({ h: 0,   s: 100, l: 50 })
const bg_colour_1 = new SVG.Color ({ h: 360, s: 100, l: 50 })
const background = draw.rect (400, 300).fill (bg_colour_0)
background.animate (15000).ease ('-').fill (bg_colour_1).loop ()

const rotating_square = draw.rect (100, 100).move (150, 100).fill('hotpink')
rotating_square.animate (15000).ease ('-').rotate (360).loop ()

const mouse_nested = draw.nested ().width (100).height (100)
const mouse_square = mouse_nested.rect (50, 50).x (25).y (25)
	.fill ('skyblue')


const mouse_runner = mouse_square.animate (15000)
	.ease ('-').loop ()
	.rotate (-360)

draw.mousemove (e => {
	mouse_nested.x (e.offsetX - 50)
	mouse_nested.y (e.offsetY - 50)
})
