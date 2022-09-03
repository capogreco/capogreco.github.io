---
layout     : post
title      : "Web Audio API: Synths"
date       : 2022-08-25
categories : RMIT CCS
---

It is an underappreciated fact that modern browsers already contain all the necessary components required to build a software synthesiser. In order to form a functional synthesiser, these components (oscillators, amplifiers, filters, etc.) need to be wired together using Web Audio API.  In this post, we will be looking at how this works.

##  Anatomy of a synthesiser

![diagram of input, oscillator, filter, amplifier, output](/etc/images/landr_subtractive_synthesis.jpg)

*This diagram was taken from [this blog post](https://blog.landr.com/subtractive-synthesis/), where you will also find a much more comprehensive explanation of subtractive synthesis.*

The component responsible for generating the sound here is the **oscillator**.  The **amplifier** is responsible for turning the volume of the oscillator down and off so it is not making sound when we don't want it to be making sound.  

Lets build a simple synthesiser with just an oscillator and an amplifier.

## Simple Synthesiser

First, create the audio context, and make it resume with a user gesture:

<div id='resume_audio'></div>

<script>
    // get and format div element
    const div_0  = document.getElementById ('resume_audio')
    div_0.width  = div_0.parentNode.scrollWidth
    div_0.style.height     = `${ div_0.width * 9 / 16 }px`
    div_0.style.textAlign  = 'center'
    div_0.style.lineHeight = div_0.style.height
    div_0.style.fontSize   = '36px'
    div_0.style.fontWeight = 'bold'
    div_0.style.fontStyle  = 'italic'
    div_0.style.color      = 'white'
    div_0.style.backgroundColor = 'hotpink'

    // get and suspend audio context
    const audio_context = new AudioContext ()
    audio_context.suspend ()

    // create string with context state
    const init_msg = `audio context is ${ audio_context.state }`

    // convert to uppercase and pass to div element
    div_0.innerText = init_msg.toUpperCase ()

    // define an async click handler function 
    async function init_audio () {

        // wait for audio context to resume
        await audio_context.resume ()

        // then set background colour
        div_0.style.backgroundColor = 'limegreen'

        // create string with new context state
        const msg = `audio context is ${ audio_context.state }`

        // unitalicise text style
        div_0.style.fontStyle  = 'normal'

        // convert to uppercase and pass to div element
        div_0.innerText = msg.toUpperCase ()
    }

    // pass anonymous function to the .onclick property
    // of the div element
    div_0.onclick = _ => {

        // if audio context is not running
        if (audio_context.state != 'running') {

            // call the async init audio function
            init_audio ()
        }
    }
</script>

<br>

The code I used to do this ↑ inside my markdown, can be found below.  Note that I am using a `<div></div>` element, rather than a `<canvas></canvas>`:

```html
<div id='resume_audio'></div>

<script>
    // get and format div element
    const div_0  = document.getElementById ('resume_audio')
    div_0.width  = div_0.parentNode.scrollWidth
    div_0.style.height     = `${ div_0.width * 9 / 16 }px`
    div_0.style.textAlign  = 'center'
    div_0.style.lineHeight = div_0.style.height
    div_0.style.fontSize   = '36px'
    div_0.style.fontWeight = 'bold'
    div_0.style.fontStyle  = 'italic'
    div_0.style.color      = 'white'
    div_0.style.backgroundColor = 'hotpink'

    // get and suspend audio context
    const audio_context = new AudioContext ()
    audio_context.suspend ()

    // create string with context state
    const init_msg = `audio context is ${ audio_context.state }`

    // convert string to uppercase and pass to div element
    div_0.innerText = init_msg.toUpperCase ()

    // define an async click handler function 
    async function init_audio () {

        // wait for audio context to resume
        await audio_context.resume ()

        // then set background colour
        div_0.style.backgroundColor = 'limegreen'

        // create string with new context state
        const msg = `audio context is ${ audio_context.state }`

        // unitalicise text style
        div_0.style.fontStyle  = 'normal'

        // convert to uppercase and pass to div element
        div_0.innerText = msg.toUpperCase ()
    }

    // pass anonymous function to the .onclick property
    // of the div element
    div_0.onclick = _ => {

        // if audio context is not running
        if (audio_context.state != 'running') {
            
            // call the async init audio function
            init_audio ()
        }
    }
</script>
```

To create an oscillator node, we use the `.createOscillator ()` method on the audio context:

```javascript
// store a new oscillator node in a variable
const osc_node = audio_context.createOscillator ()

// oscillators come in four flavours:
// sine, triangle, sawtooth, and square
// sonically, sine is the simplest
// giving a pure note with no harmonics
osc_node.type = 'sine'

// this is the oscillations per second
// or Hertz (Hz)
// of the oscillator
osc_node.frequency.value = 330

// store a new gain node in a variable
const amp_node = audio_context.createGain ()

// set the gain of that node to 0
// ie. don't let any sound through
amp_node.gain.value = 0

// connect the oscillator node
// to the gain node
osc_node.connect (amp_node)

// connect the gain node to
// the audio output device
// on the audio context
amp_node.connect (audio_context.destination)

// start the oscillator
osc_node.start ()
```

<script>
    // store a new oscillator node in a variable
    const osc_node = audio_context.createOscillator ()

    // oscillators come in four flavours:
    // sine, triangle, sawtooth, and square
    // sonically, sine is the simplest
    // giving a pure note with no harmonics
    osc_node.type = 'sine'

    // this is the oscillations per second
    // or Hertz (Hz)
    // of the oscillator
    osc_node.frequency.value = 440

    // store a new gain node in a variable
    const amp_node = audio_context.createGain ()

    // set the gain of that node to 0
    // ie. don't let any sound through
    amp_node.gain.value = 0

    // connect the oscillator node
    // to the gain node
    osc_node.connect (amp_node)

    // connect the gain node to
    // the audio output device
    // on the audio context
    amp_node.connect (audio_context.destination)

    // start the oscillator
    osc_node.start ()
</script>

Our component nodes are now wired to each other and to the output like this:

**Oscillator → Amplifier → Audio Output Device**

Since we called `.start ()` on the oscillator, it is producing a signal which is reaching the amplifier, but the amplifier's gain is set to `0` so no sound is getting through to the output.

By wiring a button to interface with the amplifier's `.gain` property, we can make a rudimentary on / off switch:

<div align='center'><button id='tone_switch'></button></div>

<br>

<script>
    // get the button and store it in a variable
    const btn = document.getElementById ('tone_switch')
    btn.innerText = 'Press for tone!' // give it some text
    btn.value = 'off'                 // give it a value

    // declare a function for toggling the sound
    function toggle_sound () {

        // if button value is 'off'
        if (btn.value == 'off') {

            // set the gain to 0.3
            amp_node.gain.value = 0.3

            // set the value to 'on'
            btn.value = 'on'

            // change the text
            btn.innerText = 'Press to stop!'
        }

        // if button value is `on`
        else if (btn.value = 'on') {

            // set the gain to 0
            amp_node.gain.value = 0

            // set the value to `off`
            btn.value = 'off'

            // change the text
            btn.innerText = 'Press for tone!'
        }
    }

    // this is the click handler for the button
    // we are using arrow notation to write
    // a function with no name
    // ie. an anonymous function
    btn.onclick = () => {

        // if the audio context is still suspended
        // resume the audio context first
        if (audio_context.state != 'running') init_audio ()

        // then call the toggle sound function
        toggle_sound ()
    }
</script>

```html
<div align='center'><button id='tone_switch'></button></div>

<script>
    // get the button and store it in a variable
    const btn = document.getElementById ('tone_switch')
    btn.innerText = 'Press for tone!' // give it some text
    btn.value = 'off'                 // give it a value

    // declare a function for toggling the sound
    function toggle_sound () {

        // if button value is 'off'
        if (btn.value == 'off') {

            // set the gain to 0.3
            amp_node.gain.value = 0.3

            // set the value to 'on'
            btn.value = 'on'

            // change the text
            btn.innerText = 'Press to stop!'
        }

        // if button value is `on`
        else if (btn.value = 'on') {

            // set the gain to 0
            amp_node.gain.value = 0

            // set the value to `off`
            btn.value = 'off'

            // change the text
            btn.innerText = 'Press for tone!'
        }
    }

    // this is the click handler for the button
    // we are using arrow notation to write
    // a function with no name
    // ie. an anonymous function
    btn.onclick = () => {

        // if the audio context is still suspended
        // resume the audio context first
        if (audio_context.state != 'running') init_audio ()

        // then call the toggle sound function
        toggle_sound ()
    }
</script>
```

The main problem with doing things this way is that every component must have its own global variable, and wiring them together and keeping track of everything becomes unweildy.

In the next two sections we will explore two paradigms that will help us manage our use of Web Audio API: **functions**, and **objects**.


##  Transient Synths

One paradigm for working with software synthesisers is to create transient synths that play a single note and then delete themselves once they are done.  This paradigm organises the Web Audio API using functions.

Consider the following code:

```javascript
// define a function that plays a note
function play_note (note, length) {

    // if the audio context is not running, resume it
    if (audio_context.state != 'running') init_audio ()

    // create an oscillator
    const osc = audio_context.createOscillator ()

    // make it a triangle wave this time
    osc.type            = 'triangle'

    // set the value using the equation 
    // for midi note to Hz
    osc.frequency.value = 440 * 2 ** ((note - 69) / 12)

    // create an amp node
    const amp = audio_context.createGain ()

    // connect the oscillator 
    // to the amp
    // to the audio out
    osc.connect (amp).connect (audio_context.destination)

    // the .currentTime property of the audio context
    // contains a time value in seconds
    const now = audio_context.currentTime

    // make a gain envelope
    // start at 0
    amp.gain.setValueAtTime (0, now)

    // take 0.02 seconds to go to 0.4, linearly
    amp.gain.linearRampToValueAtTime (0.4, now + 0.02)

    // this method does not like going to all the way to 0
    // so take length seconds to go to 0.0001, exponentially
    amp.gain.exponentialRampToValueAtTime (0.0001, now + length)

    // start the oscillator now
    osc.start (now)

    // stop the oscillator 1 second from now
    osc.stop  (now + length)
}
```

<script>
    // define a function that plays a note
    function play_note (note, length) {

        // if the audio context is not running, resume it
        if (audio_context.state != 'running') init_audio ()

        // create an oscillator
        const osc = audio_context.createOscillator ()

        // make it a triangle wave this time
        osc.type            = 'triangle'

        // set the value using the equation 
        // for midi note to Hz
        osc.frequency.value = 440 * 2 ** ((note - 69) / 12)
    
        // create an amp node
        const amp = audio_context.createGain ()

        // connect the oscillator 
        // to the amp
        // to the audio out
        osc.connect (amp).connect (audio_context.destination)

        // the .currentTime property of the audio context
        // contains a time value in seconds
        const now = audio_context.currentTime

        // make a gain envelope
        // start at 0
        amp.gain.setValueAtTime (0, now)

        // take 0.02 seconds to go to 0.4, linearly
        amp.gain.linearRampToValueAtTime (0.1, now + 0.02)

        // this method does not like going to all the way to 0
        // so take length seconds to go to 0.0001, exponentially
        amp.gain.exponentialRampToValueAtTime (0.0001, now + length)

        // start the oscillator now
        osc.start (now)

        // stop the oscillator 1 second from now
        osc.stop  (now + length)
    }
</script>

Two aspects of this code are particularly noteworthy.  

The first is how all of the Web Audio API nodes we create and use are assigned to variables which exist within the local scope of the function, which means a seperate audio graph is created each time the function is called.  At the end, when `osc.stop ()` is eventually called, the oscillator node stops and the audio graph associated with it is removed by javascript's [garbage collector](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management).  So we can have a proliferation of notes, each of which will disappear on its own accord, and we won't need to worry about managing them beyond their initial instatiation in the function call.

The second aspect is how we are interfacing with the amp node's `.gain` property.  The object stored as the `.gain` property of a gain node is in fact an [AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam). Web Audio API uses **AudioParams** to modulate attributes of nodes in real time.  If timing is not important, we can simply assign a value to the `.value` property of an **AudioParam**.  The `.setValueAtTime ()`, `.linearRampToValueAtTime ()`, and `.exponentialRampToValueAtTime ()` methods are more exact and more flexible, allowing us to create [envelopes](https://en.wikipedia.org/wiki/Envelope_(music)).  Furthermore, it is possible for us to connect a node output to another node's **AudioParam**, allowing for [LFOs](https://en.wikipedia.org/wiki/Low-frequency_oscillation) and [frequency modulation](https://en.wikipedia.org/wiki/Frequency_modulation).  Although these specific topics fall outside the scope of this blog post, I may return to them in a future post.

Try moving the cursor around the canvas below:

<canvas id='rapid_notes'></canvas>

<script> 
    const cnv_0 = document.getElementById (`rapid_notes`)
    cnv_0.width = cnv_0.parentNode.scrollWidth
    cnv_0.height = cnv_0.width * 9 / 16
    cnv_0.style.backgroundColor = 'orange'

    const notes = [ 62, 66, 69, 73, 74, 73, 69, 66 ]
    let i = 0
    let running = false
    let period = 200
    let len = 0

    function next_note () {
        play_note (notes[i++], len)
        i %= notes.length
    }

    function note_player () {
        next_note ()
        if (running) setTimeout (note_player, period)
    }

    cnv_0.onpointerenter = e => {
        running = true
        note_player ()
    }

    cnv_0.onpointermove = e => {
        len = 5 * e.offsetX / cnv_0.width
        period = 20 + ((e.offsetY / cnv_0.height) ** 2) * 400
    }

    cnv_0.onpointerleave = e => {
        running = false
    }
</script>

```html
<canvas id='rapid_notes'></canvas>

<script> 
    // grabbing and formatting this ↑ canvas element 
    const cnv_0 = document.getElementById (`rapid_notes`)
    cnv_0.width = cnv_0.parentNode.scrollWidth
    cnv_0.height = cnv_0.width * 9 / 16
    cnv_0.style.backgroundColor = 'orange'

    // making an array of midi notes
    const notes = [ 62, 66, 69, 73, 74, 73, 69, 66 ]

    // declaring a mutable iterator
    let i = 0

    // declaring a mutable state value
    let running = false

    // declaring a mutable variable for 
    // the period of time between notes
    let period = 200

    // declaring a mutable variable for
    // the length of the note
    let len = 0

    // declaring a function that plays the next note
    function next_note () {

        // use the iterator to select a note from 
        // the notes array and pass it to the 
        // play_note function along with the 
        // len variable to specify the length of the note
        play_note (notes[i], len)

        // iterate the iterator
        i++

        // if i gets too big
        // cycle back to 0
        i %= notes.length
    }

    // this is a recursive function
    function note_player () {

        // play the next note
        next_note ()

        // if running is true
        // it uses setTimeout to call itself 
        // after period milliseconds
        if (running) setTimeout (note_player, period)
    }

    // this function handles the mouse event
    // when the cursor enters the canvas
    cnv_0.onpointerenter = e => {

        // set running to true
        running = true

        // initiate the recurseive note_player function
        note_player ()
    }

    // this function handles the mouse event
    // when the cursor moves over the canvas
    cnv_0.onpointermove = e => {

        // as the cursor goes from left to right
        // len gos from 0 to 5
        len = 5 * e.offsetX / cnv_0.width

        // as the cursor goes from bottom to top
        // period goes from 420 to 20 (milliseconds)
        period = 20 + ((e.offsetY / cnv_0.height) ** 2) * 400
    }

    // this function handles the mouse event
    // when the cursor leaves the canvas
    cnv_0.onpointerleave = e => {

        // set running to false
        running = false
    }
</script>
```

Note that in the above code, the only thing that is making sound is the `play_note ()` function that we declared earlier.  Using **functions** as extra layer of abstraction can simplify the Web Audio API for us, allowing us to focus on the composition of our sketch, and ways in which we can generate effective complexity.

##  Persistent Synths

For this next example we will organise our usage of the Web Audio API using **objects**.  

However, for this sketch, I will want to use `Vector` objects, are part of the p5 library.  Luckily for us, the vectors are fairly simple and we can write an implementation ourselves: 



```javascript
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

        mag () {
            return ((this.x ** 2) + (this.y ** 2)) ** 0.5
        }

        setMag (m) {
            this.mult (m / this.mag ())
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

I want to define behaviour for two types of objects: a stationary square, and a moving particle.  Lets look at the particle first.

In terms of data, each particle will need a **position**, a **velocity**, and an **acceleration**.  In terms of behaviour, I want each particle to **respawn** over the other side of the canvas once it has moved out of frame, and I want them to be able to **collide** with the squares.  Additionally, I want them to **gravitate** towards the squares via a gravity-like force that adheres to the [inverse-square law](https://en.wikipedia.org/wiki/Inverse-square_law).

Consider the following `class` definition:

```javascript
// defining a class
class Particle {

    // defining the arguments we will need to 
    // instatiate a new instance of the class
    constructor (position, velocity, acceleration, c_context) {

        // we will treat position, velocity, 
        // and acceleration, as vector objects
        this.pos = position
        this.vel = velocity
        this.acc = acceleration

        // rather than referring to the canvas context
        // in global variable, it is cleaner and more convenient
        // to pass a reference to it to the constructor 
        // to store on the particle object
        this.ctx = c_context
    }

    // defining how the particle is to move
    move () {

        // acceleration affects velocity
        this.vel.add (this.acc)

        // velocity affects position
        this.pos.add (this.vel)

        // reset accelreation vector
        // so we can add fresh gravitation later
        this.acc.mult (0)

        // this.ctx is the canvas context
        // here I am extracting the actual canvas
        // and storing it in 'c' for convenience
        const c = this.ctx.canvas

        // conditional logic to respawn
        // on the opposite side of the frame
        if (this.pos.x < 0) {
            this.pos.x = c.width
        }

        if (this.pos.x > c.width) {
            this.pos.x = 0
        }

        if (this.pos.y < 0) {
            this.pos.y = c.height
        }

        if (this.pos.y > c.height) {
            this.pos.y = 0
        }
    }

    // draw to canvas
    draw () {

        // referring to the canvas context
        // stored on each particle
        // fill colour = white
        this.ctx.fillStyle = `white`

        // the particle is a 3 x 3 square
        // the position is the middle pixel
        this.ctx.fillRect (this.pos.x - 1, this.pos.y - 1, 3, 3)
    }

    // this method accepts a square object as its argument
    // then checks to see whther the particle's position
    // is inside that square
    check_collision (s) {

        // conditional logic for the four boundaries 
        // of the square
        const inside_l = this.pos.x > s.pos.x
        const inside_r = this.pos.x < s.pos.x + s.len
        const inside_t = this.pos.y > s.pos.y
        const inside_b = this.pos.y < s.pos.y + s.len

        // if the particle is inside all of those boundaries
        if (inside_l && inside_r && inside_t && inside_b) {

            // call the collision method on 
            // the square that was passed in
            s.collision ()

            // calculate the distance to the center 
            // of the square along the x and y axes
            const x_distance = Math.abs (s.mid.x - this.pos.x)
            const y_distance = Math.abs (s.mid.y - this.pos.y)

            // x distance is larger -> horizontal collision
            // pass the square to the x_collision method
            if (x_distance > y_distance) this.x_collision (s)

            // y distance is larger -> vertical collision
            // pass the square to the y_collision method
            else this.y_collision (s)
        }
    }

    // defining the behaviour for a horizontal collision
    x_collision (s) {

        // horizontal velocity is reversed (and then some)
        this.vel.x *= -1.01

        // if the x velocity is positive 
        // put particle on the right side
        // otherwise put it on the left
        this.pos.x = this.vel.x > 0 ? s.pos.x + s.len : s.pos.x

        // give it a touch of random y velocity
        // to keep things interesting
        this.vel.y += ((Math.random () * 2) - 1) * 0.02
    }

    // defining the behaviour for a vertical collision
    y_collision (s) {

        // vertical velocity is reversed (and then some)
        this.vel.y *= -1.01

        // if the y velocity is positive 
        // put particle on the bottom
        // otherwise put it on the top
        this.pos.y = this.vel.y > 0 ? s.pos.y + s.len : s.pos.y 

        // give it a touch of random x velocity
        // to keep things interesting
        this.vel.x += ((Math.random () * 2) - 1) * 0.02
    }

    // the gravitate method accepts a square as an argument
    // and then applies an acceleration force on the particle 
    // towards that square
    gravitate (s) {

        // make a copy of the position of 
        // the square's centre
        const to_square = s.mid.clone ()

        // subtracting the position of the particle
        // yields the vector that goes from 
        // the particle, to the square
        to_square.subtract (this.pos)

        // use the inverse-square rule
        // to calculate a gravitational force
        const grav = 128 / (to_square.mag () ** 2)

        // set the magnitude of the vector towards
        // the square to be equal to the gravitation
        to_square.setMag (grav)

        // add this vector to the particle's
        // acceleration vector
        this.acc.add (to_square)
    }
}
```

<script>
    class Particle {

        // defining the arguments we will need to 
        // instatiate a new instance of the class
        constructor (position, velocity, acceleration, c_context) {

            // we will treat position, velocity, 
            // and acceleration, as vector objects
            this.pos = position
            this.vel = velocity
            this.acc = acceleration

            // rather than referring to the canvas context
            // in global variable, it is cleaner and more convenient
            // to pass a reference to it to the constructor 
            // to store on the particle object
            this.ctx = c_context
        }

        // defining how the particle is to move
        move () {

            // acceleration affects velocity
            this.vel.add (this.acc)

            // velocity affects position
            this.pos.add (this.vel)

            // reset accelreation vector
            // so we can add fresh gravitation later
            this.acc.mult (0)

            // this.ctx is the canvas context
            // here I am extracting the actual canvas
            // and storing it in 'c' for convenience
            const c = this.ctx.canvas

            // conditional logic to respawn
            // on the opposite side of the frame
            if (this.pos.x < 0) {
                this.pos.x = c.width
            }

            if (this.pos.x > c.width) {
                this.pos.x = 0
            }

            if (this.pos.y < 0) {
                this.pos.y = c.height
            }

            if (this.pos.y > c.height) {
                this.pos.y = 0
            }
        }

        // draw to canvas
        draw () {

            // referring to the canvas context
            // stored on each particle
            // fill colour = white
            this.ctx.fillStyle = `white`

            // the particle is a 3 x 3 square
            // the position is the middle pixel
            this.ctx.fillRect (this.pos.x - 1, this.pos.y - 1, 3, 3)
        }

        // this method accepts a square object as its argument
        // then checks to see whther the particle's position
        // is inside that square
        check_collision (s) {

            // conditional logic for the four boundaries 
            // of the square
            const inside_l = this.pos.x > s.pos.x
            const inside_r = this.pos.x < s.pos.x + s.len
            const inside_t = this.pos.y > s.pos.y
            const inside_b = this.pos.y < s.pos.y + s.len

            // if the particle is inside all of those boundaries
            if (inside_l && inside_r && inside_t && inside_b) {

                // call the collision method on 
                // the square that was passed in
                s.collision ()

                // calculate the distance to the center 
                // of the square along the x and y axes
                const x_distance = Math.abs (s.mid.x - this.pos.x)
                const y_distance = Math.abs (s.mid.y - this.pos.y)

                // x distance is larger -> horizontal collision
                // pass the square to the x_collision method
                if (x_distance > y_distance) this.x_collision (s)

                // y distance is larger -> vertical collision
                // pass the square to the y_collision method
                else this.y_collision (s)
            }
        }

        // defining the behaviour for a horizontal collision
        x_collision (s) {

            // horizontal velocity is reversed (and then some)
            this.vel.x *= -1.01

            // if the x velocity is positive 
            // put particle on the right side
            // otherwise put it on the left
            this.pos.x = this.vel.x > 0 ? s.pos.x + s.len : s.pos.x

            // give it a touch of random y velocity
            // to keep things interesting
            this.vel.y += ((Math.random () * 2) - 1) * 0.02
        }

        // defining the behaviour for a vertical collision
        y_collision (s) {

            // vertical velocity is reversed (and then some)
            this.vel.y *= -1.01

            // if the y velocity is positive 
            // put particle on the bottom
            // otherwise put it on the top
            this.pos.y = this.vel.y > 0 ? s.pos.y + s.len : s.pos.y 

            // give it a touch of random x velocity
            // to keep things interesting
            this.vel.x += ((Math.random () * 2) - 1) * 0.02
        }

        // the gravitate method accepts a square as an argument
        // and then applies an acceleration force on the particle 
        // towards that square
        gravitate (s) {

            // make a copy of the position of 
            // the square's centre
            const to_square = s.mid.clone ()

            // subtracting the position of the particle
            // yields the vector that goes from 
            // the particle, to the square
            to_square.subtract (this.pos)

            // use the inverse-square rule
            // to calculate a gravitational force
            const grav = 128 / (to_square.mag () ** 2)

            // set the magnitude of the vector towards
            // the square to be equal to the gravitation
            to_square.setMag (grav)

            // add this vector to the particle's
            // acceleration vector
            this.acc.add (to_square)
        }
    }
</script>

Note that in the `.x_collision` and `.y_collision` methods above, I am using the [ternary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator).  Essentially, it works like this:

```javascript
const foo = conditional > statement ? result_if_true : result_if_false
```

The important insight being that if the conditional statement before the `?` is true, what gets assigned to `foo` is the term before the `:`.  If the conditional statement is false, what gets assigned to `foo` is the term after the `:`.

Next we will define a class for our squares.  In terms of data, we want the squares to have a **position**, a side **length**, and a specific **note** that they will sonify when a particle collides with them.  In terms of behaviour, we want these squares to be able to **draw to the canvas**, **make a sound** when collided into, and we want to be able to **turn them on and off**.

We will call the class `Sound_Square`:

```javascript
// defining a class
class Sound_Square {

    // defining a constructor that accepts the arguments 
    // required to instantiate a new instance of the object
    constructor (position, length, note, c_context, a_context) {

        // we will treat position as a vector
        this.pos   = position

        // side length value
        this.len   = length

        // midi note value
        this.note  = note

        // reference to the canvas context
        this.ctx   = c_context

        // reference to the audio context
        this.audio = a_context

        // calculating the position of the center
        // of the square
        const mid_x = this.pos.x + (this.len / 2)
        const mid_y = this.pos.y + (this.len / 2)

        // storing this position as a vector
        this.mid = new Vector (mid_x, mid_y)

        // make the squares pink
        this.col     = `deeppink`

        // on / off state
        // false value -> silent
        this.running = true

        // storing a new oscillator
        // on the object
        this.osc = this.audio.createOscillator ()

        // lets use a sawtooth oscillator
        this.osc.type = 'sawtooth'

        // calculate the frequency of the note it should play
        const cps  = 440 * (2 ** ((this.note - 69) / 12))

        // set the oscillator to that frequency
        this.osc.frequency.value = cps

        // start the oscillator
        this.osc.start ()

        // store a new gain node
        // on the object
        this.amp = this.audio.createGain ()

        // setting the gain to functional silence
        this.amp.gain.value = 0.0001

        // we want to create a stereo field
        // where squares on the left are heard
        // more in the left channel
        // so we create a stereo panner node
        // to store on the object
        this.pan = this.audio.createStereoPanner ()

        // set it to a value that corresponds with
        // the x position of the square
        this.pan.pan.value = (this.mid.x / this.ctx.canvas.width) * 2 - 1

        // wire the nodes together:
        // osc -> amp -> pan -> output
        this.osc.connect (this.amp)
            .connect (this.pan)
            .connect (this.audio.destination)
    }

    // define a draw method
    draw () {

        // fill with the colour stored in the .col property
        this.ctx.fillStyle = this.col

        // draw a square at the coordinates held 
        // in the .pos vector, with a width and height
        // equal to the value stored in the .len property
        this.ctx.fillRect (this.pos.x, this.pos.y, this.len, this.len)
    }

    // when a particle detects that it has collided with a square
    // it will call this method on the square
    collision () {

        // only make a sound if the square is running
        if (this.running) {

            // get the current time from the audio context
            const now = this.audio.currentTime

            // because many particles will be hitting these squares
            // the amp node will be recieving lots many competing
            // sets of instructions.  By cancelling the scheduled
            // values we are telling the amp that the only set of
            // instructions that we are interested in is the most 
            // recent one
            this.amp.gain.cancelScheduledValues (now)

            // set the gain right now, to what it already is
            // this might seem redundant, but it helps the API
            // understand the timing of envelope that it needs to make
            this.amp.gain.setValueAtTime (this.amp.gain.value, now)

            // ramp from whatever value it was at, to 0.1, in 20 ms
            this.amp.gain.linearRampToValueAtTime (0.1, now + 0.02)

            // then ramp down exponentially, to 0.000001, in 8 s
            this.amp.gain.exponentialRampToValueAtTime (0.000001, now + 8)
        }
    }

    // define a method to turn the square on and off
    toggle () {

        // if already on
        if (this.running) {

            // make the colour grey
            this.col     = `grey`

            // set the .running property to false
            this.running = false
        }

        // if off
        else {

            // make the colour pink
            this.col     = `deeppink`

            // set the .running property to true
            this.running = true
        }
    }
}
```

<script>
    // defining a class
    class Sound_Square {

        // defining a constructor that accepts the arguments 
        // required to instantiate a new instance of the object
        constructor (position, length, note, c_context, a_context) {

            // we will treat position as a vector
            this.pos   = position

            // side length value
            this.len   = length

            // midi note value
            this.note  = note

            // reference to the canvas context
            this.ctx   = c_context

            // reference to the audio context
            this.audio = a_context

            // calculating the position of the center
            // of the square
            const mid_x = this.pos.x + (this.len / 2)
            const mid_y = this.pos.y + (this.len / 2)

            // storing this position as a vector
            this.mid = new Vector (mid_x, mid_y)

            // make the squares pink
            this.col     = `deeppink`

            // on / off state
            // false value -> silent
            this.running = true

            // storing a new oscillator
            // on the object
            this.osc = this.audio.createOscillator ()

            // lets use a sawtooth oscillator
            this.osc.type = 'sawtooth'

            // calculate the frequency of the note it should play
            const cps  = 440 * (2 ** ((this.note - 69) / 12))

            // set the oscillator to that frequency
            this.osc.frequency.value = cps

            // start the oscillator
            this.osc.start ()

            // store a new gain node
            // on the object
            this.amp = this.audio.createGain ()

            // setting the gain to functional silence
            this.amp.gain.value = 0.0001

            // we want to create a stereo field
            // where squares on the left are heard
            // more in the left channel
            // so we create a stereo panner node
            // to store on the object
            this.pan = this.audio.createStereoPanner ()

            // set it to a value that corresponds with
            // the x position of the square
            this.pan.pan.value = (this.mid.x / this.ctx.canvas.width) * 2 - 1

            // wire the nodes together:
            // osc -> amp -> pan -> output
            this.osc.connect (this.amp)
                .connect (this.pan)
                .connect (this.audio.destination)
        }

        // define a draw method
        draw () {
            // fill with the colour stored in the .col property
            this.ctx.fillStyle = this.col

            // draw a square at the coordinates held 
            // in the .pos vector, with a width and height
            // equal to the value stored in the .len property
            this.ctx.fillRect (this.pos.x, this.pos.y, this.len, this.len)
        }

        // when a particle detects that it has collided with a square
        // it will call this method on the square
        collision () {

            // only make a sound if the square is running
            if (this.running) {

                // get the current time from the audio context
                const now = this.audio.currentTime

                // because many particles will be hitting these squares
                // the amp node will be recieving lots many competing
                // sets of instructions.  By cancelling the scheduled
                // values we are telling the amp that the only set of
                // instructions that we are interested in is the most 
                // recent one
                this.amp.gain.cancelScheduledValues (now)

                // set the gain right now, to what it already is
                // this might seem redundant, but it helps the API
                // understand the timing of envelope that it needs to make
                this.amp.gain.setValueAtTime (this.amp.gain.value, now)

                // ramp from whatever value it was at, to 0.1, in 20 ms
                this.amp.gain.linearRampToValueAtTime (0.1, now + 0.02)

                // then ramp down exponentially, to 0.000001, in 8 s
                this.amp.gain.exponentialRampToValueAtTime (0.000001, now + 8)
            }
        }

        // define a method to turn the square on and off
        toggle () {

            // if already on
            if (this.running) {

                // make the colour grey
                this.col     = `grey`

                // set the .running property to false
                this.running = false
            }

            // if off
            else {

                // make the colour pink
                this.col     = `deeppink`

                // set the .running property to true
                this.running = true
            }
        }
    }
</script>

Once we have these classes, we can assemble our sketch on a canvas element:

```html
<canvas id='particle_example'></canvas>

<script>
    // get and format the canvas element
    const cnv_1 = document.getElementById ('particle_example')
    cnv_1.width = cnv_1.parentNode.scrollWidth
    cnv_1.height = cnv_1.width * 9 / 16
    cnv_1.style.backgroundColor = 'orange'

    // create a property of that canvase element
    // called "running" and store on it 
    // the value "false"
    cnv_1.running = false

    // assign to the onclick event listener
    // the function click_handler_1
    cnv_1.onclick = click_handler_1

    // working with TAU is convenient
    // store it in a constant variable
    const TAU = Math.PI * 2

    // create a new vector that points
    // to the middle of the canvas
    const mid = new Vector (cnv_1.width / 2, cnv_1.height / 2)

    // get a 2d context from the canvas element
    const ctx = cnv_1.getContext ('2d')

    // create an empty array for the particles
    const particles = []

    // function to fill the array with Particle objects
    // we will call the function on a mouse click later
    function make_particles (e) {

        // use the data from the mouse click event to make
        // a new vector pointing to the location of the mouse
        const pos = new Vector (e.offsetX, e.offsetY)

        // for loop to make 12 particles
        for (let i = 0; i < 12; i++) {

            // step around a circle 12 times, each time 
            // making a vector with magnitude of 2
            const vec = vector_from_angle (i * TAU / 12, 2)

            // create an accelereation vector with magnitude 0
            const acc = new Vector (0, 0)

            // create new particle object using the Particle class
            // pass in a clone of the position vector to decouple
            // the positions of the individual particles
            // note we are also passing in canvas and audio contexts
            const p = new Particle (pos.clone (), vec, acc, ctx, audio_context)

            // add the new particle object to the particles array
            particles.push (p)
        }
    }

    // empty array for the squares
    const squares = []

    // midi notes to assign to the squares
    const chord = [ 58, 65, 69, 72 ]

    // we will cutting the canvas into 5 equal columns
    const w = cnv_1.width / 5

    // for loop to create 4 squares
    for (let i = 0; i < 4; i++) {

        // on the left side of second - fifth columns
        const x = (i + 1) * w

        // with a side length of 50
        const len = 50

        // adjusting for the horizontal side length
        const x_adj = x - (len / 2)

        // adjusting for vertical the side length
        const y_adj = (cnv_1.height / 2) - (len / 2)

        // create a new vector for the adjusted position
        const pos = new Vector (x_adj, y_adj)

        // get the midi note number from the chord array
        const note = chord[i]

        // pass the adjusted position, side length, chord note
        // canvas context & audio context to the class constructor
        // to return a new object of that class
        // and push it into the squares array
        squares.push (new Sound_Square (pos, len, notes, ctx, audio_context))
    }

    // define a function to draw frames
    function draw_frame () {

        // set the fill style to black
        ctx.fillStyle = `black`

        // fill the whole canvas with black
        ctx.fillRect (0, 0, cnv_1.width, cnv_1.height)

        // for each of the particles in the particle array
        particles.forEach (p => {

            // call the .move () method
            p.move ()

            // call the .draw () method
            p.draw ()

            // each particle must go through 
            // each of the squares to
            squares.forEach (s => {

                // check for collisions
                p.check_collision (s)

                // calculate and apply gravitation
                p.gravitate (s)
            })
        })

        // draw each square
        squares.forEach (s => s.draw ())

        // use request animation frame to call draw_frame
        // recursively, according to the frame rate, etc.
        requestAnimationFrame (draw_frame)
    }

    // async function to handle clicks
    // the event listener will pass in a mouse event
    // here we use the argument "e" to refer to that event object
    async function click_handler_1 (e) {

        // look on the canvas object
        // if the .running property is not true
        if (!cnv_1.running) {

            // if the audio context is not running
            // call and wait for init_audio ()
            if (audio_context.state != 'running') await init_audio ()

            // otherwise call the make_particles function
            // passing on to it the mouse event
            make_particles (e)

            // begin the recursive draw_frame sequence off
            requestAnimationFrame (draw_frame)

            // alter the .running proprety to be true
            cnv_1.running = true
        }

        // if the .running perperty is true
        else {

            // call the .toggle () method
            // on each of the squares
            squares.forEach (s => s.toggle ())
        }
    }
</script>
```

This is what it looks like:

<canvas id='particle_example'></canvas>

<script>
    // get and format the canvas element
    const cnv_1 = document.getElementById ('particle_example')
    cnv_1.width = cnv_1.parentNode.scrollWidth
    cnv_1.height = cnv_1.width * 9 / 16
    cnv_1.style.backgroundColor = 'orange'

    // create a property of that canvase element
    // called "running" and store on it 
    // the value "false"
    cnv_1.running = false

    // assign to the onclick event listener
    // the function click_handler_1
    cnv_1.onclick = click_handler_1

    // working with TAU is convenient
    // store it in a constant variable
    const TAU = Math.PI * 2

    // create a new vector that points
    // to the middle of the canvas
    const mid = new Vector (cnv_1.width / 2, cnv_1.height / 2)

    // get a 2d context from the canvas element
    const ctx = cnv_1.getContext ('2d')

    // create an empty array for the particles
    const particles = []

    // function to fill the array with Particle objects
    // we will call the function on a mouse click later
    function make_particles (e) {

        // use the data from the mouse click event to make
        // a new vector pointing to the location of the mouse
        const pos = new Vector (e.offsetX, e.offsetY)

        // for loop to make 12 particles
        for (let i = 0; i < 12; i++) {

            // step around a circle 12 times, each time 
            // making a vector with magnitude of 2
            const vec = vector_from_angle (i * TAU / 12, 2)

            // create an accelereation vector with magnitude 0
            const acc = new Vector (0, 0)

            // create new particle object using the Particle class
            // pass in a clone of the position vector to decouple
            // the positions of the individual particles
            // note we are also passing in canvas and audio contexts
            const p = new Particle (pos.clone (), vec, acc, ctx, audio_context)

            // add the new particle object to the particles array
            particles.push (p)
        }
    }

    // empty array for the squares
    const squares = []

    // midi notes to assign to the squares
    const chord = [ 58, 65, 69, 72 ]

    // we will cutting the canvas into 5 equal columns
    const w = cnv_1.width / 5

    // for loop to create 4 squares
    for (let i = 0; i < 4; i++) {

        // on the left side of second - fifth columns
        const x = (i + 1) * w

        // with a side length of 50
        const len = 50

        // adjusting for the horizontal side length
        const x_adj = x - (len / 2)

        // adjusting for vertical the side length
        const y_adj = (cnv_1.height / 2) - (len / 2)

        // create a new vector for the adjusted position
        const pos = new Vector (x_adj, y_adj)

        // get the midi note number from the chord array
        const note = chord[i]

        // pass the adjusted position, side length, chord note
        // canvas context & audio context to the class constructor
        // to return a new object of that class
        // and push it into the squares array
        squares.push (new Sound_Square (pos, len, note, ctx, audio_context))
    }

    // define a function to draw frames
    function draw_frame () {

        // set the fill style to black
        ctx.fillStyle = `black`

        // fill the whole canvas with black
        ctx.fillRect (0, 0, cnv_1.width, cnv_1.height)

        // for each of the particles in the particle array
        particles.forEach (p => {

            // call the .move () method
            p.move ()

            // call the .draw () method
            p.draw ()

            // each particle must go through 
            // each of the squares to
            squares.forEach (s => {

                // check for collisions
                p.check_collision (s)

                // calculate and apply gravitation
                p.gravitate (s)
            })
        })

        // draw each square
        squares.forEach (s => s.draw ())

        // use request animation frame to call draw_frame
        // recursively, according to the frame rate, etc.
        requestAnimationFrame (draw_frame)
    }

    // async function to handle clicks
    // the event listener will pass in a mouse event
    // here we use the argument "e" to refer to that event object
    async function click_handler_1 (e) {

        // look on the canvas object
        // if the .running property is not true
        if (!cnv_1.running) {

            // if the audio context is not running
            // call and wait for init_audio ()
            if (audio_context.state != 'running') await init_audio ()

            // otherwise call the make_particles function
            // passing on to it the mouse event
            make_particles (e)

            // begin the recursive draw_frame sequence off
            requestAnimationFrame (draw_frame)

            // alter the .running proprety to be true
            cnv_1.running = true
        }

        // if the .running perperty is true
        else {

            // call the .toggle () method
            // on each of the squares
            squares.forEach (s => s.toggle ())
        }
    }
</script>

Note that each synth lives in a square, which means there can only ever by four synths at a time.  This is a nice affordance in this sketch in particular, because as the particles eventually find homes on the surfaces of the squares, each collision simply keeps open the amp node on that square, rather than creating a whole new synth.  The result is that the squares come to represent a droning chord, rather than a distorted cacophony of synth hits.