---
layout     : post
title      : "Recursion 😵‍💫"
date       : 2022-09-03
categories : RMIT CCS
---

<iframe  id='recursion'></iframe>

<script>
    const recursion_frame = document.getElementById ('recursion')
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

## To understand recursion

... you must first understand recursion.


At its heart, recursion is self-reference. Recursive functions are functions that call themselves.  You could call it a fancy way of iterating, but I believe the history of recursive functions may in fact pre-date for-loops, so maybe a better description might be **the OG way of iterating**.  However, recursion can do branching self-similarity, something which is very clunky, if not impossible, to engineer merely with for-loops.  We will explore the idea of branching self-similarity in the examples that follow.


This post will explore some of the ideas from [The Coding Train: Algorithmic Botany](https://thecodingtrain.com/tracks/algorithmic-botany), which we will endeavour to recreate without p5, in plain javascript (ie. with [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)).

##  Vectors: a sensible provision

First let's define a `Vector` class to help manage some of the trigonometry we will need to use:

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

    let running = false

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
        if (seconds < 60 ) {
            running = setTimeout (tick, 1000)
        }
        else {
            running = false
        }
    }

    // calling tick once to set off the recursive sequence
    tick ()

    // pass a function to handle clicks
    cnv.onclick = () => {

        //clear the canvas
        ctx.fillStyle = 'white'
        ctx.fillRect (0, 0, cnv.width, cnv.height)

        // reset the seconds variable
        seconds = 0

        if (!running) tick ()
    }
</script>


A quick note -- because the function `tick` above uses `setTimeout` to call itself, we are using recursion already!

##  Fractal Tree via Recursive Function

