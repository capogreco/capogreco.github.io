---
layout     : post
title      : "Recursion 😵‍💫"
date       : 2022-09-03
categories : RMIT CCS
---

<iframe  id='recursion'></iframe>

<script>
    const recursion_frame = document.getElementById ('recursion')
    console.dir (recursion_frame)
    recursion_frame.width = recursion_frame.parentNode.scrollWidth
    recursion_frame.height = recursion_frame.width
    const i = !location.search ? 1 :
      Number (location.search.split ("?").pop ()) + 1
    if (i < 12) {
        const path = `/rmit/ccs/2022/09/03/recursion.html?${ i }`
        recursion_frame.src = `http://thomas.capogre.co` + path
    }
    else {
        recursion_frame.src = ''
    }
</script>

```html
<iframe  id='recursion'></iframe>

<script>
    const recursion_frame = document.getElementById ('recursion')
    console.dir (recursion_frame)
    recursion_frame.width = recursion_frame.parentNode.scrollWidth
    recursion_frame.height = recursion_frame.width
    const i = !location.search ? 1 :
      Number (location.search.split ("?").pop ()) + 1
    if (i < 12) {
        const path = `/rmit/ccs/2022/09/03/recursion.html?${ i }`
        recursion_frame.src = `http://thomas.capogre.co` + path
    }
</script>
```

*inspired by the Creative Coding Enhancement students at Preston High School 🚀 

**also inspired by [this blog](https://www.bryanbraun.com/2021/03/24/infinitely-nested-iframes/) post by Bryan Braun 🤓

---

At its heart, recursion is self-reference. Recursive functions are functions that call themselves.  You could call it a fancy way of iterating, but I believe the history of recursive functions may in fact pre-date for-loops, so maybe a better description might be **the OG way of iterating**.  However, recursion can do branching self-similarity, something which is very clunky, if not impossible, to engineer with `for` loops.  We will explore the idea of branching self-similarity in the examples that follow.

There are many good resources on recursion:
-   [Free Code Camp: How Recursion Works](https://medium.com/free-code-camp/how-recursion-works-explained-with-flowcharts-and-a-video-de61f40cb7f9)
-   [The Coding Train: Recursion](https://youtu.be/jPsZwrV9ld0)
-   [Colt Steele: Recursion Crash Course](https://youtu.be/lMBVwYrmFZQ)
-   [Web Dev Simplified: What is Recursion - In Depth](https://youtu.be/6oDQaB2one8)
-   [Reducible: 5 Simple Steps for Solving Any Recursive Problem](https://youtu.be/ngCos392W4w)
-   [Computerphile: Programming Loops vs Recursion](https://youtu.be/HXNhEYqFo0o)


This post will explore some of the ideas from [The Coding Train: Algorithmic Botany](https://thecodingtrain.com/tracks/algorithmic-botany), which we will endeavour to recreate without p5, in vanilla javascript (ie. with [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)).

##  Vectors

First let's define a `Vector` class to help take care of some of the trigonometry.  

```javascript
const TAU = Math.PI * 2

class Vector {
    constructor (x, y) {
        this.x = x
        this.y = y
    }

    add (v) {
        this.x += v.x
        this.y += v.y
    }

    subtract (v) {
        this.x -= v.x
        this.y -= v.y
    }

    mult (m) {
        this.x *= m
        this.y *= m
    }

    mag () { // using a^2 + b^2 = c^2
        return ((this.x ** 2) + (this.y ** 2)) ** 0.5
    }

    setMag (m) {
        this.mult (m / this.mag ())
    }

    rotate (a) {
        // from "Formula for rotating a vector in 2D" by Matthew Brett
        // https://matthew-brett.github.io/teaching/rotation_2d.html

        const new_x = (this.x * Math.cos (a)) - (this.y * Math.sin (a))
        const new_y = (this.x * Math.sin (a)) + (this.y * Math.cos (a))

        this.x = new_x
        this.y = new_y
    }

    clone () {
        return new Vector (this.x, this.y)
    }
}

