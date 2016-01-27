import React from 'react';
import EventEmitter from 'eventemitter3';

// this._interval = null;
// 		this._beats = 0;


// 		this.metronome.query('.meter').addEvent('click', e => this.toggle());
// 		this.metronome.query('.bpm-increment').addEvent('click', e => this.increment());
// 		this.metronome.query('.bpm-decrement').addEvent('click', e => this.decrement());
// 		puredom(document).on('keyDown', e => {
// 			var amount = 1;
// 			if (e.shiftKey) {
// 				amount = 10;
// 			}

// 			if (e.keyCode == 187 || e.keyCode == 39) {
// 				this.increment(amount);
// 			} else if (e.keyCode == 189 || e.keyCode == 37) {
// 				this.decrement(amount);
// 			} else if (e.keyCode == 32) {
// 				this.toggle();
// 			}
// 		});

// 		puredom(window).on('blur', e => this.stop());
// 		this.metronome.on('mousewheel', e => {
// 			var amount = 1;
// 			if (e.shiftKey) {
// 				amount = 10;
// 			}
// 			if (Math.abs(e.wheelDeltaY) > Math.abs(e.wheelDeltaX)){ 
// 				if (e.wheelDeltaY > 0) {
// 					this.increment(amount);
// 				}
// 				else {
// 					this.decrement(amount);
// 				}
// 			}
// 		});

// 		this._on_bpm_update();

// export let Meter = React.createClass({
export class Meter extends React.Component {
	render() {
		return (
			<div className="meter" onClick={this.props.onClick}>
				<div className="needle">
				</div>
			</div>
		);
	}
}

export class Controls extends React.Component {
	render() {
		return (
			<p className="controls">
				<span onClick={e => this.props.onBpmDown()} className="button bpm-decrement">-</span>
				<span className="bpm-display">{this.props.bpm}</span>
				<span onClick={e => this.props.onBpmUp()} className="button bpm-increment">+</span>
			</p>
		);
	}
}

export class Metronome extends React.Component {
	constructor(...args) {
		super(...args);
		this.state = {
			beats: 0,
			bpm: this.props.bpm || 90,
			interval: null,
			running: false,
		};
	}

	beat() {
		this.state.beats % 2 == 0 ? this.playTick() : this.playTock();
		this.setState({ beats: ++this.state.beats });

		// this.metronome.query('.needle')
		// 	.css({'background': '#FF0000'})
		// 	.css({'background': 'gray'},
		// 		 {'tween': this.seconds_per_beat() * 500});
		// this.metronome.query('.meter')
		// 	.animate(function(f) {
		// 		var saturation = Math.round((1 - f) * 45 + 14),
		// 			hsl_inner = 'hsl(210, ' + saturation + '%, ' + ((1 - f) * 5 + 82) + '%)',
		// 			hsl_outer = 'hsl(210, ' + saturation + '%, ' + ((1 - f) * 20 + 64) + '%)',
		// 			gradient = (
		// 				'(bottom right, circle cover, '
		// 				+ hsl_inner + ', '
		// 				+ hsl_outer + ' 70%)'
		// 			);

		// 		this.css({'background': '-webkit-radial-gradient' + gradient});

		// 	}, this.seconds_per_beat() * 500, 'ease');
	}

	setBpm(bpm) {
		let secondsPerBeat = 60 / bpm;
		this.setState({ bpm });

		// puredom('.needle').css({
		// 	'animation-duration': `${secondsPerBeat}s`
		// });

		if (this.state.running) {
			this.stop();
			setTimeout(() => this.start(), 100);
		}
	}

	decrement(amount) {
		this.setBpm(Math.max(1, this.state.bpm - (amount || 1)));

		// this.metronome.query('.bpm-decrement').classify('flash');
		// setTimeout(() => this.metronome.query('.bpm-decrement').declassify('flash'), 100);
	}

	increment(amount) {
		this.setBpm(Math.min(200, this.state.bpm + (amount || 1)));

		// this.metronome.query('.bpm-increment').classify('flash');
		// setTimeout(() => this.metronome.query('.bpm-increment').declassify('flash'), 100);
	}

	playTick() {}
	playTock() {}

	start() {

		// this.metronome.query('.needle').classify('needle-animating');

		let secondsPerBeat = 60 / this.state.bpm;

		this.setState({
			beats: 0,
			running: true,
			interval: setInterval(() => this.beat(), secondsPerBeat * 1000)
		});
	}

	stop() {
		if (!this.state.running) return;

		// this.metronome.query('.needle').declassify('needle-animating');
		clearInterval(this.state.interval);
		this.state.interval = null;
		this.state.running = false;
	}

	toggle() {
		this.state.running ? this.stop() : this.start();
	}

	render() {
		return (
			<div className="metronome">
				<Meter onClick={e => this.toggle()} />
				<Controls bpm={this.state.bpm} onBpmUp={e => this.increment()} onBpmDown={e => this.decrement()} />
			</div>
		)
	}
}

export default {
	Meter,
	Controls,
	Metronome
}
