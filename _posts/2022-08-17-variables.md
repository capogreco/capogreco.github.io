---
layout     : post
title      : "Variables"
date       : 2022-08-17
categories : RMIT CCS
---


<div align="center"><iframe width=400 height=442 src="https://editor.p5js.org/capogreco/full/CLb2LWbBU"></iframe></div>

<br>

In modern javascript there are two ways to declare variables - using `const` and `let`.  There is also `var`, which was the old way to declare variables before 2015, which works more or less the same way as `let`.

Using `let` (or `var`) makes the variable reassignable, whereas using `const` makes the variable **immutable**, which means unchangeable.  When you use `const`, you are specifying that this variable will always hold the value you assign to it when you declare it.

For example, this code is fine:

```javascript
let pet = 'dog'

pet = 'cat'

console.log (`I have a ${ pet } named Thelonious!`) 
// prints "I have a cat named Thelonious!"
```

Although we assigned the string `'dog'` to the variable `pet`, because we declared that variable with the keyword `let`, we are allowed to reassign to it the string `'cat'`, which overwrites its previous value, `'dog'`.

```javascript
const pet = 'dog'

pet = 'cat'  // Error!

console.log (`I have a ${ pet } named Thelonious!`) 
```

When we declare a variable with `const`, we are not allowed to reassign another value to it.  Doing so, as we have attempted to do with the line `pet = 'cat'` in the example above above, will cause an error like this:

```
TypeError: Assignment to constant variable.
```

When starting out, there is nothing wrong with using `let` to declare all your variables.  Using `const`, however, can improve memory allocation efficiency.

I will demonstrate briefly a handful ways you can use variables.

##  Using a variable to keep track of a changing value

Lets say we want to make a square move down the canvas using a variable.

Why would the following code not work?

```javascript
const y_pos = 200

function setup () {
  createCanvas (400, 400)
  rectMode (CENTER)
  noStroke ()
  fill (`turquoise`)
}

function draw () {
  background (`hotpink`)
  
  square (200, y_pos, 100)
  
  y_pos = y_pos + 1
}
```

<details>
    <summary>Answer</summary>
    In the last line of the code, we are trying to reassign the value of an immutable variable, ie. declared with `const`.
</details>

<br>

Consider the following code:
```javascript
function setup () {
  createCanvas (400, 400)
  rectMode (CENTER)
  noStroke ()
  fill (`turquoise`)
}

function draw () {
  let y_pos = 200

  background (`hotpink`)
  square (200, y_pos, 100)
  
  y_pos = y_pos + 1
}
```
While this code does not throw an error, the square does not move.  Why?

<details>
    <summary>Answer</summary>
    Every time the draw function loops, it creates a new variable called y_pos,  and assigns to it the value 200.  The value of y_pos is always 200 when the square is drawn, and just before the end of the function it is incremented, but then the function ends, and the incremented value is never used.  
</details>

<br>

We can see from these two examples, that if we want to keep track of a changing value between functions, or between different iterations of the same function, we need to:

1.  declare it to be mutable, ie. with `let` so we can reassign different values to it
2.  declare it in the global scope, ie. outside the function it operates in, so it will exist and retain its value after the function has ended

The following code uses a variable in this way, to make a square move down the canvas:

```javascript
let y_pos = 200

function setup () {
  createCanvas (400, 400)
  rectMode (CENTER)
  noStroke ()
  fill (`turquoise`)
}

function draw () {
  background (`hotpink`)
  square (200, y_pos, 100)
  
  y_pos = y_pos + 1
  
  if (y_pos > 450) {
    y_pos = -50
  }
}
```


Sketch is [here](https://editor.p5js.org/capogreco/full/CLb2LWbBU).

##  Using variables to simplify your code

Another important use for variables is when we want to break down a complex task into smaller, more manageable steps.

Lets imagine that we want to make a circle move around the canvas in a figure of eight pattern, and we want the circle to complete a full circuit approximately every 4 seconds.

Consider the following code:

```javascript
function setup () {
  createCanvas (400, 400)
  frameRate (25)
  noStroke ()
  fill (`turquoise`)
}

function draw () {
  background (`hotpink`)
  
  circle (200 + sin ((frameCount / 50) * TAU) * 100, 200 + sin ((frameCount / 100) * TAU) * 100, 100)
}
```

Sketch is [here](https://editor.p5js.org/capogreco/sketches/naawGMpjo).

While this code does what we want it to, three are several problems with it.

1.  writing code like this is unnecessarily conceptually difficult
2.  once it is written, it is difficult to understand
3.  even if you can understand it, the long line of code doesn't look very neat

It is preferable to break your code into shorter, more understandable chunks, even if all up it means writing more code.

Consider the following:

```javascript
function setup () {
  createCanvas (400, 400)
  frameRate (25)
  noStroke ()
  fill (`turquoise`)
}

function draw () {
  background (`hotpink`)
  
  const period = 100
  const mid = createVector (width / 2, height / 2)

  const p = frameCount % period / period

  const x_angle = p * TAU * 2
  const y_angle = p * TAU

  const x_offset = 100 * sin (x_angle)
  const y_offset = 100 * sin (y_angle)

  const x_pos = mid.x + x_offset
  const y_pos = mid.y + y_offset
  
  circle (x_pos, y_pos, 100)
}
```

This second example is preferrable to the first, even though the first is shorter, because it is easier to formulate to begin with, easier to understand after the fact, and looks much nicer and more orderly, making it easier for others to approach.

Note that in this case we have declared variables along the way, in the local scope, using `const`, with descriptive names, in order to hold a value which we then use in the next step.  

Once the results are used to draw the circle, the values of the variables can be lost at the termination of the function.  The next iteration of the function will derive new values for these variables with a newly incremented `frameCount` value.

<div align="center"><iframe width=400 height=442 src="https://editor.p5js.org/capogreco/full/bGoOskBGe"></iframe></div>

<br>

You can find the sketch [here](https://editor.p5js.org/capogreco/sketches/bGoOskBGe).