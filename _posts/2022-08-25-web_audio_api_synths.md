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
        amp.gain.linearRampToValueAtTime (0.4, now + 0.02)

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

We can also use **objects** to organise how we interface with the Web Audio API.

Consider the following code:

```javascript

```

<script>
    function rand_col () {
        const h = Math.floor (Math.random () * 360)
        return `hsl(${ h }, 100%, 50%)`
    }

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

    class Sound_Square {
        constructor (position, length, note, c_context, a_context) {
            this.pos   = position
            this.len   = length
            this.note  = note
            this.ctx   = c_context
            this.audio = a_context

            const mid_x = this.pos.x + (this.len / 2)
            const mid_y = this.pos.y + (this.len / 2)
            this.mid = new Vector (mid_x, mid_y)

            this.col   = `deeppink`

            this.osc = this.audio.createOscillator ()
            this.osc.type = 'sawtooth'
            this.osc.frequency.value = 0
            this.osc.start ()

            this.amp = this.audio.createGain ()
            this.amp.gain.value = 0.0001

            this.pan = this.audio.createStereoPanner ()
            this.pan.pan.value = (this.pos.x / this.ctx.canvas.width) * 2 - 1

            this.osc.connect (this.amp)
                .connect (this.pan)
                .connect (this.audio.destination)
        }

        draw () {
            this.ctx.fillStyle = this.col
            this.ctx.fillRect (this.pos.x, this.pos.y, this.len, this.len)
        }

        collision () {
            const cps  = 440 * (2 ** ((this.note - 69) / 12))
            this.osc.frequency.value = cps
            this.sound ()
        }

        sound () {
            const now = this.audio.currentTime
            this.amp.gain.cancelScheduledValues (now)
            this.amp.gain.setValueAtTime (this.amp.gain.value, now)
            this.amp.gain.linearRampToValueAtTime (0.1, now + 0.02)
            this.amp.gain.exponentialRampToValueAtTime (0.000001, now + 8)
        }
    }

    class Particle {
        constructor (position, velocity, acceleration, c_context) {
            this.pos = position
            this.vel = velocity
            this.acc = acceleration

            this.canvas = c_context

        }

        move () {
            this.vel.add (this.acc)
            this.pos.add (this.vel)
            this.acc.mult (0)

            const c = this.canvas.canvas

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


        draw () {
            this.canvas.fillStyle = `white`
            this.canvas.fillRect (this.pos.x - 1, this.pos.y - 1, 3, 3)
        }

        check_collision (s) {
            const inside_l = this.pos.x > s.pos.x
            const inside_r = this.pos.x < s.pos.x + s.len
            const inside_t = this.pos.y > s.pos.y
            const inside_b = this.pos.y < s.pos.y + s.len

            if (inside_l && inside_r && inside_t && inside_b) {
                s.collision ()

                const x_distance = Math.abs (s.mid.x - this.pos.x)
                const y_distance = Math.abs (s.mid.y - this.pos.y)
                if (x_distance > y_distance) this.x_collision (s)
                else this.y_collision (s)
            }

            // if (inside_t && inside_b) {
            //     s.collision ()
            // }
        }

        gravitate (s) {
            const to_square = s.mid.clone ()
            to_square.subtract (this.pos)
            const grav = 0.3 / to_square.mag ()
            to_square.setMag (grav)
            this.acc.add (to_square)
        }

        x_collision (s) {
            this.vel.x *= -1
            this.pos.x = this.vel.x > 0 ? s.pos.x + s.len : s.pos.x 
        }

        y_collision (s) {
            this.vel.y *= -1
            this.pos.y = this.vel.y > 0 ? s.pos.y + s.len : s.pos.y 
        }
        
    }
</script>

<canvas id='particle_example'></canvas>

<script>
    const cnv_1 = document.getElementById ('particle_example')
    cnv_1.width = cnv_1.parentNode.scrollWidth
    cnv_1.height = cnv_1.width * 9 / 16
    cnv_1.style.backgroundColor = 'orange'
    cnv_1.running = false
    cnv_1.onclick = initiate_sketch

    function initiate_sketch () {
        if (!cnv_1.running) {
            if (audio_context.state != 'running') init_audio ()
            requestAnimationFrame (draw_frame)
            cnv_1.running = true
        }
    }

    const TAU = Math.PI * 2
    const mid = new Vector (cnv_1.width / 2, cnv_1.height / 2)
    const ctx = cnv_1.getContext ('2d')

    const particles = []
    for (let i = 0; i < 12; i++) {
        // const x = Math.random () * cnv_1.width
        // const y = Math.random () * cnv_1.height
        // const pos = new Vector (x, y)
        const pos = mid.clone ()
        const vec = vector_from_angle (i * TAU / 12, 2)
        const acc = new Vector (0, 0)
        const p = new Particle (pos, vec, acc, ctx, audio_context)
        particles.push (p)
    }

    const squares = []
    const chord = [ 58, 65, 69, 72 ]
    const w = cnv_1.width / 5
    for (let i = 0; i < 4; i++) {
        const x = (i + 1) * w
        const len = 50
        const x_adj = x - (len / 2)
        const y_adj = (cnv_1.height / 2) - (len / 2)
        const pos = new Vector (x_adj, y_adj)
        squares.push (new Sound_Square (pos, len, chord[i], ctx, audio_context))
    }

    function draw_frame () {
        ctx.fillStyle = `orange`
        ctx.fillRect (0, 0, cnv_1.width, cnv_1.height)
        particles.forEach (p => {
            p.move ()
            p.draw ()
            squares.forEach (s => {
                p.check_collision (s)
                p.gravitate (s)
        })
        })

        squares.forEach (s => s.draw ())
        requestAnimationFrame (draw_frame)
    }


</script>
