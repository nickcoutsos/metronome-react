import React from 'react';
import { tween } from '../util';

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

export default Meter;
