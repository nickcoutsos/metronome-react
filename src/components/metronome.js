import React from 'react';
import { Button } from './button';
import { Meter } from './meter';

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
		bpm = Math.max(1, Math.min(bpm, 200));
		this.setState({ bpm });

		if (this.state.running) {
			this.stop();
			setTimeout(() => this.start(), 100);
		}
	}

	decrement(amount) {
		this.setBpm( this.state.bpm - (amount || 1) );
	}

	increment(amount) {
		this.setBpm( this.state.bpm + (amount || 1) );
	}

	handleScroll(e) {
		// ignore scroll events that are "more horizontal" than vertical
		if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

		var amount = e.shiftKey ? 10 : 1;

		e.deltaY < 0 ?
			this.increment(amount) :
			this.decrement(amount);
	}

	handleTouch(e) {
		let touch = e.touches.item(0),
			delta = (this.lastTouch || {}).screenY - touch.screenY,
			bpm = this.state.bpm + delta / 5;

		if (e.type === 'touchstart') this.lastTouch = touch;
		if (e.type === 'touchend' || e.type === 'touchcancel') this.lastTouch = null;
		if (e.type !== 'touchmove' || this.lastTouch === null) return;

		this.setBpm(Math.round(bpm));
		e.preventDefault();
		this.lastTouch = touch;
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
			<div className="metronome"
					onWheel={e => this.handleScroll(e)}
					onTouchStart={e => this.handleTouch(e)}
					onTouchMove={e => this.handleTouch(e)}
					onTouchEnd={e => this.handleTouch(e)}
				>
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

export default Metronome;
