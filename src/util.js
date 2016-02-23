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
export function tween(duration, fn) {
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
