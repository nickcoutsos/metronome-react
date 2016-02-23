import React from 'react';

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

export default Button;
