---
layout     : post
title      : "Net Art Walkthrough"
date       : 2022-08-18
categories : RMIT CCS
---

First go to [github](https://github.com/), click **New**, and give the new repo the name `net_art`.

In the description, put
**RMIT CSS Net Art Assignment**, or something similar.

![new repo called net_art](/etc/images/net_art_new_repo.png)

Include a README.md if you want, or not, doesn't really matter.  Choose a licence if you want, this doesn't really matter either, for the time being.

Press `cmd` + `space` to open spotlight search and type `terminal` and select `terminal.app`.

In terminal, navigate to your documents folder by typing `cd Documents` or `cd ~/Documents`, and use git to clone the new repo you just made, by typing something like:

```bash
git clone https://github.com/capogreco/net_art
```

Note that you will need to put your own username in the URL where `capogreco` is above.

If you chose not to add a readme, it may give you a warning:

![you appear to have cloned an empty repository](/etc/images/net_art_empty_clone.png)

Open the newly cloned directory in VS Code with `code net_art`.

In VS Code, press `cmd` + `N` to create a new file.  

Press `cmd` + `S` to save as, and give it the name `index.html`

Type, or copy & paste, in the following html:

```html
<!DOCTYPE html>
<body>
    <script src=script.js></script>		
</body>
```

Save that with `cmd` + `S`.

Press `cmd` + `N` again, to create another new file, and `cmd` + `S` again to save this one as `script.js`.  These two files should be located next to each other in the `net_art` directory.

In `script.js`, type:

```javascript
console.log (`hello from VS Code!!`)
```

Press `cmd` + `S` to save, and then press `ctrl` + `` ` `` to open a new terminal *inside* VS Code.

If you have not installed [node](https://nodejs.org/) yet, do that now by typing:

```bash
brew install node
```

![brew install node in a terminal inside VS Code](/etc/images/net_art_install_node.png)

Node lets us run javascript outside the browser, and will become useful to us a bit later in the course.  For the time being, we are more interested in [npm](https://www.npmjs.com/), node's package manager.

Npm is a bit like [homebrew](https://brew.sh/), we can use it to install and manage node libraries, and scripts such as [live-server](https://www.npmjs.com/package/live-server), which we will be installing presently with:

```bash
npm install -g live-server
```

The `-g` in the above code is called a flag.  Flags are used to set specific options to commands, such as `install`.  In this case, the flag is telling `install` that this package is to be installed globally, so it won't matter whereabouts you are on the computer, you will always be able to write `live-server` and it will execute the node script we are installing.

Once it is installed, type `live-server` and press enter.  You should be taken automatically to a browser tab at the URL `http://127.0.0.1:8080/`, or similar.

This is your website.  If you are in Chrome, Brave, or Firefox, you can open the javascript console with `cmd` + `shift` + `J`.  With any luck, you will see the message you gave to `console.log ()` in your `script.js` file, here.

*You may need to hit `cmd` + `shift` + `R` to hard reload the page.  I had to save some text between the `<body>` tags of my `index.html` to get it to respond.*

![hello console!](/etc/images/net_art_hello_console.png)

The error you can see here pertains to the absense of a `favicon.ico`.  You can either ignore it, or grab a favicon from [here](https://favicon.io/emoji-favicons/pouting-cat/), for example.  Simply put the `favicon.ico` file in the `net_art` directory next to the `index.html` file and `script.js`.

#   DOM in JavaScript

Next we are going to look at the `document` object.

In your `script.js` file, replace your message with `document`, without quotation marks or backticks.  It should look like this:

```javascript
console.log (document)
```

In the browser, you should see this:

![document object in the console](/etc/images/net_art_document_object.png)

Click the triangle to display the multitude of attributes and children nodes associated with the document object:

![document object unfolded in the console](/etc/images/net_art_document_unfolded.png)

Click the triangle next to `body` to reveal even more attributes associated with this child node.  One such attribute is `bgColor`:

![document body bgColor](/etc/images/net_art_body_bgColor.png)

Hold that thought.  Cycle back to VS Code with `cmd` + `tab`.

Add this line to your `script.js` file:

```javascript
document.body.bgColor = "turquoise"

console.log (document)
```

Save this with `cmd` + `S` and cycle back to the browser with `cmd` + `tab`.

Your website should now be turquoise, and if you unfold the `document` object in the console, and unfold `body`, and scroll down to `bgColor`, you should find that it now says `bgColor: "turquoise"`

![bgColor is now turquoise](/etc/images/net_art_bgColor_turquoise.png)

Congratulations, you have just used javascript to change the DOM without CSS.

#   Using the p5 library

Click [here](https://github.com/processing/p5.js/releases/download/v1.4.2/p5.js) to download the `p5.js` library.  Once it has downloaded, move it to your `net_art` directory, next to your `index.html` and `script.js` files.

![net_art folder with four files](/etc/images/net_art_p5_file.png)

In VS Code, you can navigate between files by pressing `cmd` + `P`, or by pressing `cmd` + `opt` + `left` or `cmd` + `opt` + `right`.  Navigate to `index.html`

Add a script tag that points to the `p5.js` file above the existing script tag, which points to your `script.js` file.  It should look like this:

```html
<!DOCTYPE html>
<body>
	<script src=p5.js></script>
	<script src=script.js></script>
</body>
```

Navigate over to your `script.js` file with `cmd` + `P` or `cmd` + `opt` + `arrow`.

Press `cmd` + `A` to select all, and delete.  Replace the contents of `script.js` with:

```javascript
function setup () {
    createCanvas (400, 400)
}

function draw () {
    background (`turquoise`)
}
```

`cmd` + `S` to save, and cycle back to your browser.  If you see a turquoise canvas on your webpage - success! This means p5 is working.

Before you head back to VS Code, in the browser console, type `window`, press enter, and then click the triangle to display its attributes.  

`window` is an object like `document` - it has a lot of attributes.  Scroll (a long way) down, untill you can see `innerWidth` and `innerHeight`.  These are attributes of the `window` object that specify the size of the window, in pixels.  We can use these to set the size of the canvas.

Head back to VS Code, and replace the arguments to `createCanvas ()` with `window.innerWidth` and `window.innerHeight`, respectively.  It should now look like this:

```javascript
function setup () {
    createCanvas (window.innerWidth, window.innerHeight)
}

function draw () {
    background (`turquoise`)
}
```

Save, and cycle back to the browser.  It is not quite right:

![window size canvas, with scroll bars](/etc/images/net_art_padded.png)

The scroll bars are there, because as a default, html puts in some padding which is pushing our canvas slightly down and to the right.

We can get rid of this padding by adjusting some attributes in the document object.  Cycle back to `script.js`, and add these lines up the top:

```javascript
document.body.style.margin   = 0
document.body.style.overflow = `hidden`

function setup () {
    createCanvas (window.innerWidth, window.innerHeight)
}

function draw () {
    background (`turquoise`)
}
```

Save that, and cycle over to the browser.  The canvas element should now be fitting nicely into the window.

![nicely fitting turquoise canvas](/etc/images/net_art_turquoise_fit.png)

Now it's over to you: **draw a pink square right in the centre**.

![turquoise canvas with pink square in the centre](/etc/images/net_art_pink_square.png)
