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

The component responsible for generating the sound here is the **oscillator**.  The **amplifier** is responsible for turning the volume of the oscillator down and off so it is not making sound when we don't want it to be making sound.  We will build a synthesiser using just these two components presently.

##  Simple synthesiser




