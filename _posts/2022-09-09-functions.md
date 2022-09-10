---
layout     : post
title      : "Functions"
date       : 2022-09-09
categories : RMIT CCS
---

Functions are bits of code that do something.  

When using p5, we define a `setup` function, and a `draw` function, which p5 calls for us behind the scenes - first `setup ()`, once, and then `draw ()`, repeatedly.  Because of this, the syntax for defining functions should be familiar to us:

```js
function name_of_function () {
    // code goes here
}
```

However, functions have some other affordances which may not be apparent to us from merely defining `setup` and `draw` functions for p5.  In this post we will look at a couple of different ways to use functions, and a couple of different ways to write them.

##  Calling functions

If class definitions are cookie cutters, and objects are the cookies, we might think about functions as being recipes.  We can write a recipe and have it just sit somewhere, inert.  Functions are much the same - we can define one, but it won't do anything unless it is called.

We call a function by using this syntax: 

```js
name_of_function ()
```

When a function is called, the computer looks for the function definition, and runs any code that it finds between the curly braces.

##  Side effects

When we are using a function to manipulate data outside the scope of that function, this is called a **side effect**.

Consider the following p5 sketch:

<iframe id=bouncer_w_functions></iframe>

<script>
    const frame = document.getElementById ('bouncer_w_functions')
    frame.src = "https://editor.p5js.org/capogreco/full/lqJs887v-"
    frame.width = frame.parentNode.scrollWidth
    frame.height = frame.width * 9 / 16
</script>

```js
const square_size = 100

let x_acc = 2
let x_vel = 0

let y_pos
let x_pos = 10

function setup () {
  createCanvas (window.innerWidth, window.innerHeight)
  
  // vertically centering the square
  y_pos = (height / 2) - (square_size / 2)
  noStroke ()
}

function draw () {
  background (`turquoise`)
  
  // calling the functions
  // defined below
  do_physics ()
  check_collision ()
  draw_square ()
}

// defining a function
function do_physics () {
  
  // add acceleration to velocity
  x_vel += x_acc
  
  // add velocity to position
  x_pos += x_vel  
}

// defining another function
function check_collision ()  {
  
  // if square touches R limit
  if (x_pos > width - square_size) {
    
    // reposition square to R limit
    x_pos = width - square_size
    
    // invert horizontal velocity
    x_vel *= -1
  }  
}

// defining another function
function draw_square () {
  
  // fill with pink
  fill (`hotpink`)
  
  // draw square using the data
  // stored in the global variables
  square (x_pos, y_pos, square_size)  
}
```

By organising our code into functions, our draw function itself has become relatively clean:

```js
function draw () {
  background (`turquoise`)
  
  do_physics ()
  check_collision ()
  draw_square ()
}
```

An important thing to note about the sketch above, is that the functions do their work by making changes outside their own local scope.  The `do_physics` and `check_collision` functions work by applying transformations to global variables, while the `draw_square` function works by calling the square function, which draws to the canvas element, which exists outside the local scope of the function itself.

When functions change things outside their own scope, this is called a **side effect**.  In simple sketches such as this, using side effects is a perfectly legitimate way to write your code.  However, as the complexity of your code increases, writing functions that work via their side effects can become messy and unpredictable.

##  Inputs & Outputs

One of the things that makes functions so useful is the ability to pass things into them from the context they are called from, and the ability for them to return things back to context from which they were called.

### Arguments

The way we can design a function to accept inputs passed in from outside itself, is to use **arguments**.  In a function definition, arguments are declared inside the parentheses after the function name, seperated by commas:

```js
function function_name (argument_1, argument_2) {
    // argument names can be used in the code here
}
```


Consider the following function definition:

```js
function say_hello_to (addressee) {
  console.log (`hello ${ addressee }!`)
}
```

In this function, we have specified one argument - `addressee`.  Arguments work a little bit like variables, except they refer to something that gets passed in from outside the function's scope.  In this function, whatever gets passed in to the function when it is called, will be used in the [template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) `` `hello ${ addressee }!` `` to construct a string, which is then passed in to `console.log ()`, and subsequently printed to the console.

During the function call, passing in the string `world`, like so:

```js
say_hello_to (`world`)
```

... assigns the string `world` to the argument `addressee`, causing the template literal `` `hello ${ addressee }!` `` to construct the string `hello world!`, which is subsequently printed to the console.

Consider the following sketch:

<iframe id='circle_of_squares'></iframe>

<script type='module'>
    const frame = document.getElementById ('circle_of_squares')
    frame.src = "https://editor.p5js.org/capogreco/full/VUG0zN5Cf"
    frame.width = frame.parentNode.scrollWidth
    frame.height = frame.width * 9 / 16
</script>


```js
// for trig convenience
const TAU = Math.PI * 2

// global variables
let mid, len

function setup () {
  
  // fill the view portal
  createCanvas (innerWidth,innerHeight)
  
  // vector to the middle of the canvas
  mid = createVector (width / 2, height / 2)
  
  // assign to len the lesser dimension
  len = width < height ? width : height
  
  // coordinates point to the middle
  // of the square
  rectMode (CENTER)
  
  // no outlines
  noStroke ()
}

function draw () {
  background (`turquoise`)
  
  // using 'len' to keep the squares in frame
  // regardless of portrait or landscape orientation
  circle_of_squares (mid, 7, len/3, frameCount/300, len/7)  
  circle_of_squares (mid, 5, len/6, -frameCount/100, len/14)

}

// defining a function with 5 arguments:
//   pos = position (as vector)
//   num = number of squares
//   rad = radius of the circle
//   ang = angle offset
//   siz = square side length
function circle_of_squares (pos, num, rad, ang, siz) {  
  
  // for loop will iterate num times
  for (let i = 0; i < num; i++) {
    
    // angle to go around the circle evenly
    const theta = i * TAU / num
    
    // make a vector using that angle
    const vec = p5.Vector.fromAngle (theta + ang)
    
    // set the magnitude = rad
    vec.setMag (rad)
    
    // note that the pos argument must be a vector
    vec.add (pos)
    
    // make it pink
    fill (`hotpink`)
    
    // draw a square at position vec with length siz
    square (vec.x, vec.y, siz)
  }
}
```

Note javascript uses the order of the arguments as they are passed in to assign them - the first element passed in is assigned to to the first argument, the second element to the second argument, etc.  In this case it was important that the first argument be a vector, while the rest could be simple numerical values.

### Return