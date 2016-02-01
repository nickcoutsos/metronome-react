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
		this.state = { animating: false, background: '' };
	}

	start() {
		this.setState({ animating: true });
	}

	stop() {
		this.setState({ animating: false });
	}

	flash() {
		tween(this.props.secondsPerBeat * 500, f => {
			if (!this.state.animating) return false;
			let sat = Math.round((1 - f) * 45 + 14),
				inner = `hsl(210, ${sat}%, ${(1 - f) * 5 + 82}%)`,
				outer = `hsl(210, ${sat}%, ${(1 - f) * 20 + 64}%)`,
				gradient = `circle farthest-corner at bottom right, ${inner}, ${outer} 70%`;

			this.setState({
				meterBackground : `radial-gradient(${gradient})`,
				needleBackground : `hsl(0, ${(1 - f) * 100}%, 50%)`
			});

			return true;
		});
	}

	render() {
		let style = { animationDuration: `${this.props.secondsPerBeat}s`, backgroundColor : this.state.needleBackground },
			needleClasses = ['needle'];

		if (this.state.animating) needleClasses.push('needle-animating');

		return (
			<div ref="meter" className="meter" onClick={this.props.onClick} style={ {background: this.state.meterBackground} }>
				<div className={needleClasses.join(' ')} style={style} />
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
		var amount = e.shiftKey ? 10 : 1;

		if (keyCodes.indexOf(String(e.keyCode)) > -1) this.action();
	}

	handleClick(e) {
		this.action();
	}

	action() {
		this.flash();
		if (this.props.onTrigger) this.props.onTrigger();
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
			running: false,
		};
	}

	componentDidMount() {
		window.addEventListener('blur', e => this.stop());
		window.addEventListener('keydown', e => {
			if (e.keyCode == 32) {
				this.toggle();
			}
		});

	}

	beat() {
		this.state.beats % 2 == 0 ? this.playTick() : this.playTock();
		this.setState({ beats: ++this.state.beats });
		this.refs.meter.flash();
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
				<Meter ref="meter" onClick={e => this.toggle()} secondsPerBeat={60 / this.state.bpm} />
				<p className="controls">
					<Button keyCode="189,37" onTrigger={e => this.decrement()}>-</Button>
					<span className="bpm-display">{this.state.bpm}</span>
					<Button keyCode="187,39" onTrigger={e => this.increment()}>+</Button>
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
