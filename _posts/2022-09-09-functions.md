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

### Input: Parameters and Arguments

The way we can design a function to accept inputs passed in from outside itself, is to use **parameters**.  In a function definition, parameters are declared inside the parentheses after the function name, seperated by commas:

```js
function function_name (parameter_1, parameter_2) {
    // parameters can be used in the code here
}
```

When a function is defined with a parameter, this allows us to pass something in to it when we call it.  When we pass something into a function, we call that thing an **argument**.

When defining a function, parameters are like variables, allowing us to refer to the argument that gets passed in from outside the function's scope, in the body of the function definition.

Consider the following function definition:

```js
function say_hello_to (addressee) {
  console.log (`hello ${ addressee }!`)
}
```

In this function, we have specified one parameter - `addressee`.    In this function, whatever argument gets passed in to the function when it is called, will be used in the [template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) `` `hello ${ addressee }!` `` to construct a string, which is then passed in to `console.log ()`, and subsequently printed to the console.

During the function call, passing the string `world` in to this function, as an argument, would look like:

```js
say_hello_to (`world`)
```

The function takes the argument, `world`, and assigns it to the parameter `addressee`, which is then used by the template literal `` `hello ${ addressee }!` `` to construct the string `hello world!`, which is subsequently printed to the console.

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
  
  // passing in 5 arguments
  // using 'len' to keep the squares in frame
  // regardless of portrait or landscape orientation
  circle_of_squares (mid, 7, len/3, frameCount/300, len/7)  
  circle_of_squares (mid, 5, len/6, -frameCount/100, len/14)

}

// defining a function with 5 parameters:
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
    
    // note that the argument assigned to pos
    // must be a vector for this to work
    vec.add (pos)
    
    // make it pink
    fill (`hotpink`)
    
    // draw a square at position vec with length siz
    square (vec.x, vec.y, siz)
  }
}
```

Note javascript uses the order of the arguments as they are passed in to assign them - the first argument passed in is assigned to to the first parameter, the second argument to the second parameter, etc.  In this case it was important that the first argument be a vector, while the rest could be simple numerical values.

### Return

All of the functions we have looked at so far have worked via their **side effects**.  The alternative to this is for a function to do its work via what it **returns**.

Consider the following function definitions:

```js
function rand_colour () {

    // getting random integer values between 0-255
    const r = rand_int (256)
    const g = rand_int (256)
    const b = rand_int (256)

    // using a template literal to construct a string
    // then returning that string
    return `rgb(${ r }, ${ g }, ${ b })`
}

// declaring one parameter: max
function rand_int (max) {

    // assigning to d a value between 0 - max
    const d = Math.random () * max

    // Math.floor cuts off any decimal value
    const i = Math.floor (d)

    // return the integer value
    return i
}

```

Both these functions provide their use by fashioning something which is then returned to the context of the function call.  For example, on the line:

```js
const r = rand_int (256)
```

... the context of the function call is the procedure that assigns a value to `r`.  So the function executes the code in the body of its function definition, assigning the argument `256` to its parameter `max`, and when it returns the resulting integer, `i`, that value appears in place of the function call, in the context of the assignment to `r`.

Once defined, these functions can be used like this:

<div id = rand_col_div></div>

<script type = module>
    const div = document.getElementById ('rand_col_div')
    div.width = div.parentNode.scrollWidth

    // divs want their height specified like this
    // for some reason
    div.style.height = `${ div.width * 9 / 16 }px`

    // assigning a random colour to the div background
    // via this function, defined below
    change_colour ()

    // assigning the same function to 
    // the onclick property of the div
    div.onclick = change_colour

    function change_colour () {

        // using rand_colour to return a string
        // and assign it to this property of the div
        div.style.backgroundColor = rand_colour ()
    }

    function rand_colour () {
        const r = rand_int (256)
        const g = rand_int (256)
        const b = rand_int (256)
        return `rgb(${ r }, ${ g }, ${ b })`
    }

    function rand_int (max) {
        const d = Math.random () * max
        const i = Math.floor (d)
        return i
    }
</script>

```html
<div id = rand_col_div></div>

