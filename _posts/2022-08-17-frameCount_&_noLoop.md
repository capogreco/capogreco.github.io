---
layout     : post
title      : "frameCount & noLoop"
date       : 2022-08-17
categories : RMIT CCS
---

p5 gives us `frameCount` as a way of keeping track of how times `draw ()` has been run.

In the `setup` function, `frameCount` is equal to 0, and the first time `draw` is run, `frameCount` is equal to 1.  The second, `frameCount` is equal to 2.  The third, 3.  Etc.

See the following code:

```javascript
function setup () {
  console.log (`setup! frameCount is ${ frameCount }`)
}

function draw () {
  console.log (`draw!! frameCount is ${ frameCount }`)  
  if (frameCount == 10) noLoop ()
}
```

Note that I am using some [conditional logic](https://youtu.be/1Osb_iGDdjk) in an if statement, to stop the `draw` function from looping after 10 iterations.

Also note that this code:
```javascript
if (frameCount == 10) noLoop ()

```
... is equivalent to this:
```javascript
if (frameCount == 10) {
    noLoop ()
}

```

We are allowed to omit the curly brackets if we are only doing executing one line.

The output looks like this:

![first ten frames](/etc/images/frameCount_&_noLoop.png)

#   Explore Further:

[FizzBuzz](https://en.wikipedia.org/wiki/Fizz_buzz) with `frameCount` - click the canvas to `loop ()`:

<iframe width=440 height=192 src="https://editor.p5js.org/capogreco/full/2BQ9oYijL"></iframe>

Code [here](https://editor.p5js.org/capogreco/sketches/2BQ9oYijL).