function vector_from_angle (angle, magnitude) {
    const x = magnitude * Math.cos (angle)
    const y = magnitude * Math.sin (angle)
    return new Vector (x, y)
}
```

<script>
    const TAU = Math.PI * 2

    class Vector {
        constructor (x, y) {
            this.x = x
            this.y = y
        }

        add (v) {
            this.x += v.x
            this.y += v.y
        }

        subtract (v) {
            this.x -= v.x
            this.y -= v.y
        }

        mult (m) {
            this.x *= m
            this.y *= m
        }

        mag () { // using a^2 + b^2 = c^2
            return ((this.x ** 2) + (this.y ** 2)) ** 0.5
        }

        setMag (m) {
            this.mult (m / this.mag ())
        }

        rotate (a) {
            // from "Formula for rotating a vector in 2D" by Matthew Brett
            // https://matthew-brett.github.io/teaching/rotation_2d.html

            const new_x = (this.x * Math.cos (a)) - (this.y * Math.sin (a))
            const new_y = (this.x * Math.sin (a)) + (this.y * Math.cos (a))

            this.x = new_x
            this.y = new_y
        }

        clone () {
            return new Vector (this.x, this.y)
        }
    }

    function vector_from_angle (angle, magnitude) {
        const x = magnitude * Math.cos (angle)
        const y = magnitude * Math.sin (angle)
        return new Vector (x, y)
    }
</script>

I've added a `.rotate ()` method, inspired by [this blog post](https://matthew-brett.github.io/teaching/rotation_2d.html) by Matthew Brett.  

Let's whip up a quick test sketch:

```html
<canvas id='rotation_test'></canvas>

<script type='module'>
    // using a 'module' type here keeps 
    // the scope seperate from the global scope
    // this is helpful as I will want to reuse
    // 'cnv' and 'ctx' variable names later

    // get and format canvas element
    const cnv = document.getElementById ('rotation_test')
    cnv.width = cnv.parentNode.scrollWidth
    cnv.height = cnv.width * 9 / 16

    // get cavnas context
    const ctx = cnv.getContext ('2d')

    // vector to the centre of the canvas
    const mid = new Vector (cnv.width / 2, cnv.height / 2)

    // vector going straight up, with a magnitude
    // equal to half the height of the canvas
    const hand = new Vector (0, mid.y * -1)

    // declare mutable variable to count the seconds
    let seconds = 0

    // function describing each tick of the clock
    function tick () {

        // cloning the hand vector so transformations
        // won't affect the original
        const abs_hand = hand.clone ()

        // adding the mid vector
        // to get the absolute position
        abs_hand.add (mid)

        // drawing a line Canvas API style
        ctx.beginPath ()
        ctx.moveTo (mid.x, mid.y)
        ctx.lineTo (abs_hand.x, abs_hand.y)
        ctx.stroke ()

        // rotating the original hand vector
        hand.rotate (TAU / 60)

        // iterating the seconds counter
        seconds++

        // if less than 60 seconds
        // call tick again, after 1000 milliseconds
        if (seconds < 60 ) setTimeout (tick, 1000)
    }

    // calling tick once to set off the recursive sequence
    tick ()
```

Looks like the new `.rotate ()` method is working as intended:

<canvas id='rotation_test'></canvas>

<script type='module'>
    // using a 'module' type here keeps 
    // the scope seperate from the global scope
    // this is helpful as I will want to reuse
    // 'cnv' and 'ctx' variable names later

    // get and format canvas element
    const cnv = document.getElementById ('rotation_test')
    cnv.width = cnv.parentNode.scrollWidth
    cnv.height = cnv.width * 9 / 16

    // get cavnas context
    const ctx = cnv.getContext ('2d')

    // vector to the centre of the canvas
    const mid = new Vector (cnv.width / 2, cnv.height / 2)

    // vector going straight up, with a magnitude
    // equal to half the height of the canvas
    const hand = new Vector (0, mid.y * -1)

    // declare mutable variable to count the seconds
    let seconds = 0

    // function describing each tick of the clock
    function tick () {

        // cloning the hand vector so transformations
        // won't affect the original
        const abs_hand = hand.clone ()

        // adding the mid vector
        // to get the absolute position
        abs_hand.add (mid)

        // drawing a line Canvas API style
        ctx.beginPath ()
        ctx.moveTo (mid.x, mid.y)
        ctx.lineTo (abs_hand.x, abs_hand.y)
        ctx.stroke ()

        // rotating the original hand vector
        hand.rotate (TAU / 60)

        // iterating the seconds counter
        seconds++

        // if less than 60 seconds
        // call tick again, after 1000 milliseconds
        if (seconds < 60 ) setTimeout (tick, 1000)
    }

    // calling tick once to set off the recursive sequence
    tick ()
</script>


A quick note -- because the function `tick` above uses `setTimeout` to call itself, already, we are using recursion.

##  Recursive Fractal Trees

from [this video](https://youtu.be/0jjeOYMjmDU).


<canvas id='fractal_tree_0'></canvas>

<script type='module'>
    const cnv = document.getElementById ('fractal_tree_0')
    cnv.width = cnv.parentNode.scrollWidth
    cnv.height = cnv.width * 9 / 16

    const ctx = cnv.getContext ('2d')

    const mid = new Vector (cnv.width / 2, cnv.height / 2)

    ctx.beginPath ()
    ctx.moveTo (mid.x, cnv.height)
    ctx.lineTo (mid.x, mid.y)
    ctx.stroke ()

</script>

