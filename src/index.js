import React from 'react';
import ReactDOM from 'react-dom';
import components from './components';

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



ReactDOM.render(
	React.createElement(components.Metronome, null),
	document.getElementById('content')
);

window.addEventListener('resize', setContentSize);
setContentSize();