<script type = module>
    const div = document.getElementById ('rand_col_div')
    div.width = div.parentNode.scrollWidth

    // divs want their height specified like this
    // for some reason
    div.style.height = `${ div.width * 9 / 16 }px`

    // assigning a random colour to the div background
    // via this function, defined below
    change_colour ()

    // assigning the same function to 
    // the onclick property of the div
    div.onclick = change_colour

    function change_colour () {
        
        // using rand_colour to return a string
        // and assign it to this property of the div
        div.style.backgroundColor = rand_colour ()
    }

    function rand_colour () {
        const r = rand_int (256)
        const g = rand_int (256)
        const b = rand_int (256)
        return `rgb(${ r }, ${ g }, ${ b })`
    }

    function rand_int (max) {
        const d = Math.random () * max
        const i = Math.floor (d)
        return i
    }
</script>
```

## Hoisting

Javascript, as in most computer languages, executes code on the first line first, the second line second, etc. going down the document from the top.  However, you may have noticed that in almost all of these examples, we are able to use functions *above* where we have defined them.  The reason we are able to do this is because functions are [hoisted](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting#function_hoisting) - moved to the top of the scope in which they are defined, by the interpreter.

##  Arrow Functions

Since the [advent of ES 6 in 2015](https://www.w3schools.com/js/js_es6.asp), arrow functions have become a legitimate alternative syntax to using the `function` keyword when defining functions.

Let's imagine that we have an array `arr` which is full of objects, and that each of these objects has a method called `draw`, and that we want to write a function that will help us call that method for each of the objects.

Consider the following function definition:

```js
function call_draw_on (obj) {
    obj.draw ()
}
```

The function takes an argument, which is assigned to the parameter `obj`, on which a `.draw ()` method is called in the body of the function definition.

Such a function could then be passed into the `.forEach ()` array method, like this:

```js
arr.forEach (call_draw_on)
```

The `.forEach` method here grabs each element in its array, one after the other, and passes them to the `call_draw_on` function, as an argument, each time.  The `call_draw_on` function then assigns each element to its parameter, `obj`, and, one by one, calls `.draw ()` on them.

Using arrow notation to rewrite the function definition could look like this:

```js
const call_draw_on = (obj) => {
    obj.draw ()
}
```

We can note that here we have assigned something to the variable `call_draw_on`.  The thing we have assigned to it, is a function that uses arrow syntax.  For the purpose we are describing here, this function works exactly the same as when you define it using the `function` keyword[^1].


We can note that the parameters are still declared inside parentheses, and if we had more than one, they would be seperated by commas.  However, because we have only one parameter, arrow function syntax lets us lose those initial parentheses:

```js
const call_draw_on = obj => {
    obj.draw ()
}
```

This, again, work exactly the same way.  We can note that the body of the function, like when using the `function` keyword, is still between curly braces.  However, because the body of the function is only one line of code, we can remove them too:

```js
const call_draw_on = obj => obj.draw ()
```

Again, this works exactly the same way.  If we shorten the parameter from `obj` to `o`, the function becomes even more concise:

```js
const call_draw_on = o => o.draw ()
```

... and we find ourselves in the peculiar situation where the function definition `o => o.draw ()` is actually fewer characters than our assignment `const call_draw_on =`.  And since we may not be using this function elsewhere in our code, it might make more sense to simply define the function in situ, ie. inside the `.forEach` method call, and not worry about assigning it to a variable at all:

```js
arr.forEach (o => o.draw ())
```

In this way, arrow function syntax represents a potentially much more concise alternative to the conventional method of defining functions.

[^1]: there is a difference in how functions defined with `function` and `=>` specify what the `this` keyword refers to.  You can learn more about arrow functions, and how their treatment of `this` differs from `function` functions, [here](https://youtu.be/h33Srr5J9nY) and [here](https://youtu.be/thXp0_py9X4).