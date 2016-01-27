class Metronome {
	constructor(selector, bpm, sfx_url) {
		this.selector = selector;
		this.metronome = puredom(this.selector);
		this.bpm = bpm || 60;
		this._sfx = {
			tick: new Audio(),
			tock: new Audio()
		};

		this._sfx.tick.src = "";
		this._sfx.tock.src = "";
		this._sfx.tick.preload = 'auto';
		this._sfx.tock.preload = 'auto';

		this._interval = null;
		this._beats = 0;


		this.metronome.query('.meter').addEvent('click', e => this.toggle());
		this.metronome.query('.bpm-increment').addEvent('click', e => this.increment());
		this.metronome.query('.bpm-decrement').addEvent('click', e => this.decrement());
		puredom(document).on('keyDown', e => {
			var amount = 1;
			if (e.shiftKey) {
				amount = 10;
			}

			if (e.keyCode == 187 || e.keyCode == 39) {
				this.increment(amount);
			} else if (e.keyCode == 189 || e.keyCode == 37) {
				this.decrement(amount);
			} else if (e.keyCode == 32) {
				this.toggle();
			}
		});

		puredom(window).on('blur', e => this.stop());
		this.metronome.on('mousewheel', e => {
			var amount = 1;
			if (e.shiftKey) {
				amount = 10;
			}
			if (Math.abs(e.wheelDeltaY) > Math.abs(e.wheelDeltaX)){ 
				if (e.wheelDeltaY > 0) {
					this.increment(amount);
				}
				else {
					this.decrement(amount);
				}
			}
		});

		this._on_bpm_update();
	}

	increment(amount) {
		var amount = amount || 1;
		if (this.bpm < 200) {
			this.bpm = Math.min(200, this.bpm + amount);
			this._on_bpm_update();
		}

		this.metronome.query('.bpm-increment').classify('flash');
		setTimeout(() => this.metronome.query('.bpm-increment').declassify('flash'), 100);
	}

	decrement(amount) {
		var amount = amount || 1;
		if (this.bpm > 1) {
			this.bpm = Math.max(1, this.bpm - amount);
			this._on_bpm_update();
		}

		this.metronome.query('.bpm-decrement').classify('flash');
		setTimeout(() => this.metronome.query('.bpm-decrement').declassify('flash'), 100);
	}

	seconds_per_beat() {
		return 60 / this.bpm;
	}

	running() {
		return this._interval != null;
	}

	_on_bpm_update() {
		var duration = this.seconds_per_beat() + 's';

		this.metronome.query('.bpm-display').text(this.bpm);
		puredom('.needle').css({
			'-webkit-animation-duration': duration,
			'-moz-animation-duration': duration,
			'-o-animation-duration': duration,
			'animation-duration': duration
		});

		if (this.running()) {
			this.stop();
			setTimeout(() => this.start(),100);
		}
	}

	_beat() {
		if (this._beats % 2 == 0) {
			//this._sfx.tick.currentTime = 0.0885;
			//this._sfx.tick.play();
		} else {
			//this._sfx.tock.currentTime = 0.0705;
			//this._sfx.tock.play();
		}

		this.metronome.query('.needle')
			.css({'background': '#FF0000'})
			.css({'background': 'gray'},
				 {'tween': this.seconds_per_beat() * 500});
		this.metronome.query('.meter')
			.animate(function(f) {
				var saturation = Math.round((1 - f) * 45 + 14),
					hsl_inner = 'hsl(210, ' + saturation + '%, ' + ((1 - f) * 5 + 82) + '%)',
					hsl_outer = 'hsl(210, ' + saturation + '%, ' + ((1 - f) * 20 + 64) + '%)',
					gradient = (
						'(bottom right, circle cover, '
						+ hsl_inner + ', '
						+ hsl_outer + ' 70%)'
					);

				this.css({'background': '-webkit-radial-gradient' + gradient});

			}, this.seconds_per_beat() * 500, 'ease');

		this._beats++;
	}

	toggle() {
		if (!this.running()) {
			this.start();
		} else {
			this.stop();
		}
	}

	start() {
		this._beats = 0;

		this.metronome.query('.needle').classify('needle-animating');

		this._interval = setInterval(() => this._beat(), this.seconds_per_beat() * 1000);
	}

	stop() {
		if (this.running()) {
			this.metronome.query('.needle').declassify('needle-animating');

			clearInterval(this._interval);
			this._interval = null;
		}
	}
}

function set_metronome_size() {
	var content = puredom('#content');
	var metronome = content.query('.metronome');

	var c_width = content.width({padding:false, margin:false, border:false});
	var c_height = content.height();
	var available_length = Math.min(c_width - 40, c_height - metronome.y());

	metronome.css({
		'height': available_length + 'px',
		'width': available_length + 'px'
	});

	metronome.query('.controls').css({
		'height': available_length / 7 + 'px',
		'line-height': available_length / 7 + 'px',
		'font-size': available_length / 7 + 'px'
	});
}
function set_content_size() {
	var window_height = puredom('body').height();
	var header_height = puredom('#header').height({border:true, padding:true, margin:true});
	var footer_height = puredom('#footer').height({border:true, padding:true});

	var new_height = window_height - header_height - footer_height;

	puredom('#content').css({'height': new_height + 'px'});

	set_metronome_size();
}

puredom(function(){
	var metronome = new Metronome('.metronome', 90);
	set_content_size();
});
puredom(window).on('resize', set_content_size);