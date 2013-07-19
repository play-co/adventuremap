import ui.ScrollView as ScrollView;

import menus.constants.menuConstants as menuConstants;

import ..components.BottomBar as BottomBar;
import ..components.EditButton as EditButton;

exports = Class(BottomBar, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		var scrollView = new ScrollView({
			superview: this,
			x: 0,
			y: 0,
			width: this.style.width,
			height: size,
			scrollX: true,
			scrollY: false
		});

		this._tile = null;
		this._tags = opts.tags;
		this._adventureMapModel = opts.adventureMapModel;
		this._buttons = [];

		var size = this.style.height;
		var x = 4;

		for (var i = 0; i < opts.tags.length; i++) {
			this._buttons.push(new EditButton({
				superview: this,
				x: x,
				y: 4,
				width: 140,
				height: size - 8,
				style: 'RED',
				title: opts.tags[i]
			}).on('Up', bind(this, 'onTag', i)));
			x += 136;
		}
	};

	this.show = function (tileX, tileY) {
		supr(this, 'show');

		this._tileX = tileX;
		this._tileY = tileY;
		this._tile = this._adventureMapModel.getGrid(this._tileX, this._tileY);

		this.updateTags();
	};

	this.updateTags = function () {
		var i = this._tags.length;
		while (i) {
			var tag = this._tags[--i];
			if (this._tile.tags && this._tile.tags[tag]) {
				this._buttons[i].updateOpts({
					images: {
						down: menuConstants.BUTTONS.GREEN.DOWN,
						up: menuConstants.BUTTONS.GREEN.UP
					}
				});
				this._buttons[i].setImage(menuConstants.BUTTONS.GREEN.UP);
			} else {
				this._buttons[i].updateOpts({
					images: {
						down: menuConstants.BUTTONS.RED.DOWN,
						up: menuConstants.BUTTONS.RED.UP
					}
				});
				this._buttons[i].setImage(menuConstants.BUTTONS.RED.UP);
			}
		}
	};

	this.onTag = function (index) {
		var tile = this._tile;
		var tag = this._tags[index];

		if (!tile.tags) {
			tile.tags = {};
		}
		if (tile.tags[tag]) {
			delete tile.tags[tag];
		} else {
			tile.tags[tag] = true;
		}
		this.updateTags();
	};
});