---
layout     : post
title      : "Embed error from p5.sound.js"
date       : 2022-08-20
categories : RMIT CCS
---

This post is a PSA regarding some errors that have been cropping up for me, and possibly for some of you as well.

In some situations, it looks like the `p5.sound.min.js` library causes an error that stops the sketch from loading properly into an iframe embed.

Luckily the fix is quite simple.  In the `index.html` file, find the script tag that points to `p5.sound.min.js`:

![script tag that points to p5.sound.min.js in the index.html](/etc/images/p5_sound_js_tag.png)

Deleting this tag seems to solve the problem.

![script tag that points to p5.sound.min.js deleted](/etc/images/p5_sound_js_tag_gone.png)

