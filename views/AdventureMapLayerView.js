import ui.View as View;
import ui.resource.Image as Image;
import ui.GestureView as GestureView;

import .ViewPool;

exports = Class(GestureView, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		var tileWidth = opts.tileWidth;
		var tileHeight = opts.tileHeight;

		this.style.x = -tileWidth;
		this.style.y = -tileHeight;

		this._grid = null; // Grid data controlled by model, needed here for updating individual tiles
		this._tileX = 0; // Scroll offset, controlled by model
		this._tileY = 0; // Scroll offset, controlled by model

		this._tileWidth = tileWidth;
		this._tileHeight = tileHeight;
		this._tiles = opts.tiles ? this._loadTiles(opts.tiles) : [];
		this._map = opts.map;
		this._scrollData = opts.scrollData;

		this._nodeItemViews = [];

		this._viewPool = new ViewPool({
			initCount: 256,
			ctor: opts.tileCtor,
			initOpts: {
				superview: this,
				width: opts.tileSettings.tileWidth,
				height: opts.tileSettings.tileHeight,
				map: opts.map,
				tileSettings: opts.tileSettings,
				pathSettings: opts.pathSettings,
				nodeSettings: opts.nodeSettings,
				editMode: opts.editMode
			}
		});

		this._updateSize();
	};

	this.addNodeItemView = function(nodeItemView) {
		this._nodeItemViews.push(nodeItemView);
	};

	this.calcSizeX = function (scale) {
		var width = this._superview.getSuperview().style.width; // AdventureMapView
		return Math.ceil(width / (this._tileWidth * scale)) + 2;
	};

	this.calcSizeY = function (scale) {
		var height = this._superview.getSuperview().style.height; // AdventureMapView
		return Math.ceil(height / (this._tileHeight * scale)) + 2;
	};

	this._updateSize = function () {
		var width = this._superview.getSuperview().style.width; // AdventureMapView
		var height = this._superview.getSuperview().style.height; // AdventureMapView
		var scale = this._superview.style.scale; // AdventureMapView._content

		if ((width !== this._width) || (height !== this._height) || (scale !== this._scale)) {
			this._width = width;
			this._height = height;
			this._scale = scale;
			this._sizeX = this.calcSizeX(scale);
			this._sizeY = this.calcSizeY(scale);
			this._needsPopulate = true;
		}
	};

	this._loadTiles = function (tiles) {
		var i = tiles.length;
		while (i) {
			if (typeof tiles[--i] === 'string') {
				tiles[i] = new Image({url: tiles[i]});
			}
		}

		return tiles;
	};

	this.populateView = function (data) {
		var nodeItemViews = this._nodeItemViews;
		var i = nodeItemViews.length;

		while (i) {
			nodeItemViews[--i].style.visible = false;
		}

		var grid = data.grid;
		var tileWidth = this._tileWidth;
		var tileHeight = this._tileHeight;
		var sizeX = this._sizeX;
		var sizeY = this._sizeY;
		var viewPool = this._viewPool;
		var views = viewPool.getViews();
		var length = viewPool.getLength();
		var index = 0;

		this._grid = grid;
		this._tileX = data.tileX; // Save, needed in refreshTile
		this._tileY = data.tileY; // Save, needed in refreshTile

		for (var y = 0; y < sizeY; y++) {
			for (var x = 0; x < sizeX; x++) {
				var view;
				if (index < length) {
					view = views[index];
				} else {
					view = viewPool.obtainView();
					length++;
				}
				view.style.zIndex = sizeX * sizeY - index;
				view.style.x = x * tileWidth;
				view.style.y = y * tileHeight;
				view.style.width = tileWidth;
				view.style.height = tileHeight;
				view.update(grid, data.tileX + x, data.tileY + y);
				index++;
			}
		}
		while (index < length) {
			view = views[index++].style.visible = false;
		}

		this.style.width = sizeX * tileWidth;
		this.style.height = sizeY * tileHeight;

		this._gridWidth = data.width;
		this._gridHeight = data.height;
		this._needsPopulate = false;

		this._superview.getSuperview().emit('Size', sizeX, sizeY);
	};

	this.onUpdate = function (data) {
		this._updateSize();
		this._needsPopulate && this.populateView(data);
	};

	this.needsPopulate = function () {
		this._needsPopulate = true;
	};

	this.getMap = function () {
		return this._map;
	};

	this.getSizeX = function () {
		return this._sizeX;
	};

	this.getSizeY = function () {
		return this._sizeY;
	};

	this.setTileWidth = function (tileWidth) {
		var viewPool = this._viewPool;
		var views = viewPool.getViews();
		var length = viewPool.getLength();

		while (length) {
			var view = views[--length];
			view.setTileWidth && view.setTileWidth(tileWidth);
		}

		this._scale = null; // Forces the dimensions to be recalculated...	
		this._tileWidth = tileWidth;
	};

	this.setTileHeight = function (tileHeight) {
		var viewPool = this._viewPool;
		var views = viewPool.getViews();
		var length = viewPool.getLength();

		while (length) {
			var view = views[--length];
			view.setTileHeight && view.setTileWidth(tileHeight);
		}

		this._scale = null; // Forces the dimensions to be recalculated...	
		this._tileHeight = tileHeight;
	};

	this.refreshTile = function (tileX, tileY) {
		if ((tileX >= this._tileX) && (tileX < this._tileX + this._sizeX) &&
			(tileY >= this._tileY) && (tileY < this._tileY + this._sizeY)) {
			var x = tileX - this._tileX;
			var y = tileY - this._tileY;

			this._viewPool.getViews()[y * this._sizeX + x].update(this._grid, tileX, tileY);
		}
	};
});