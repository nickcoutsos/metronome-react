import React from 'react';

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

export let Meter = React.createClass({
	render() {
		return (
			<div className="meter">
				<div className="needle">
				</div>
			</div>
		);
	}
});

export let Controls = React.createClass({
	render() {
		return (
			<p className="controls">
				<span className="button bpm-decrement">-</span>
				<span className="bpm-display">0</span>
				<span className="button bpm-increment">+</span>
			</p>
		);
	}
});

export let Metronome = React.createClass({
	render() {
		return (
			<div className="metronome">
				<Meter />
				<Controls />
			</div>
		)
	}
});

export default {
	Meter,
	Controls,
	Metronome
}
