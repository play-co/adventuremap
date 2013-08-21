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
				bounce: false
			}
		);

		supr(this, 'init', [opts]);

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

	this.onUpdate = function (data) {
		for (var i = 0; i < 4; i++) {
			var adventureMapLayer = this._adventureMapLayers[i];
			adventureMapLayer && adventureMapLayer.onUpdate && adventureMapLayer.onUpdate(data);
		}
	};

	this.getAdventureMapLayers = function () {
		return this._adventureMapLayers;
	};

	this.setScale = function (scale) {
		this._content.style.scale = scale;

		this.setScrollBounds({
			minX: 0,
			minY: 0,
			maxX: this._totalWidth * scale,
			maxY: this._totalHeight * scale
		});
		this.scrollTo(offsetX, offsetY, 0);
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