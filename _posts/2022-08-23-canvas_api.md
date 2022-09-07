---
layout     : post
title      : "Canvas API"
date       : 2022-08-23
categories : RMIT CCS
---

#   Doing canvas things, without p5

p5, for the most part, is a wrapper for javascript's [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).  Under the hood, p5 is calling methods and adjusting properties that are part of the Canvas API, but it gives us, the p5 user, a set of functions and classes that make interfacing with the Canvas API easier and more convenient.

In this post we will look at how to work with the Canvas API directly, without p5's friendly intermediation.

##  Getting started

Assuming you have an `index.html` that looks something like this:

```html
<!doctype html>
<body>
    <script src=script.js></script>		
</body>
```

... we can set up our `script.js` with the following code:

```javascript
document.body.style.margin   = 0
document.body.style.overflow = `hidden`

const cnv  = document.createElement ('canvas')
cnv.width  = window.innerWidth
cnv.height = window.innerHeight
document.body.appendChild (cnv)

const ctx = cnv.getContext ('2d')
```

The first couple of lines are to get rid of the document's default padding.

Below that, we are creating an html element with the `.createElement ()` method of the `document` object.  By giving this method the string `canvas`, we are asking it to return a `<canvas></canvas>` element, which we are storing in the `cnv` variable.  We want to be able to refer to this element, so we will declare this variable with `const` to make sure we don't accidentally overwrite our initial assignment.

We are then resizing the canvas element by assigning values to the canvas' `.width` and `.height` properties.

The canvas element we have created is now the right size, but it does not exist in the document object model (DOM) yet -- it is floating outside of it, living in our variable `cnv`.  We can incorporate it into the DOM with the `.appendChild ()` method, by calling the method on the object to which we want to attach our canvas element, in this case the body of the html document, `document.body`, passing in the canvas element, `cnv`, as an argument.

Serving these files to your browser with `live-server`, and pressing `cmd` + `opt` + `C` to bring up the Inspect Element pane, should let you see that the `<canvas></canvas>` element has been inserted into the body of the document, beneath the existing `<script></script>` element:

![inspect new canvas element](/etc/images/new_canvas_element.png)

Now incorporated into the DOM, we can see that from the `html` side, the canvas is an html element.  On the script side, the canvas appears as a javascript object, contained in the variable `cnv`.  The important insight here is that the html element and the javascript object are in fact two facets of the same thing.

##  2d canvas context

In the last line of the code above, `const ctx = cnv.getContext ('2d')`, we are calling the `.getContext ()` method on the newly created canvas object.  What is returned, is a `CanvasRenderingContext2D` object.  This is the object we interface with to draw to the canvas.

Take the followings example from the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D):

```javascript
// Set line width
ctx.lineWidth = 10;

// Wall
ctx.strokeRect(75, 140, 150, 110);

// Door
ctx.fillRect(130, 190, 40, 60);

// Roof
ctx.beginPath();
ctx.moveTo(50, 140);
ctx.lineTo(150, 60);
ctx.lineTo(250, 140);
ctx.closePath();
ctx.stroke();
```

... which renders rectangles and lines to the canvas like this:

<p align=CENTER> <canvas id='example_0'></canvas> </p>
<script>
    const cnv_0  = document.getElementById ('example_0')
    cnv_0.width  = 300
    cnv_0.height = 300
    const ctx_0 = cnv_0.getContext ('2d')
    ctx_0.lineWidth = 10
    ctx_0.strokeRect (75, 140, 150, 110)
    ctx_0.fillRect (130, 190, 40, 60)
    ctx_0.beginPath ()
    ctx_0.moveTo (50, 140)
    ctx_0.lineTo (150, 60)
    ctx_0.lineTo (250, 140)
    ctx_0.closePath ()
    ctx_0.stroke ()
</script>

Take note of the similarities in drawing rectangles, and the more verbose approach to line drawing, wherein a path is created using `.beginPath ()`, `.moveTo ()`, `.lineTo ()`, and `.closePath ()`, and then the whole path is drawn, using `.stroke ()`.  Also note that all the operative functions exist as methods of the context object, `ctx`.

Lets try drawing a pink square to the middle of the canvas:

```javascript
// create a canvas element
const cnv  = document.createElement ('canvas')

// set its width and height
cnv.width  = 400
cnv.height = 400

// incorporate it into the DOM
document.body.appendChild (cnv)

// get the context object for that canvas
const ctx = cnv.getContext (`2d`)

// set the fill to turquoise
ctx.fillStyle = `turquoise`

// fill the background
ctx.fillRect (0, 0, cnv.width, cnv.height)

// draw the pink square
ctx.fillStyle = `hotpink`
ctx.fillRect (150, 150, 100, 100)
```

<p align=CENTER> <canvas id='example_1'></canvas> </p>
<script>
    const cnv_1  = document.getElementById (`example_1`)
    cnv_1.width  = 400
    cnv_1.height = 400
    const ctx_1 = cnv_1.getContext (`2d`)
    ctx_1.fillStyle = `turquoise`
    ctx_1.fillRect (0, 0, cnv_1.width, cnv_1.height)
    ctx_1.fillStyle = `hotpink`
    ctx_1.fillRect (150, 150, 100, 100)
</script>

##  Animating

Animating can be done using [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame):

```javascript
const cnv  = document.createElement ('canvas')
cnv.width  = 400
cnv.height = 400
document.body.appendChild (cnv)

const ctx = cnv.getContext (`2d`)
ctx.fillStyle = `turquoise`
ctx.fillRect (0, 0, cnv.width, cnv.height)

let x_pos = -100 // initialise mutable variable
                 // outside draw_frame function

// pass in the name of the function
// requestAnimationFrame will call it
requestAnimationFrame (draw_frame)

// define the function you want
// requestAnimationFrame to call
function draw_frame () {

    // draw the background
    ctx.fillStyle = `turquoise`
    ctx.fillRect (0, 0, cnv.width, cnv.height)

    // draw the pink square at its current x-coordinate
    ctx.fillStyle = `hotpink`
    ctx.fillRect (x_pos, 150, 100, 100)

    // increment the x-coordinate
    x_pos += 1

    // respawn it on the left once it is out of frame
    if (x_pos > 400) {
        x_pos = -100
    }

    // call the next frame
    requestAnimationFrame (draw_frame)
}
```

<p align=CENTER> <canvas id='example_3'></canvas> </p>

<script>
    const cnv_3  = document.getElementById (`example_3`)
    cnv_3.width  = 400
    cnv_3.height = 400
    const ctx_3 = cnv_3.getContext (`2d`)
    ctx_3.fillStyle = `turquoise`
    ctx_3.fillRect (0, 0, cnv_3.width, cnv_3.height)
    let x_pos_3 = -100
    requestAnimationFrame (draw_frame_3)
    function draw_frame_3 () {
        ctx_3.fillStyle = `turquoise`
        ctx_3.fillRect (0, 0, cnv_3.width, cnv_3.height)
        ctx_3.fillStyle = `hotpink`
        ctx_3.fillRect (x_pos_3, 150, 100, 100)
        x_pos_3 += 1
        if (x_pos_3 > 400) {
            x_pos_3 = -100
        }
        requestAnimationFrame (draw_frame_3)
    }
</script>

Don't forget to call `requestAnimationFrame` inside the `draw_frame` function.  Essentially, this is a way for `draw_frame` to call itself -- it is a type of **[recursive function](https://developer.mozilla.org/en-US/docs/Glossary/Recursion)**!  We will return to this topic in a future post.

Learn more about the Canvas API [here](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).