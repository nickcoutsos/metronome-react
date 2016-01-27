# Metronome (react)

## Description

This is a port/rewrite of my original attempt at a HTML-based [metronome], this
time using React to express the UI and event handling in smaller components.


## Experiences

Pretty interesting so far. From the initial commit to the time of this writing
some 6 hours have passed and this is my first experience in using React. Much of
the first hour was spent trying to figure out what configuration and plugins are
expected to make webpack work (also a first for me, but less pleasant).


## Remaining

Cleanup for sure. Also, some of the original effects are missing in this version
as a result of moving away from the original DOM library I had used and losing a
few very very nice animation/tweening methods.

And almost completely unnecessarily I'd like to see if I can define some sounds
within the code to serve as the _tick_ and _tock_ effects.

[metronome]: https://github.com/nickcoutsos/metronome
