---
layout     : post
title      : "Iteration"
date       : 2022-08-21
categories : RMIT CCS
---

Iteration happens anywhere a process is repeated many times.  In computer science, one of the predominant techniques for achieving iteration is by using a `for` loop, although there are also many other ways.  For a comprehensive review of iteration in javascript, MDN have [a good chapter in their JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration).

This blog post will cover a handful of ways iterating might be useful to you in your creative coding practice.

##   frameCount

The first example of iteration to note is p5's `draw ()` function.  After the `setup ()` function has been executed, p5's default behaviour is to iterate, or loop, the `draw ()` function.  Each time `draw ()` iterates, `frameCount` is incremented by `1`.

In this way, we can see that by simply moving an object across the canvas using `frameCount`, we are already harnessing the power of iteration:

<iframe width=400 height=442 src="https://editor.p5js.org/capogreco/full/VpfjDwFjU"></iframe>

View the code, [here](https://editor.p5js.org/capogreco/sketches/VpfjDwFjU).

##   while

A while loop takes as its argument a conditional logic statement, and executes a block of code if that statement returns a value of `true`.  Consider the following sketch:

```javascript
function setup () {
  createCanvas (400, 200)
  fill ('hotpink')
  noStroke ()
  noLoop () // do not loop draw 
}

function draw () {
  background ('turquoise')
  
  let x = 5
  while (x < width) {
    square (x, 95, 10)
    x = x + 20 // x is incremented by 20
               // each time through the loop
  }  
}
```

We have declared a mutable variable, `x`, and initialised it with a value of `5`.

The while statement looks at this variable, and checks to see if it is less than the width of the canvas.  If this is `true` then the code block specified by the curly braces executes.  

Once the block has been executed, the conditional logic is checked again.  If the statement is still `true` then the code block executes again.  The code block will continue to loop as long as the conditional logic statement returns `true`.

In this instance, `x` is incremented by a value of `20` with each loop of the code block, and so eventually the value of `x` becomes greater than the width of the canvas, and so the conditional logic statement returns `false` and the loop terminates.

<iframe width=400 height=242 src="https://editor.p5js.org/capogreco/full/qW7ZDA7XY"></iframe>

**Be careful to ensure that the conditional logic statement will eventually return false -- otherwise you will end up with an infinite loop, which can lock up your browser**.

##   for

Refactoring this sketch to use a `for` loop can make things somewhat safer.  

Consider the following code:

```javascript
function setup () {
  createCanvas (400, 200)
  fill ('hotpink')
  noStroke ()
  noLoop () // do not loop draw 
}

function draw () {
  background ('turquoise')
  
  for (let x = 5; x < width; x += 20) {
    square (x, 95, 10)
  }  
}
```

Here you can see that the `for` loop incorporates the code to declare and initialise a variable; the conditional logic we were passing in to the `while` statement in the previous example; and the code that increments the variable.  

Building these three things into the syntax of the `for` loop makes it harder to forget to increment the variable, making them somewhat safer than `while`.

It is worth noting that `x += 20` does the same thing as `x = x + 20`, just with a more concise syntax.

It is also worth noting that `i++` does the same thing as `i += 1`, which is the same as `i = i + 1`.  This is very common to see in a `for` loop.  Similarly, `i--` is equivalent to `i -= 1`, which is equivalent to `i = i - 1`.

You can experiment with the above code, [here](https://editor.p5js.org/capogreco/sketches/nrXXEXOBN).

##   Nested for loops

The above example iterates the square horizontally across the canvas.  We iterate that whole `for` loop by nesting it inside another `for` loop which iterates vertically, to yield a grid:

```javascript
for (let y = 5; y < height; y += 20) {
    for (let x = 5; x < width; x += 20) {
        square (x, y, 10) // both x and y are passed in
                          // to the square function
    }
}
```

<iframe width=400 height=242 src="https://editor.p5js.org/capogreco/full/WCLYbeYwP"></iframe>

View the code, [here](https://editor.p5js.org/capogreco/sketches/WCLYbeYwP).

##   forEach

Javascript also lets you iterate over an array, taking each element out in turn, using it for some repeated process.

Consider the following code:

```javascript
const colours = [ 'salmon', 'lavender', 'fuchsia' ]

function setup () {
  createCanvas (400, 150)
  noStroke ()
  noLoop ()
}

function draw () {
  background (0)
  colours.forEach ((col, i) => {
    fill (col)
    square (25 + (i * 125), 25, 100)
  })
} 
```

The draw function here calls an instance method `.forEach ()` on the array `colours`.  A method is like a function that has been attached to an object.  In this case, the array object has a method, `.forEach ()`, which takes an anonymous function as its argument.  In this case we are writing this function entirely inside the method's parentheses, using [arrow function syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions).

In turn, each element of the array is passed into the function we are passing to the `.forEach ()` method, as the first argument, `col`.  The index of that element is passed to the second argument, in this case, `i`.  These arguments are then used in the code block, which runs, in this case, three times, to draw the three squares with their corrolating `fill ()` colours and x coordinates:

<iframe width=400 height=192 src="https://editor.p5js.org/capogreco/full/SmuOKrLE5"></iframe>

Note also that if your function only takes one argument you can forego the parentheses that delineate the arguments of the arrow function, and if your function only has one line of code, you can forego the curly braces also.

The following, for example:

```javascript
const colours = [ 'salmon', 'lavender', 'fuchsia' ]

colours.forEach (col => console.log (col))
```

... prints each of the strings contained in the `colours` array to the console, in turn.

