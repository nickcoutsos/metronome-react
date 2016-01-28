# Metronome (react)

## Usage

There's not much point; this project is functionally comparable to [the old one][original-demo]
except implemented using React (and also slightly lacking, aesthetically). But
now that I'm beginning to grasp webpack better, check this out:

```
git clone https://github.com/nickcoutsos/metronome-react
cd metronome-react
npm install
npm start
```

This will run the webpack dev server, and you can view the resulting application
by going to http://localhost:8080 in your browser.


## Project

### Why

This is a port/rewrite of my original attempt at an HTML/JS [metronome app][original], this
time using React to express the UI and event handling in smaller components. It
seemed like time to learn React, which coincided nicely with the fact that I was
not enthusiastic about picking a templating library.


### Results

Pretty interesting so far. From the initial commit to the time of this writing
some 6 hours have passed and this is my first experience in using React. Much of
the first hour was spent trying to figure out what configuration and plugins are
expected to make webpack work (also a first for me, but less pleasant).

I was concerned about this project being too trivial to be suitable as an intro
to developing with React but was surprised to see how easily it was represented
as a composition of pieces working together while still maintaining their own
responsibilities.

It was also a worthwhile experience being able to revisit an earlier JavaScript
project and make it somewhat less shameful.


### Remaining

* Get a better understanding of React best practices; clean some things up
* Implement sound effects via, I don't know, sine waves? I just don't want to
bother with extra files I guess
* Implement tweening for non-css-animatable properties missing from the original
* There's a good deal of ancient CSS that could be... improved upon

[original]: https://github.com/nickcoutsos/metronome
[original-demo]: https://nickcoutsos.github.io/metronome