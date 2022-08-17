---
layout     : post
title      : "Template Literals"
date       : 2022-08-17
categories : RMIT CCS
---

In javascript, you can write a string using `'single quotes'`, or `"double quotes"`, or backticks:

```javascript
const msg = `this is also a string`
```

The nice thing about using backticks, is that you can refer to a variable directly using `${ ... }` syntax.  Consider the following code:

```javascript

const hello = 'world'

const ver_1 = 'regular quotes: hello ${ hello }!'
const ver_2 = `backticks: hello ${ hello }!`

console.log (ver_1)
console.log (ver_2)
```

![regular quotes vs backticks](/etc/images/quotes_vs_backticks.png)

... and the following [sketch](https://editor.p5js.org/capogreco/sketches/iFK6O_L7A):

```javascript
function setup () {
  createCanvas (440, 150)
  textAlign(CENTER, CENTER)
  textSize (32)
  noStroke ()
}

function draw () {
  background (`turquoise`)

  // using a template literal to construct a string:
  const msg = `we are up to frame ${ frameCount }!`

  text (msg, width / 2, height / 2)
}
```

<iframe src="https://editor.p5js.org/capogreco/full/iFK6O_L7A" width=440 height=192></iframe>