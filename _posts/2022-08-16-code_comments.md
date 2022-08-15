---
layout     : post
title      : "Code Comments"
date       : 2022-08-16
categories : RMIT CCS
---

When reading code written in computer languages, even ones we are familiar with, it can sometimes be difficult to understand what is going on.

Comments in javascript are indicated by two forward slashes.  They can either go at the start of a line, in which case the whole line is a comment, or they can go after some code, in which case the comment is whatever is to the right of the two forward slashes.

```javascript
// this is a code comment

const a = 40 // declaring variable "a", and assigning to it the value 40
```

For multi-line comments, bookend your text with `/*` and `*/`

```javascript
/* This is a multi line comment               *
 * Sometimes you will see this sort of thing, *
 * where the asterisks make a border,         *
 * around the comment.                        */
```

Multi-line comments can be used to do ascii art, if that is your style:

```javascript
/*___ __  __ ___ _____                                         
 | _ \  \/  |_ _|_   _|                                        
 |   / |\/| || |  | |                                          
 |_|_\_|  |_|___| |_|   _            ___         _ _           
  / __|_ _ ___ __ _| |_(_)_ _____   / __|___  __| (_)_ _  __ _ 
 | (__| '_/ -_) _` |  _| \ V / -_) | (__/ _ \/ _` | | ' \/ _` |
  \___|_| \___\__,_|\__|_|\_/\___|  \___\___/\__,_|_|_||_\__, |
 / __|_ __  ___ __(_)__ _| (_)___ __ _| |_(_)___ _ _     |___/ 
 \__ \ '_ \/ -_) _| / _` | | (_-</ _` |  _| / _ \ ' \          
 |___/ .__/\___\__|_\__,_|_|_/__/\__,_|\__|_\___/_||_|         
     |_|                                                     */
```

^ the ascii here was generated using [this tool](https://patorjk.com/software/taag/#p=display&f=Small&t=RMIT%0ACreative%20Coding%0ASpecialisation).

#   Understandability

Ultimately, comments necessary to help other humans understand your code.  

Consider this sketch:  

<iframe width=400 height=442 src="https://editor.p5js.org/capogreco/full/9mnbtmSnt"></iframe>

Compare the uncommented code, which you can find [here](https://editor.p5js.org/capogreco/sketches/9mnbtmSnt), with the commented code below:


```javascript
/*  ____  __  ____  ____  ____  ____  ___  
   (  _ \(  )/ ___)(  __)(  _ \/ ___)(__ \ 
    )   / )( \___ \ ) _)  )   /\___ \ (__/ 
   (__\_)(__)(____/(____)(__\_)(____/ (_)  
   A quick experiment vaguely based on OG blank VHS tape art.
   https://flashbak.com/blank-vhs-cassette-packaging-design-trends-art-402545/
*/

const risers = [] // declare variable "risers"
                  // assigning to it an empty array

function setup () {  // runs once, at the start

    createCanvas (400, 400) // creating a canvas
                            // 400 pixels wide &
                            // 400 pixels tall
}

function draw () {  // loops, after setup has run

    background ('purple')  // fills the canvas in purple

    // IF frame count is a multiple of 25
    // AND there are fewer than 8 elements
    // in the array assigned to the variable "risers"
    if (frameCount % 25 == 0 && risers.length < 8) { 

        // add to the "risers" array
        // a new Riser object (see class in riser.js)
        // with a height of 40, a period of 200,
        // and the colour, tomato
        risers.push (new Riser (40, 200, color('tomato')))
    }

    // for each object in the "risers" array
    // call the `increment ()` method
    risers.forEach (r => r.increment ())

    // for each object in the "risers" array
    // call the `show ()` method
    risers.forEach (r => r.show ()) 
    
    // the risers, drawn above, are in the background
    // the code below draws the worm-type thing

    const third = width / 3 // storing a third of the width
                            // in a variable called "third"

    const half  = width / 2 // stores half the width
                            // in a variable called "half"

    for (let i = 0; i < 256; i++) { // loop 256 times

        const period = i / 255 // create variable "period"
                               // as i goes from 0 to 255
                               // period goes from 0 to 1

        const y_pos = third + third * period  // create variable "y_pos"
                                              // as period goes from 0 to 1
                                              // y_pos goes from one third 
                                              // to two thirds

        // make an angle that increments both 
        // through the for loop, ie. with period
        // and through time, ie. with frameCount
        // slow the increment through time down
        // by dividing frameCount by 255
        // add the two together, and multiply by two pi
        // store the value in the variable "angle"
        const angle = (period + (frameCount / 255)) * PI * 2

        // make an x position by starting at the halfway mark
        // and adding the sine of the angle calculated previously
        // times a third of the width
        // new range: [ half - third, half + third ]
        const x_pos =  half + third * sin (angle)

        fill (i) // make the fill colour a shade of grey
                 // equal to i (which goes between 0 & 255)

        noStroke () // no outline

        // draw a circle at (x_pos, y_pos)
        // with a diameter of width / 3
        ellipse (x_pos, y_pos, third)
    }

}
```

You can find a commented version of the sketch, [here](https://editor.p5js.org/capogreco/sketches/hghxKI21N).
