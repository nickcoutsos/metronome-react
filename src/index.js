import React from 'react';
import ReactDOM from 'react-dom';
import components from './components';

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
	// var metronome = new Metronome('.metronome', 90);
	ReactDOM.render(
		React.createElement(components.Metronome, null),
		document.getElementById('content')
	);
	set_content_size();
});
puredom(window).on('resize', set_content_size);