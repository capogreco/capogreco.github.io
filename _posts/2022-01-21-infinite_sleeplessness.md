---
layout     : post
title      : "Infinite Sleeplessness"
date       : 2022-01-21

categories : DX∑
---

**wrt the issue of phones going to sleep and disconnecting**

so the tech we want to use is called *[Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)*

however, it looks like it requires `https`, so it may be awkward to implement for locally served websites, such as is used by the DX∑.

this issue came up a few years ago when using *[AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet)* to do phase modulation based formant synthesis, which also requires a secure connection. although it is possible to do it, the way the web protocols work would require participants to disregard scary warning messages.

![scary warning](/etc/images/infinite_sleeplessness_warning.png)
