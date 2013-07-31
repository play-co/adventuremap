import math.geom.Vec2D as Vec2D;

import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;

import ..ViewPool;

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {
		opts.blockEvents = true;
		opts.width = opts.tileSettings.tileWidth;
		opts.height = opts.tileSettings.tileHeight;

		supr(this, 'init', [opts]);

		supr(this, 'init', [opts]);

		this._tileWidth = opts.tileSettings.tileWidth;
		this._tileHeight = opts.tileSettings.tileHeight;

		this._pathRightView = null;
		this._pathBottomView = null;
		this._pathRightTopView = null;
		this._pathRightBottomView = null;

		this._doAddPath = true;

		this._paths = opts.pathSettings.paths;
		this._dotDistance = opts.pathSettings.dotDistance;
		this._dashDistance = opts.pathSettings.dashDistance;

		this._tileX = 0;
		this._tileY = 0;

		this._vec = new Vec2D({x: 1, y: 1});
	};

	this._addPath = function () {
		var result = new View({
			superview: this,
			x: 0,
			y: 0,
			width: 40,
			height: 40,
			visible: false,
			//backgroundColor: 'rgba(255,0,0,0.3)',
			clip: true
		});

		return result;
	};

	this._updatePath = function (grid, x1, y1, x2, y2, view, path) {
		var node1 = ((y1 >= 0) && (grid[y1] !== undefined)) ? grid[y1][x1] : false;
		var node2 = ((y2 >= 0) && (grid[y2] !== undefined)) ? grid[y2][x2] : false;

		if (!node1 || !node2) {
			return;
		}

		var style = view.style;
		var center = path.height * 0.5;
		var vec = this._vec;
		var a1 = node1.x * this._tileWidth;
		var b1 = node1.y * this._tileHeight;
		var a2 = (x2 - x1 + node2.x) * this._tileWidth;
		var b2 = (y2 - y1 + node2.y) * this._tileHeight;

		vec.x = a2 - a1;
		vec.y = b2 - b1;

		style.x = a1;
		style.y = b1;
		style.width = vec.getMagnitude() + center * 2 - 110;
		style.height = path.height;
		style.offsetX = -55;//-center; todo: setting
		style.offsetY = -center;
		style.anchorX = 55;//center; todo: setting
		style.anchorY = center;
		style.r = vec.getAngle();

		var hideFrom = 1;
		var subviews = view.getSubviews();

		switch (path.type) {
			case 'dot':
				var count = (style.width / this._dotDistance) | 0;
				if (count > 0) {
					var step = style.width / count;
					for (var i = 0; i < count; i++) {
						var subview = (i < subviews.length) ? subviews[i] : new ImageView({superview: view});
						var subviewStyle = subview.style;

						subview.setImage(path.image);
						subviewStyle.x = i * step + center - path.width * 0.5;
						subviewStyle.y = center - path.height * 0.5;
						subviewStyle.width = path.width;
						subviewStyle.height = path.height;
						subviewStyle.visible = true;
					}
				}
				hideFrom = count;
				break;

			case 'dash':
				var count = (style.width / this._dashDistance) | 0;
				if (count > 0) {
					var step = style.width / count;
					for (var i = 0; i < count; i++) {
						var subview = (i < subviews.length) ? subviews[i] : new ImageView({superview: view});
						var subviewStyle = subview.style;

						subview.setImage(path.image);
						subviewStyle.x = i * step + center - path.width * 0.5;
						subviewStyle.y = center - path.height * 0.5;
						subviewStyle.width = path.width;
						subviewStyle.height = path.height;
						subviewStyle.visible = true;
					}
				}
				hideFrom = count;
				break;

			case 'line':
				var subview = (subviews.length < 1) ? new ImageView({superview: view}) : subviews[0];
				var subviewStyle = subview.style;

				subview.setImage(path.image);
				subviewStyle.x = 0;
				subviewStyle.y = 0;
				subviewStyle.width = style.width - 90; // todo: settings
				subviewStyle.height = style.height;
				subviewStyle.visible = true;
				break;
		}

		for (var i = hideFrom; i < subviews.length; i++) {
			subviews[i].style.visible = false;
		}
	};

	this.update = function (grid, tileX, tileY) {
		this._tileX = tileX;
		this._tileY = tileY;

		if (this._doAddPath) {
			this._pathRightView = this._addPath();
			this._pathBottomView = this._addPath();
			this._pathRightTopView = this._addPath();
			this._pathRightBottomView = this._addPath();

			this._doAddPath = false;
		}

		var tile = grid[tileY][tileX];

		this._pathRightView.style.visible = tile.right;
		tile.right && this._updatePath(grid, tileX, tileY, tileX + 1, tileY, this._pathRightView, this._paths[tile.right - 1]);

		this._pathBottomView.style.visible = tile.bottom;
		tile.bottom && this._updatePath(grid, tileX, tileY, tileX, tileY + 1, this._pathBottomView, this._paths[tile.bottom - 1]);

		this._pathRightTopView.style.visible = tile.rightTop;
		tile.rightTop && this._updatePath(grid, tileX, tileY, tileX + 1, tileY - 1, this._pathRightTopView, this._paths[tile.rightTop - 1]);

		this._pathRightBottomView.style.visible = tile.rightBottom;
		tile.rightBottom && this._updatePath(grid, tileX, tileY, tileX + 1, tileY + 1, this._pathRightBottomView, this._paths[tile.rightBottom - 1]);

		this.style.visible = tile.right || tile.bottom || tile.rightTop || tile.rightBottom;
	};

	this.setTileWidth = function (tileWidth) {
		this._tileWidth = tileWidth;
	};

	this.setTileHeight = function (tileHeight) {
		this._tileHeight = tileHeight;
	};
});