import ui.TextPromptView as TextPromptView;

import ..components.BottomBar as BottomBar;

exports = Class(BottomBar, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		var size = this.style.height;

		this._title = new TextPromptView({
			superview: this,
			x: 8,
			y: 8,
			height: size - 16,
			width: this.style.width * 0.5 - 16,
			backgroundColor: '#FFFFFF'
		});
		this._text = new TextPromptView({
			superview: this,
			x: this.style.width * 0.5 + 8,
			y: 8,
			height: size - 16,
			width: this.style.width * 0.5 - 16,
			backgroundColor: '#FFFFFF'
		});
	};
});