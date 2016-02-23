import React from 'react';

/**
 * Quadratic tweening using requestAnimationFrame for timing.
 *
 * For each frame during the given duration an appropriate value between 0 and 1
 * is calculated and passed as an argument in a call to the given function.
 * The provided function is guaranteed to be called at least once with the final
 * value of 1.
 *
 * @param {Number}	duration	length of tween in milliseconds.
 * @param {Fucntion}	fn	function to be called with tweened values.
 */
function tween(duration, fn) {
	let start = Date.now(),
		step = function() {
			let d = Date.now() - start,
				t = d / duration,
				y = t*t;

			if (d >= duration) return fn(1);

			fn(y) !== false && requestAnimationFrame(step);
		};

	step();
}

// export let Meter = React.createClass({
export class Meter extends React.Component {
	constructor(...args) {
		super(...args);
		this.state = { animating: false, tween: 0 };
	}

	start() {
		this.setState({ animating: true });
	}

	stop() {
		this.setState({ animating: false, tween: 0 });
	}

	flash() {
		tween(this.props.secondsPerBeat * 500, f => {
			this.state.animating && this.setState({ tween: 1 - f });
			return this.state.animating;
		});
	}

	render() {
		let needleStyle = {
				animationDuration: `${this.props.secondsPerBeat}s`,
				backgroundColor: `hsl(0, ${this.state.tween * 100}%, 50%)`
			};

		let needleClasses = ['needle'];
		if (this.state.animating) needleClasses.push('needle-animating');

		return (
			<div ref="meter" className="meter" onClick={this.props.onClick} >
				<div className={needleClasses.join(' ')} style={ needleStyle } />
			</div>
		);
	}
}

export class Button extends React.Component {
	componentDidMount() {
		window.addEventListener('keydown', this.handleKey.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.handleKey.bind(this));
	}

	handleKey(e) {
		var keyCodes = this.props.keyCode.split(',');

		if (keyCodes.indexOf(String(e.keyCode)) > -1) this.action(e);
	}

	handleClick(e) {
		this.action(e);
	}

	action(...args) {
		this.flash();
		if (this.props.onTrigger) this.props.onTrigger(...args);
	}

	flash() {
		let classes = this.refs.el.classList;
		classes.add('flash');
		setTimeout(() => classes.remove('flash'), 100);
	}

	render() {
		return (
			<span ref="el" onClick={e => this.handleClick(e)} className="button">
				{this.props.children}
			</span>
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
			running: false
		};
	}

	componentDidMount() {
		window.addEventListener('blur', () => this.stop());
		window.addEventListener('keydown', e => {
			if (e.keyCode == 32) {
				this.toggle();
			}
		});

	}

	beat() {
		let handler = this.state.beats % 2 == 0 ?
			this.props.onTick :
			this.props.onTock;

		if (handler) handler();

		this.setState({ beats: ++this.state.beats });
		this.refs.meter.flash();
	}

	setBpm(bpm) {
		this.setState({ bpm });

		if (this.state.running) {
			this.stop();
			setTimeout(() => this.start(), 100);
		}
	}

	decrement(amount) {
		this.setBpm(Math.max(1, this.state.bpm - (amount || 1)));
	}

	increment(amount) {
		this.setBpm(Math.min(200, this.state.bpm + (amount || 1)));
	}

	handleScroll(e) {
		// ignore scroll events that are "more horizontal" than vertical
		if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

		var amount = e.shiftKey ? 10 : 1;

		e.deltaY < 0 ?
			this.increment(amount) :
			this.decrement(amount);
	}

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

		clearInterval(this.state.interval);

		this.refs.meter.stop();
		this.setState({
			interval: null,
			running: false
		});
	}

	toggle() {
		this.state.running ?
			this.stop() :
			this.start();
	}

	render() {
		return (
			<div className="metronome" onWheel={e => this.handleScroll(e)}>
				<Meter ref="meter" onClick={() => this.toggle()} secondsPerBeat={60 / this.state.bpm} />
				<p className="controls">
					<Button keyCode="189,37" onTrigger={() => this.decrement()}>-</Button>
					<span className="bpm-display">{this.state.bpm}</span>
					<Button keyCode="187,39" onTrigger={() => this.increment()}>+</Button>
				</p>
			</div>
		)
	}
}

export default {
	Meter,
	Button,
	Metronome
}
