import animate;

import ui.View as View;
import ui.ImageView as ImageView;
import ui.ImageScaleView as ImageScaleView;
import ui.TextView as TextView;
import ui.ScrollView as ScrollView;

import menus.constants.menuConstants as menuConstants;

import .components.TopBar as TopBar;
import .components.EditButton as EditButton;

exports = Class(TopBar, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		var size = this.style.height;

		this._size = size;

		var options = [
				{title: 'Bottom', method: 'onBottom'},
				{title: 'Right', method: 'onRight'},
				{title: 'Node', method: 'onNode'},
				{title: 'Tile', method: 'onTile'},
				{title: 'Tags', method: 'onTags'},
				{title: 'Zoom', method: 'onZoom'}
			];

		var scrollView = new ScrollView({
			superview: this,
			x: 0,
			y: 0,
			width: this.style.width - size,
			height: size,
			scrollX: true,
			scrollY: false,
			scrollBounds: {
				minX: 0,
				maxX: options.length * 136 + 4,
				minY: 0,
				maxY: 0
			}
		});

		var x = 4;
		for (var i = 0; i < options.length; i++) {
			var option = options[i];
			new EditButton({
				superview: scrollView,
				x: x,
				y: 4,
				width: 140,
				height: size - 8,
				title: option.title
			}).on('Up', bind(this, option.method));
			x += 136;
		}

		new EditButton({
			superview: this,
			x: this.style.width - size + 4,
			y: 4,
			width: size - 8,
			height: size - 8,
			icon: {
				image: 'resources/images/editor/buttonClose.png',
				x: (size - 8) * 0.2,
				y: (size - 8) * 0.18,
				width: (size - 8) * 0.6,
				height: (size - 8) * 0.6
			},
			style: 'RED'
		}).on('Up', bind(this, 'onClose'));
	};

	this.onRight = function () {
		this.emit('Right');
	};

	this.onBottom = function () {
		this.emit('Bottom');
	};

	this.onNode = function () {
		this.emit('Node');
	};

	this.onTile = function () {
		this.emit('Tile');
	};

	this.onTags = function () {
		this.emit('Tags', this._tileX, this._tileY);
	};

	this.onZoom = function () {
		this.emit('Zoom');
	};

	this.onClose = function () {
		this.emit('Close');
		this.hide();
	};
});