import ui.View as View;
import ui.TextView as TextView;
import ui.ImageView as ImageView;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		new TextView({
			superview: this,
			width: this.style.width,
			height: this.style.height * 0.6,
			fontFamily: 'BPReplay',
			size: 26,
			color: 'rgb(255, 255, 255)',
			strokeColor: 'rgb(15, 111, 55)',
			strokeWidth: 4,
			text: 'label',
			blockEvents: true,
		});

		var size = this.style.width / 3;

		this._stars = [];
		for (var i = 0; i < 3; i++) {
			this._stars.push(new ImageView({
				superview: this,
				x: i * size,
				y: this.style.height * 0.6,
				width: size,
				height: size,
				image: 'resources/images/icon/star.png'
			}));
		}
	};
});