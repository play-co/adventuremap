import ui.View as View;

import .AdventureMapLayerView;

import .tiles.TileView as TileView;
import .tiles.PathView as PathView;
import .tiles.NodeView as NodeView;
import .tiles.LabelView as LabelView;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		this.style.clip = true;

		this._tileWidth = opts.tileWidth;
		this._tileHeight = opts.tileHeight;
		this._scrollData = opts.scrollData;
		this._adventureMapLayers = [];

		var ctors = [TileView, PathView, NodeView];

		this._content = new View({
			superview: this,
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			backgroundColor: 'red'
		});

		for (var i = 0; i < 3; i++) {
			this._adventureMapLayers.push(new AdventureMapLayerView({
				superview: this._content,
				x: opts.x,
				y: opts.y,
				width: opts.width,
				height: opts.height,
				tileWidth: opts.tileWidth,
				tileHeight: opts.tileHeight,
				tileCtor: ctors[i],
				scrollData: opts.scrollData,
				map: opts.map,
				tiles: opts.tiles,
				paths: opts.paths,
				nodes: opts.nodes,
				labelCtor: opts.labelCtor || LabelView,
				blockEvents: i > 0
			}));
		}

		this._content.style.width = this._adventureMapLayers[0].calcSizeX(0.5) * opts.tileWidth;
		this._content.style.height = this._adventureMapLayers[0].calcSizeY(0.5) * opts.tileHeight;

		this._gestureView = this._adventureMapLayers[0];
		this._gestureView.on('DragSingle', bind(this, 'onDragSingle'));
	};

	this.onUpdate = function (data) {
		var x = this._scrollData.x;
		var y = this._scrollData.y;

		for (var i = 0; i < 3; i++) {
			var adventureMapLayer = this._adventureMapLayers[i];
			adventureMapLayer.onUpdate(data);
			adventureMapLayer.style.x = x;
			adventureMapLayer.style.y = y;
		}

		var content = this._content;
		var scale = content.style.scale;
		content.style.width = this._tileWidth * adventureMapLayer.getSizeX();
		content.style.height = this._tileHeight * adventureMapLayer.getSizeY();
		content.style.x = (this.style.width - content.style.width * scale) * 0.5;
		content.style.y = (this.style.height - content.style.height * scale) * 0.5;
	};

	this.onDragSingle = function (deltaX, deltaY) {
		this.scroll(deltaX / this._scrollData.scale, deltaY / this._scrollData.scale);
		this.emit('Scroll');
	};

	this.scroll = function (deltaX, deltaY) {
		var scrollData = this._scrollData;

		scrollData.x += deltaX;
		if (scrollData.x < 0) {
			while (scrollData.x < 0) {
				scrollData.x += this._tileWidth;
				this.emit('ScrollRight', scrollData);
				if (scrollData.maxX) {
					break;
				}
			}
		} else if (scrollData.x >= this._tileWidth) {
			while (scrollData.x >= this._tileWidth) {
				scrollData.x -= this._tileWidth;
				this.emit('ScrollLeft', scrollData);
				if (scrollData.maxX) {
					break;
				}
			}
		}

		scrollData.y += deltaY;
		if (scrollData.y < 0) {
			while (scrollData.y < 0) {
				scrollData.y += this._tileHeight;
				this.emit('ScrollDown', scrollData);
				if (scrollData.maxY) {
					break;
				}
			}
		} else if (scrollData.y >= this._tileHeight) {
			while (scrollData.y >= this._tileHeight) {
				scrollData.y -= this._tileHeight;
				this.emit('ScrollUp', scrollData);
				if (scrollData.maxY) {
					break;
				}
			}
		}
	};

	this.needsPopulate = function () {
		for (var i = 0; i < 3; i++) {
			this._adventureMapLayers[i].needsPopulate();
		}
	};

	this.getAdventureMapLayers = function () {
		return this._adventureMapLayers;
	};

	this.setScale = function (scale) {
		var content = this._content;
		var lastWidth = content.style.width;
		var lastHeight = content.style.height;
		var newWidth = this._tileWidth * this._adventureMapLayers[0].calcSizeX(scale);
		var newHeight = this._tileHeight * this._adventureMapLayers[0].calcSizeY(scale);

		this._scrollData.scale = scale;
		this._content.style.scale = scale;

		this.scroll((newWidth - lastWidth) * 0.5, (newHeight - lastHeight) * 0.5);
	};

	this.getScale = function () {
		return this._scrollData.scale;
	};

	this.setTileWidth = function (tileWidth) {
		this._tileWidth = tileWidth;

		for (var i = 0; i < 3; i++) {
			this._adventureMapLayers[i].setTileWidth(tileWidth);
		}
	};

	this.setTileHeight = function (tileHeight) {
		this._tileHeight = tileHeight;

		for (var i = 0; i < 3; i++) {
			this._adventureMapLayers[i].setTileHeight(tileHeight);
		}
	};
});