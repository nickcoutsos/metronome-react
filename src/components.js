import React from 'react';
import EventEmitter from 'eventemitter3';


// export let Meter = React.createClass({
export class Meter extends React.Component {
	constructor(...args) {
		super(...args);
		this.state = { animating: false };
	}

	start() {
		this.setState({ animating: true });
	}

	stop() {
		this.setState({ animating: false });
	}

	render() {
		let style = { animationDuration: `${this.props.secondsPerBeat}s` },
			needleClasses = ['needle'];

		if (this.state.animating) needleClasses.push('needle-animating');

		return (
			<div className="meter" onClick={this.props.onClick}>
				<div className={needleClasses.join(' ')} style={style}>
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

	componentDidMount() {
		window.addEventListener('blur', e => this.stop());
		window.addEventListener('keydown', e => {
			var amount = e.shiftKey ? 10 : 1;

			if (e.keyCode == 187 || e.keyCode == 39) {
				this.increment(amount);
			} else if (e.keyCode == 189 || e.keyCode == 37) {
				this.decrement(amount);
			} else if (e.keyCode == 32) {
				this.toggle();
			}
		});

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

	handleScroll(e) {
		// ignore scroll events that are "more horizontal" than vertical
		if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

		var amount = e.shiftKey ? 10 : 1;

		e.deltaY < 0 ?
			this.increment(amount) :
			this.decrement(amount);
	}

	playTick() {}
	playTock() {}

	start() {
		this.refs.meter.start();

		let secondsPerBeat = 60 / this.state.bpm;

		this.setState({
			beats: 0,
			running: true,
			interval: setInterval(() => this.beat(), secondsPerBeat * 1000)
		});
	}

	stop() {
		if (!this.state.running) return;

		this.refs.meter.stop();

		clearInterval(this.state.interval);
		this.setState({
			interval: null,
			running: false
		});
	}

	toggle() {
		this.state.running ? this.stop() : this.start();
	}

	render() {
		return (
			<div className="metronome" onWheel={e => this.handleScroll(e)}>
				<Meter ref="meter" onClick={e => this.toggle()} secondsPerBeat={60 / this.state.bpm} />
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
