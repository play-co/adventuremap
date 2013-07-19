import math.geom.Vec2D as Vec2D;

import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;

import ..ViewPool;

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {
		opts.blockEvents = true;

		supr(this, 'init', [opts]);

		this._itemView = null;
		this._itemRightView = null;
		this._itemBottomView = null;

		this._tileX = 0;
		this._tileY = 0;

		this._labelWidth = opts.labelWidth;
		this._labelHeight = opts.labelHeight;

		this._itemView = new ImageView({
			superview: this,
			width: 100,
			height: 100,
			image: 'resources/images/path/dot.png'
		});

		this._labelView = new opts.labelCtor({
			superview: this,
			width: this._labelWidth,
			height: this._labelHeight			
		});

		this._nodes = opts.nodes;
	};

	this.update = function (grid, tileX, tileY) {
		this._tileX = tileX;
		this._tileY = tileY;

		var tile = grid[tileY][tileX];
		if (tile.node) {
			var x = this.style.width * tile.x;
			var y = this.style.height * tile.y;

			var node = this._nodes[tile.node - 1];
			var style = this._itemView.style;

			style.x = x - node.width * 0.5;
			style.y = y - node.height * 0.5;
			style.width = node.width;
			style.height = node.height;

			this._itemView.setImage(node.image);

			style = this._labelView.style;

			style.x = x - style.width * 0.5;
			style.y = y - style.height * 0.5;
		}
		this.style.visible = tile.node;
	};
});