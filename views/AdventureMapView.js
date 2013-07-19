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

		this._tileSize = opts.tileSize;
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
				tileSize: opts.tileSize,
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

		this._content.style.width = this._adventureMapLayers[0].calcSizeX(0.5) * opts.tileSize;
		this._content.style.height = this._adventureMapLayers[0].calcSizeY(0.5) * opts.tileSize;

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
		var tileSize = this._tileSize;
		content.style.width = tileSize * adventureMapLayer.getSizeX();
		content.style.height = tileSize * adventureMapLayer.getSizeY();
		content.style.x = (this.style.width - content.style.width * scale) * 0.5;
		content.style.y = (this.style.height - content.style.height * scale) * 0.5;
	};

	this.onDragSingle = function (deltaX, deltaY) {
		this.scroll(deltaX / this._scrollData.scale, deltaY / this._scrollData.scale);
		this.emit('Scroll');
	};

	this.scroll = function (deltaX, deltaY) {
		var scrollData = this._scrollData;
		var tileSize = this._tileSize;

		scrollData.x += deltaX;
		if (scrollData.x < 0) {
			while (scrollData.x < 0) {
				scrollData.x += tileSize;
				this.emit('ScrollRight', scrollData);
				if (scrollData.maxX) {
					break;
				}
			}
		} else if (scrollData.x >= tileSize) {
			while (scrollData.x >= tileSize) {
				scrollData.x -= tileSize;
				this.emit('ScrollLeft', scrollData);
				if (scrollData.maxX) {
					break;
				}
			}
		}

		scrollData.y += deltaY;
		if (scrollData.y < 0) {
			while (scrollData.y < 0) {
				scrollData.y += tileSize;
				this.emit('ScrollDown', scrollData);
				if (scrollData.maxY) {
					break;
				}
			}
		} else if (scrollData.y >= tileSize) {
			while (scrollData.y >= tileSize) {
				scrollData.y -= tileSize;
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
		var tileSize = this._tileSize;
		var lastWidth = content.style.width;
		var lastHeight = content.style.height;
		var newWidth = tileSize * this._adventureMapLayers[0].calcSizeX(scale);
		var newHeight = tileSize * this._adventureMapLayers[0].calcSizeY(scale);

		this._scrollData.scale = scale;
		this._content.style.scale = scale;

		this.scroll((newWidth - lastWidth) * 0.5, (newHeight - lastHeight) * 0.5);
	};
});