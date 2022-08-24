---
layout     : post
title      : "Web Audio API: Samples"
date       : 2022-08-23
categories : RMIT CCS
---

API stands for "Application Programming Interface" -- they specify protocols that allow bits of software to plug into each other.  We have already looked at the Canvas API, which plugs javascript into the canvas element, and in fact the Document Object Model (DOM), is itself an API, as it specifies how javascript can plug into the structure of an html document.  You can read a more comprehensive explanation of what an API is [here](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Introduction).

The [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) connects javascript to the parts of the browser that processes audio, and which connects to the operating system's audio output device.  This API is useful to know as p5's [sound library](https://p5js.org/reference/#/libraries/p5.sound) tends to be a bit buggy, and get less maintenance than the regular p5 library.  By working with Web Audio API directly, you bypass the need to deal with the p5 sound library altogether.

##  Initialising an AudioContext

One of the things that differentiates ears from eyes, is the absence of lids.  Eyes have them, but ears do not. We have less control over how sound is registered by our ears, and so we do rely somewhat on the people and architecture and technology in our immediate surroundings to help us mediate the volume, intensity, clarity, etc. of sonic phenomena.

In any case, at some point, some people, somewhere, decided that an `AudioContext` object, the object that allows you to render audio to the operating system's audio device, must always begin its life in a *suspended* (inactive) state, and is only allowed become active once a user gesture has been registered.  In other words, when someone visits your webpage, you are not allowed to blast them with audio without some minimal form of interaction from them.

Consider the following code:


```javascript
document.body.style.margin   = 0
document.body.style.overflow = `hidden`
document.body.bgColor        = `tomato`

// use the AudioContext class constructor
// to create a new audio context
const audio_context = new AudioContext ()

// suspend it explicitly
audio_context.suspend ()

// display the audio context object in the console
// the 'state' property should read 'suspended'
console.dir (audio_context)

// declare a function to handle click events
function click_handler () {

    // if the state of audio context
    // is 'suspended'
    if (audio_context.state == 'suspended') {

        // tell it to resume
        audio_context.resume ()

        // change the background colour
        document.body.bgColor = `forestgreen`

        // display the audio context 
        // once more in the console
        // state should read 'running'
        console.dir (audio_context)
    }
}

// assign the click handler function 
// to the .onclick property of the document
document.onclick = click_handler
```

Here we have used a click interaction to resume the audio context, as evidenced below.  The first read out of the `AudioContext` object was rendered to the console pre-click, and the second, post-click.  Note the difference in the 'state' property:

![audio context suspended, then running](/etc/images/audio_context_running.png)

##  Loading an audio file

The following code assumes that there is an audio file named `vibraphone_note.wav` in your root directory, next to your `index.html` and `script.js` files.  The file I am using is [`VibraphoneMid-MT70.wav`](/etc/samples/vibraphone_note.wav) from the LegoWelt's Casio MT70 drums sample pack, which you can find [here](http://legowelt.org/samples/).

The code itself is somewhat more verbose than the p5 equivalent, and there are also a few new concepts also:

```javascript
document.body.style.margin   = 0
document.body.style.overflow = `hidden`
document.body.bgColor        = `tomato`

// the onclick property takes a function
// and passes that function a Mouse Event
document.onclick = click_handler

const audio_context = new AudioContext ()
audio_context.suspend ()

// declare mutable variable
// for the audio buffer
let vibraphone_buffer

// this is an asynchronous function
// that will load the audio data
// into the buffer declared above
// from the audio file
get_vibraphone ()

// we are name the argument mouse_event
// so we can refer to the mouse event
// the .onclick method passes in
function click_handler (mouse_event) { 
    if (audio_context.state == 'suspended') {
        audio_context.resume ()
        document.body.bgColor = `forestgreen`
    } else {
        // mouse_event has the coordinates
        // of the mouse position stored in it
        // as .clientX and .clientY properties
        const x_pos = mouse_event.clientX

        // divide the position by the width
        // to get a ratio between 0 - 1
        const x_ratio = x_pos / window.innerWidth

        // pass in 2 to the power of the ratio
        // this value will become the playback rate
        play_vibraphone (2 ** x_ratio)
    }
}


// the keyword async specifies that the function we
// are declaring here is asynchronous.  Which means
// it will wait until the data loads at each step 
// before moving on to the next.   
async function get_vibraphone () {

    // we are storing in the global variable
    // the result of a three step process
    // the first part fetches the file
    vibraphone_buffer = await fetch ("vibraphone_note.wav")

        // the second step formats the binary data
        // in an array
        .then (response => response.arrayBuffer ())

        // the third step encodes the binary data
        // as an audio buffer, which is returned
        // and stored in the global variable above
        .then (buffer => audio_context.decodeAudioData (buffer))
}

// this is the function that makes the sound
function play_vibraphone (rate) {

    // create a buffer source node
    const buf_node = audio_context.createBufferSource ()

    // wire it up to the audio output device
    buf_node.connect (audio_context.destination)

    // point the node's buffer to the audio 
    // buffer stored in vibraphone_buffer
    buf_node.buffer = vibraphone_buffer

    // use the argument passed into the function
    // as the playback rate
    buf_node.playbackRate.value = rate

    // node to start playing the audio buffer
    buf_node.start (audio_context.currentTime)
}
```

Learn more about `async` / `await` [here](https://youtu.be/XO77Fib9tSI), and [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await). 

Learn more about click events [here](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event).


<canvas id=example_0></canvas>
<script>
const cnv  = document.getElementById (`example_0`)
cnv.style.backgroundColor = `tomato`
cnv.width  = cnv.parentElement.scrollWidth
cnv.height = cnv.width * 9 / 16
const audio_context = new AudioContext ()
audio_context.suspend ()
let vibraphone_buffer
get_vibraphone ()
function click_handler (e) {
    if (audio_context.state == 'suspended') {
        audio_context.resume ()
        cnv.style.backgroundColor = `forestgreen`
    } else {
        const x_pos = e.offsetX
        console.log (x_pos)
        const x_ratio = x_pos / cnv.width
        play_vibraphone (2 ** x_ratio)
    }
}
async function get_vibraphone () {
    vibraphone_buffer = await fetch ("/etc/samples/vibraphone_note.wav")
        .then (response => response.arrayBuffer ())
        .then (buffer => audio_context.decodeAudioData (buffer))
}
function play_vibraphone (rate) {
   const buf_node = audio_context.createBufferSource ()
    buf_node.connect (audio_context.destination)
    buf_node.buffer = vibraphone_buffer
    buf_node.playbackRate.value = rate
    buf_node.start (audio_context.currentTime)
}
cnv.onclick = click_handler
</script>