from [this video](https://youtu.be/0jjeOYMjmDU).


<canvas id='fractal_tree_0'></canvas>

<script type='module'>

    // get and format canvas
    const cnv = document.getElementById ('fractal_tree_0')
    cnv.width = cnv.parentNode.scrollWidth
    cnv.height = cnv.width * 9 / 16

    // get canvas context
    const ctx = cnv.getContext ('2d')

    // this is the recursive function that will draw the tree
    // it accepts three arguments:
    // base: vector describing the starting position
    // stem: vector describing the new line
    // generation: integer limiting the number of recursions
    function tree (base, stem, generation) {

        // start with the base position
        // we want to tranform it, so we make a copy
        const end = base.clone ()

        // add the stem to the start position
        end.add (stem)

        // draw the line from the start point
        // to the end point
        ctx.beginPath ()
        ctx.moveTo (base.x, base.y)
        ctx.lineTo (end.x, end.y)
        ctx.stroke ()

        // if generations is still positive
        if (generation > 0) {

            // clone the stem
            const L_stem = stem.clone ()

            // rotate it anti-clockwise
            L_stem.rotate (-TAU / 7)

            // reduce the length
            L_stem.mult (0.6)

            // clone the stem again
            const R_stem = stem.clone ()

            // rotate this one clockwise
            R_stem.rotate (TAU / 7)

            // reduce its length
            R_stem.mult (0.6)

            // decrease generation by 1
            const next_gen = generation - 1

            // recursively call tree twice, 
            // with end as the new base
            // L_stem & R_stem as the new stems
            // and next_gen as the new generation
            tree (end, L_stem, next_gen)
            tree (end, R_stem, next_gen)
        }
    }

    // new vector defining the starting point of our tree
    const seed = new Vector (cnv.width / 2, cnv.height)

    // new vector defining the first stem
    // ie. 150 pixels straight up
    const shoot = new Vector (0, -150)

    // pass seed in as the base argument
    // shoot as the stem argument
    // and 7, denoting that we want 7 recursions
    tree (seed, shoot, 7)
</script>

```html
<canvas id='fractal_tree_0'></canvas>

<script type='module'>

    // get and format canvas
    const cnv = document.getElementById ('fractal_tree_0')
    cnv.width = cnv.parentNode.scrollWidth
    cnv.height = cnv.width * 9 / 16

    // get canvas context
    const ctx = cnv.getContext ('2d')

    // this is the recursive function that will draw the tree
    // it accepts three arguments:
    // base: vector describing the starting position
    // stem: vector describing the new line
    // generation: integer limiting the number of recursions
    function tree (base, stem, generation) {

        // start with the base position
        // we want to tranform it, so we make a copy
        const end = base.clone ()

        // add the stem to the start position
        end.add (stem)

        // draw the line from the start point
        // to the end point
        ctx.beginPath ()
        ctx.moveTo (base.x, base.y)
        ctx.lineTo (end.x, end.y)
        ctx.stroke ()

        // if generations is still positive
        if (generation > 0) {

            // clone the stem
            const L_stem = stem.clone ()

            // rotate it anti-clockwise
            L_stem.rotate (-TAU / 7)

            // reduce the length
            L_stem.mult (0.6)

            // clone the stem again
            const R_stem = stem.clone ()

            // rotate this one clockwise
            R_stem.rotate (TAU / 7)

            // reduce its length
            R_stem.mult (0.6)

            // decrease generation by 1
            const next_gen = generation - 1

            // recursively call tree twice, 
            // with end as the new base
            // L_stem & R_stem as the new stems
            // and next_gen as the new generation
            tree (end, L_stem, next_gen)
            tree (end, R_stem, next_gen)
        }
    }

    // new vector defining the starting point of our tree
    const seed = new Vector (cnv.width / 2, cnv.height)

    // new vector defining the first stem
    // ie. 150 pixels straight up
    const shoot = new Vector (0, -150)

    // pass seed in as the base argument
    // shoot as the stem argument
    // and 7, denoting that we want 7 recursions
    tree (seed, shoot, 7)
</script>
```

We can randomise things somewhat to get some interesting results.  Click for a new tree:

<canvas id='fractal_tree_1'></canvas>

<script type='module'>
    const cnv = document.getElementById ('fractal_tree_1')
    cnv.width = cnv.parentNode.scrollWidth
    cnv.height = cnv.width * 9 / 16

    const ctx = cnv.getContext ('2d')

    // define a function to return a random value
    // between a minimum and maximum
    function rand_between (min, max) {
        const dif = max - min
        const off = Math.random () * dif
        return  min + off
    }

    // this function has been modified to recieve 
    // an options object housing angle and mult data
    function tree (base, stem, generation, options) {
        const end = base.clone ()
        end.add (stem)

        ctx.beginPath ()
        ctx.moveTo (base.x, base.y)
        ctx.lineTo (end.x, end.y)
        ctx.stroke ()


        if (generation > 0) {
            const L_stem = stem.clone ()

            // use the data in the options object
            // for the left angle
            L_stem.rotate (options.angle.l)

            // for the left multiplier
            L_stem.mult (options.mult.l)

            const R_stem = stem.clone ()

            // for the right angle
            R_stem.rotate (options.angle.r)

            // and for the right multiplier
            R_stem.mult (options.mult.r)

            const next_gen = generation - 1

            // pass the options object
            // on to the next generation
            tree (end, L_stem, next_gen, options)
            tree (end, R_stem, next_gen, options)
        }
    }

    const seed = new Vector (cnv.width / 2, cnv.height)
    const shoot = new Vector (0, -150)

    // function for a new tree
    function new_tree () {

        // clear the canvas
        ctx.fillStyle = `white`
        ctx.fillRect (0, 0, cnv.width, cnv.height)

        // create an options object
        // using object literal notation
        const options = {
            mult : {
                l : rand_between (0.5, 0.8),
                r : rand_between (0.5, 0.8),
            },

            angle : {
                l : rand_between (TAU / 12, TAU / 4) * -1,
                r : rand_between (TAU / 12, TAU / 4),
            }
        }

        // grow a tree using the options generated
        tree (seed, shoot, 8, options)
    }

    // assign the new_tree function to the 
    // .onclick property of the canvas
    cnv.onclick = new_tree

    // make a tree
    new_tree ()
</script>

```html
<canvas id='fractal_tree_1'></canvas>

<script type='module'>
    const cnv = document.getElementById ('fractal_tree_1')
    cnv.width = cnv.parentNode.scrollWidth
    cnv.height = cnv.width * 9 / 16

    const ctx = cnv.getContext ('2d')

    // define a function to return a random value
    // between a minimum and maximum
    function rand_between (min, max) {
        const dif = max - min
        const off = Math.random () * dif
        return  min + off
    }

    // this function has been modified to recieve 
    // an options object housing angle and mult data
    function tree (base, stem, generation, options) {
        const end = base.clone ()
        end.add (stem)

        ctx.beginPath ()
        ctx.moveTo (base.x, base.y)
        ctx.lineTo (end.x, end.y)
        ctx.stroke ()


        if (generation > 0) {
            const L_stem = stem.clone ()

            // use the data in the options object
            // for the left angle
            L_stem.rotate (options.angle.l)

            // for the left multiplier
            L_stem.mult (options.mult.l)

            const R_stem = stem.clone ()

            // for the right angle
            R_stem.rotate (options.angle.r)

            // and for the right multiplier
            R_stem.mult (options.mult.r)

            const next_gen = generation - 1

            // pass the options object
            // on to the next generation
            tree (end, L_stem, next_gen, options)
            tree (end, R_stem, next_gen, options)
        }
    }

    const seed = new Vector (cnv.width / 2, cnv.height)
    const shoot = new Vector (0, -150)

    // function for a new tree
    function new_tree () {

        // clear the canvas
        ctx.fillStyle = `white`
        ctx.fillRect (0, 0, cnv.width, cnv.height)

        // create an options object
        // using object literal notation
        const options = {
            mult : {
                l : rand_between (0.5, 0.8),
                r : rand_between (0.5, 0.8),
            },

            angle : {
                l : rand_between (TAU / 12, TAU / 4) * -1,
                r : rand_between (TAU / 12, TAU / 4),
            }
        }

        // grow a tree using the options generated
        tree (seed, shoot, 8, options)
    }

    // assign the new_tree function to the 
    // .onclick property of the canvas
    cnv.onclick = new_tree

    // make a tree
    new_tree ()
</script>
```

##  Objects: a brief detour

Note that I am using [object literal notation](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics) to package my options together and pass them to the `tree ()` function.  This is quite a common occurance in javascript, and can be a handy way of organising discrete bits of data that you want to pass around together.

As an example, this declaration:

```javascript
const thelonious = { species: 'cat' }
```

... stores in the the variable `thelonious` an object with the property, `species`.  Executing `console.log (thelonious.species)` would print `'cat'` to the console.  Inside the curly braces, properties (or key-value pairs) are indicated with a colon `:` and seperated by a comma `,`. For example:

```javascript
const thelonious = { species: 'cat', preoccupation: 'naps' }
```

In this case, `thelonious.species` returns `'cat'`, and `thelonious.preoccupation` returns `naps`.  We could format it like this:

```javascript
const thelonious = { 
    species: 'cat', 
    preoccupation: 'naps' 
}
```

We could further specify Thelonious' preoccupation into primary and secondary by doing something like this:

```javascript
const thelonious = { 
    species: 'cat', 
    preoccupation: {
        primary: 'naps',
        secondary: 'snacks'
    }
}
```

Here we are giving the `preoccupation` property an object with `primary` and `secondary` properties.  `thelonious.preoccupation.secondary`, for example, returns the string `'snacks'`.

You could format it like this if you want the colons to line up:
```javascript
const thelonious = { 
    species       : 'cat', 
    preoccupation : {
            primary   : 'naps',
            secondary : 'snacks'
    }
}
```

The options declaration, in the `new_tree ()` function in the above example, uses this type of nested object structure:

```javascript
const options = {
    mult : {
        l : rand_between (0.5, 0.8),
        r : rand_between (0.5, 0.8),
    },

    angle : {
        l : rand_between (TAU / 12, TAU / 4) * -1,
        r : rand_between (TAU / 12, TAU / 4),
    }
}
```

... storing randomised values in the `l` and `r` properties of the objects assigned to the `mult` and `angle` properties of the `options` object.  When the options object is passed to the `tree ()` function (and subsequent recursive calls of the `tree ()` function), those generated values are retrievable within that scope, and are used for the vector transformations all the way up the recursion tree, as we can see in this code excerpt:

```javascript
const L_stem = stem.clone ()

// use the value stored on the .l property of 
// the object stored on the .angle property of
// the options object:
L_stem.rotate (options.angle.l) 

// use the value stored on the .l property of 
// the object stored on the .mult property of
// the options object:
L_stem.mult (options.mult.l)

const R_stem = stem.clone ()

// use the value stored on the .r property of 
// the object stored on the .angle property of
// the options object:
R_stem.rotate (options.angle.r)

// use the value stored on the .r property of 
// the object stored on the .mult property of
// the options object:
R_stem.mult (options.mult.r)

const next_gen = generation - 1

tree (end, L_stem, next_gen, options)
tree (end, R_stem, next_gen, options)
```

You can learn more about javascript objects [here](https://javascript.info/object), [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects), and [here](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/objects-classes/README.md).

##  Fractal Tree via Recursive Object

We can do a similar thing, but with a class constructor instead of a function:

```javascript
// class definition
class Tree {

    // constructor receiving all the arguments 
    // the recursive function did
    // plus the canvas context
    constructor (base, stem, generation, options, ctx) {

        // storing all the arguments passed in
        // as properties of the new object
        this.base       = base
        this.stem       = stem
        this.generation = generation
        this.options    = options
        this.ctx        = ctx

        // create an empty array for the branches
        this.branches   = []

        // unless this is the last generation
        // run the .add_branches method
        if (generation > 0) this.add_branches ()

        // arbitrary width, dialed in via trial + error
        this.sway_width = 0.03

        // random ish sway rate
        // as this.generation decreases
        // towards the top of the tree
        // the sway rate gets faster
        this.sway_rate  = Math.random () * 2 / this.generation
    }

    // a method to add more branches
    add_branches () {

        // this is to find the absolute position
        // of the end of the branch
        const end = this.base.clone ()

        // add the stem (relative position)
        // to the absolute position of the base
        end.add (this.stem)

        // clone the stem for the L branch
        const L_stem = this.stem.clone ()

        // transform it according to the values
        // stored in the options object
        L_stem.rotate (this.options.angle.l)
        L_stem.mult (this.options.mult.l)

        // do the same for the R branch
        const R_stem = this.stem.clone ()
        R_stem.rotate (this.options.angle.r)
        R_stem.mult (this.options.mult.r)

        // decrease the generation number
        const next_gen = this.generation - 1

        // create two new Tree objects
        const l = new Tree (end, L_stem, next_gen, this.options, this.ctx)
        const r = new Tree (end, R_stem, next_gen, this.options, this.ctx)

        // push both into the .branches array
        this.branches.push (l)
        this.branches.push (r)
    }

    // the draw funcion accepts a now argument
    // which is the time in seconds
    draw (now) {

        // calculates the phase between 0 - 1
        const sway_phase = (now * this.sway_rate) % 1

        // turns the phase into a sinusoid
        // with an amplitude = this.sway_width 
        const sway_angle = Math.sin (sway_phase * TAU) * this.sway_width

        // we will make a new stem to rotate
        const sway_stem = this.stem.clone ()

        // rotate it with the sway angle
        sway_stem.rotate (sway_angle)

        // new absolute end point
        const end = this.base.clone ()

        // add the swaying stem to get
        // the new absolute position 
        // of the end of the stem
        end.add (sway_stem)

        // draw the line
        this.ctx.beginPath ()
        this.ctx.moveTo (this.base.x, this.base.y)
        this.ctx.lineTo (end.x, end.y)
        this.ctx.stroke ()

        // for each of the branches
        this.branches.forEach (b => {

            // assign the new absolute end point
            // as the branches base keeping the
            // branches attached to each other
            b.base = end.clone ()

            // call the branch's .draw method
            b.draw (now)
        })
    }
}
```

<script>
    // class definition
    class Tree {

        // constructor receiving all the arguments 
        // the recursive function did
        // plus the canvas context
        constructor (base, stem, generation, options, ctx) {

            // storing all the arguments passed in
            // as properties of the new object
            this.base       = base
            this.stem       = stem
            this.generation = generation
            this.options    = options
            this.ctx        = ctx

            // create an empty array for the branches
            this.branches   = []

            // unless this is the last generation
            // run the .add_branches method
            if (generation > 0) this.add_branches ()

            // arbitrary width, dialed in via trial + error
            this.sway_width = 0.03

            // random ish sway rate
            // as this.generation decreases
            // towards the top of the tree
            // the sway rate gets faster
            this.sway_rate  = Math.random () * 2 / this.generation
        }

        // a method to add more branches
        add_branches () {

            // this is to find the absolute position
            // of the end of the branch
            const end = this.base.clone ()

            // add the stem (relative position)
            // to the absolute position of the base
            end.add (this.stem)

            // clone the stem for the L branch
            const L_stem = this.stem.clone ()

            // transform it according to the values
            // stored in the options object
            L_stem.rotate (this.options.angle.l)
            L_stem.mult (this.options.mult.l)

            // do the same for the R branch
            const R_stem = this.stem.clone ()
            R_stem.rotate (this.options.angle.r)
            R_stem.mult (this.options.mult.r)

            // decrease the generation number
            const next_gen = this.generation - 1

            // create two new Tree objects
            const l = new Tree (end, L_stem, next_gen, this.options, this.ctx)
            const r = new Tree (end, R_stem, next_gen, this.options, this.ctx)

            // push both into the .branches array
            this.branches.push (l)
            this.branches.push (r)
        }

        // the draw funcion accepts a now argument
        // which is the time in seconds
        draw (now) {

            // calculates the phase between 0 - 1
            const sway_phase = (now * this.sway_rate) % 1

            // turns the phase into a sinusoid
            // with an amplitude = this.sway_width 
            const sway_angle = Math.sin (sway_phase * TAU) * this.sway_width

            // we will make a new stem to rotate
            const sway_stem = this.stem.clone ()

            // rotate it with the sway angle
            sway_stem.rotate (sway_angle)

            // new absolute end point
            const end = this.base.clone ()

            // add the swaying stem to get
            // the new absolute position 
            // of the end of the stem
            end.add (sway_stem)

            // draw the line
            this.ctx.beginPath ()
            this.ctx.moveTo (this.base.x, this.base.y)
            this.ctx.lineTo (end.x, end.y)
            this.ctx.stroke ()

            // for each of the branches
            this.branches.forEach (b => {

                // assign the new absolute end point
                // as the branches base keeping the
                // branches attached to each other
                b.base = end.clone ()

                // call the branch's .draw method
                b.draw (now)
            })
        }
    }
</script>


<canvas id='recursive_object_tree'></canvas>

<script type='module'>

    // get and format the canvas element
    const cnv = document.getElementById ('recursive_object_tree')
    cnv.width = cnv.parentNode.scrollWidth
    cnv.height = cnv.width * 9 / 16

    // get canvas context
    const ctx = cnv.getContext ('2d')

    // these option values give a nice tree, I think
    const options = {
        mult : {
            l : 0.6,
            r : 0.7,
        },

        angle : {
            l : -TAU / 4,
            r :  TAU / 7,
        }
    }

    const seed = new Vector (cnv.width / 2, cnv.height)
    const shoot = new Vector (0, -150)

    // this time constructing an object with the class
    // passing it the same arguments, and also the 
    // canvas context, then storing it in a variable
    const tree = new Tree (seed, shoot, 8, options, ctx)

    // function to draw the frames
    // accepts the argument 'now'
    // which requestAnimationFrame will pass
    // the current time to, in milliseconds
    function draw_frame (now) {

        // clear the canvas
        ctx.fillStyle = `white`
        ctx.fillRect (0, 0, cnv.width, cnv.height)

        // convert time to seconds
        // and pass to .draw method of tree
        tree.draw (now / 1000)
    
        // wait for the next frame 
        // then call draw_frame again
        requestAnimationFrame (draw_frame)
    }

    // initiate the animation
    requestAnimationFrame (draw_frame)
</script>

```html
<canvas id='recursive_object_tree'></canvas>

<script type='module'>

    // get and format the canvas element
    const cnv = document.getElementById ('recursive_object_tree')
    cnv.width = cnv.parentNode.scrollWidth
    cnv.height = cnv.width * 9 / 16

    // get canvas context
    const ctx = cnv.getContext ('2d')

    // these option values give a nice tree, I think
    const options = {
        mult : {
            l : 0.6,
            r : 0.7,
        },

        angle : {
            l : -TAU / 4,
            r :  TAU / 7,
        }
    }

    const seed = new Vector (cnv.width / 2, cnv.height)
    const shoot = new Vector (0, -150)

    // this time constructing an object with the class
    // passing it the same arguments, and also the 
    // canvas context, then storing it in a variable
    const tree = new Tree (seed, shoot, 8, options, ctx)

    // function to draw the frames
    // accepts the argument 'now'
    // which requestAnimationFrame will pass
    // the current time to, in milliseconds
    function draw_frame (now) {

        // clear the canvas
        ctx.fillStyle = `white`
        ctx.fillRect (0, 0, cnv.width, cnv.height)

        // convert time to seconds
        // and pass to .draw method of tree
        tree.draw (now / 1000)
    
        // wait for the next frame 
        // then call draw_frame again
        requestAnimationFrame (draw_frame)
    }

    // initiate the animation
    requestAnimationFrame (draw_frame)
</script>
```

---

There are many good resources on recursion:
-   [Free Code Camp: How Recursion Works](https://medium.com/free-code-camp/how-recursion-works-explained-with-flowcharts-and-a-video-de61f40cb7f9)
-   [The Coding Train: Recursion](https://youtu.be/jPsZwrV9ld0)
-   [Colt Steele: Recursion Crash Course](https://youtu.be/lMBVwYrmFZQ)
-   [Web Dev Simplified: What is Recursion - In Depth](https://youtu.be/6oDQaB2one8)
-   [Reducible: 5 Simple Steps for Solving Any Recursive Problem](https://youtu.be/ngCos392W4w)
-   [Computerphile: Programming Loops vs Recursion](https://youtu.be/HXNhEYqFo0o)


<iframe id='recursive_rectangles'></iframe>

<script>
    const iframe = document.getElementById ('recursive_rectangles')
    iframe.src = "https://editor.p5js.org/capogreco/full/iVA1FtAex"
    iframe.width = iframe.parentNode.scrollWidth
    iframe.height = (iframe.width * 9 / 16) + 42
</script>

<br>
