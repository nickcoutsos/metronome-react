import React from 'react';
import ReactDOM from 'react-dom';
import Metronome from './components/metronome';

function set_metronome_size() {
	let content = document.querySelector('#content'),
		metronome = content.querySelector('.metronome'),
		controls = metronome.querySelector('.controls'),
		available = Math.min(content.offsetWidth - 40, content.offsetHeight - metronome.offsetTop),
		outerLength = `${available}px`,
		controlHeight = `${available / 7}px`;

	metronome.style.height = metronome.style.width = outerLength;
	controls.style.height = controls.style.lineHeight = controls.style.fontSize = controlHeight;
}

function setContentSize() {
	let windowHeight = window.innerHeight,
		headerHeight = document.querySelector('#header').offsetHeight,
		footerHeight = document.querySelector('#footer').offsetHeight,
		newHeight = windowHeight - headerHeight - footerHeight;

	document.querySelector('#content').style.height = `${newHeight}px`;
	set_metronome_size();
}


// class Synth {
// 	constructor(initialFrequency) {
// 		let audioContext = new AudioContext();
//
// 		this.gain = audioContext.createGain();
// 		this.gain.gain.value = 0;
// 		this.gain.connect(audioContext.destination);
//
// 		this.oscillator = audioContext.createOscillator();
// 		this.oscillator.type = 'square';
// 		this.oscillator.frequency.value = initialFrequency;
// 		this.oscillator.start();
// 		this.oscillator.connect(this.gain);
// 	}
//
// 	playFrequency(freq, duration) {
// 		this.oscillator.frequency.value = freq;
// 		this.gain.gain.value = 0.6;
// 		setTimeout(() => this.gain.gain.value = 0.001, duration);
// 	}
// }


// var synth = new Synth(440);

ReactDOM.render(
	<Metronome />,

	document.getElementById('content')
);

window.addEventListener('resize', setContentSize);
setContentSize();
