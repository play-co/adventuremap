import ui.View as View;
import ui.ScrollView as ScrollView;
import ui.GestureView as GestureView;

import .AdventureMapBackgroundView;
import .AdventureMapPathsView;
import .AdventureMapNodesView;
import .AdventureMapDoodadsView;

exports = Class(ScrollView, function (supr) {
	this.init = function (opts) {
		this._tileWidth = opts.tileSettings.tileWidth;
		this._tileHeight = opts.tileSettings.tileHeight;

		this._totalWidth = opts.gridSettings.width * this._tileWidth;
		this._totalHeight = opts.gridSettings.height * this._tileHeight;

		var scale = opts.scale || 0.5;

		opts = merge(
			opts,
			{
				scrollX: true,
				scrollY: true,
				scrollBounds: {
					minX: 0,
					minY: 0,
					maxX: this._totalWidth * scale,
					maxY: this._totalHeight * scale
				},
				bounce: false,
				minScale: 0.5,
				maxScale: 2
			}
		);

		supr(this, 'init', [opts]);

		this._minScale = opts.minScale;
		this._maxScale = opts.maxScale;
		this._tileSettings = opts.tileSettings;
		this._adventureMapLayers = [];
		this._inputLayerIndex = opts.inputLayerIndex;

		this._content = new GestureView({
			superview: this,
			x: 0,
			y: 0,
			width: this._totalWidth,
			height: this._totalHeight,
			scale: scale
		});

		this._pinchEndTimeout = null;
		this._pinch = false;

		this._content.on('FingerUp', bind(this, 'onFingerUp'));
		this._content.on('ClearMulti', bind(this, 'onClearMulti'));
		this._content.on('Pinch', bind(this, 'onPinch'));

		var ctors = [
				AdventureMapBackgroundView,
				AdventureMapPathsView,
				AdventureMapNodesView,
				AdventureMapDoodadsView
			];
		for (var i = 0; i < ctors.length; i++) {
			this._adventureMapLayers.push(new ctors[i]({
				superview: this._content,
				adventureMapView: this,
				x: 0,
				y: 0,
				width: this._totalWidth,
				height: this._totalHeight,
				map: opts.map,
				gridSettings: opts.gridSettings,
				tileCtor: ctors[i],
				tileSettings: opts.tileSettings,
				gridSettings: opts.gridSettings,
				nodeSettings: opts.nodeSettings,
				pathSettings: opts.pathSettings,
				editMode: opts.editMode,
				blockEvents: opts.editMode ? (i !== 0) : (i < 2)
			}));
		}
	};

	this.setOffset = function (x, y) {
		if (Object.keys(this._touch).length <= 1) {
			supr(this, 'setOffset', arguments);
		}
	};

	this.onUpdate = function (data) {
		for (var i = 0; i < 4; i++) {
			var adventureMapLayer = this._adventureMapLayers[i];
			adventureMapLayer && adventureMapLayer.onUpdate && adventureMapLayer.onUpdate(data);
		}
	};

	this.onFingerUp = function (activeFingers) {
		activeFingers || this.onClearMulti();
	};

	this.onClearMulti = function () {
		this._pinchEndTimeout && clearTimeout(this._pinchEndTimeout);
		this._pinchEndTimeout = setTimeout(
			bind(this, function () {
				this._pinch = false;
			}),
			10
		);
	};

	this.onPinch = function (pinchScale) {
		this._pinch = true;

		this.setScale(pinchScale);
	};

	this.onDrag = function (dragEvt, moveEvt, delta) {
		this._pinch || supr(this, 'onDrag', arguments);
	};

	this.onDragStop = function (dragEvt, selectEvt) {
		this._pinch || supr(this, 'onDragStop', arguments);
	};

	this.getAdventureMapLayers = function () {
		return this._adventureMapLayers;
	};

	this.getTileWidth = function () {
		return this._tileWidth;
	};

	this.getTileHeight = function () {
		return this._tileHeight;
	};

	this.getScale = function (scale) {
		return this._content.style.scale;
	};

	this.setScale = function (scale) {
		var lastScale = this._content.style.scale;
		scale = Math.min(Math.max(scale, this._minScale), this._maxScale);

		this._content.style.scale = scale;

		var x = this._contentView.style.x * scale / lastScale + (lastScale - scale) * this.style.width * 0.5;
		var y = this._contentView.style.y * scale / lastScale + (lastScale - scale) * this.style.height * 0.5;

		this._contentView.style.x = Math.min(Math.max(x, -(this._totalWidth * scale - this.style.width)), 0);
		this._contentView.style.y = Math.min(Math.max(y, -(this._totalHeight * scale - this.style.height)), 0);

		this.setScrollBounds({
			minX: 0,
			minY: 0,
			maxX: this._totalWidth * scale,
			maxY: this._totalHeight * scale
		});
	};

	this.refreshTile = function (tileX, tileY) {
		var adventureMapLayers = this._adventureMapLayers;
		var i = this._adventureMapLayers.length;

		while (i) {
			this._adventureMapLayers[--i].refreshTile(tileX, tileY);
		}		
	};

	this.focusNodeById = function (node) {
		var scale = this._content.style.scale;
		var x = Math.max((node.tileX * this._tileSettings.tileWidth) * scale - this.style.width * 0.5, 0);
		var y = Math.max((node.tileY * this._tileSettings.tileHeight) * scale - this.style.height * 0.5, 0);

		this.scrollTo(x, y, 300);
	};

	this.removeItemViews = function () {
		this._adventureMapLayers[3].removeItemViews();
	};
});