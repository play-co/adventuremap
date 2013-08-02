import ui.View as View;
import ui.ScrollView as ScrollView;

import .AdventureMapBackgroundView;
import .AdventureMapPathsView;
import .AdventureMapNodesView;

import .tiles.TileView as TileView;
import .tiles.PathView as PathView;
import .tiles.NodeView as NodeView;

exports = Class(ScrollView, function (supr) {
	this.init = function (opts) {
		this._tileWidth = opts.tileSettings.tileWidth;
		this._tileHeight = opts.tileSettings.tileHeight;

		var totalWidth = opts.gridSettings.width * this._tileWidth;
		var totalHeight = opts.gridSettings.height * this._tileHeight;

		opts = merge(
			opts,
			{
				scrollX: true,
				scrollY: true,
				scrollBounds: {
					minX: 0,
					minY: 0,
					maxX: totalWidth,
					maxY: totalHeight
				},
				bounce: false
			}
		);

		supr(this, 'init', [opts]);

		this.style.clip = true;

		this._tileSettings = opts.tileSettings;
		this._adventureMapLayers = [];
		this._inputLayerIndex = opts.inputLayerIndex;

		this._content = new View({
			superview: this,
			x: 0,
			y: 0,
			width: totalWidth,
			height: totalHeight,
			scale: 0.5,
			backgroundColor: 'red'
		});

		this.setScrollBounds({
			minX: 0,
			minY: 0,
			maxX: totalWidth * this._content.style.scale,
			maxY: totalHeight * this._content.style.scale
		});

		var ctors = [AdventureMapBackgroundView, AdventureMapPathsView, AdventureMapNodesView];
		for (var i = 0; i < 3; i++) {
			this._adventureMapLayers.push(new ctors[i]({
				superview: this._content,
				adventureMapView: this,
				x: 0,
				y: 0,
				width: totalWidth,
				height: totalHeight,
				map: opts.map,
				gridSettings: opts.gridSettings,
				tileCtor: ctors[i],
				tileSettings: opts.tileSettings,
				gridSettings: opts.gridSettings,
				nodeSettings: opts.nodeSettings,
				pathSettings: opts.pathSettings,
				editMode: opts.editMode,
				blockEvents: (i !== this._inputLayerIndex)
			}));
		}

		//this._adventureMapLayers[2].on('SelectNode', function(tile) { console.log(tile); });
	};

	this.onUpdate = function (data) {
		for (var i = 0; i < 3; i++) {
			var adventureMapLayer = this._adventureMapLayers[i];
			adventureMapLayer && adventureMapLayer.onUpdate && adventureMapLayer.onUpdate(data);
		}
	};

	this.onAddTag = function (tileX, tileY, tag) {
		this._adventureMapLayers[2].addTag(tileX, tileY, tag);
	};

	this.onRemoveTag = function (tileX, tileY, tag) {
		console.log(tileX, tileY, tag);
	};

	this.getAdventureMapLayers = function () {
		return this._adventureMapLayers;
	};

	this.setScale = function (scale) {
	};

	this.refreshTile = function (tileX, tileY) {
		for (var i = 1; i < 3; i++) {
			this._adventureMapLayers[i].refreshTile(tileX, tileY);
		}		
	};

	this.focusNodeById = function (node) {
		var scale = this._content.style.scale;
		var x = Math.max((node.tileX * this._tileSettings.tileWidth) * scale - this.style.width * 0.5, 0);
		var y = Math.max((node.tileY * this._tileSettings.tileHeight) * scale - this.style.height * 0.5, 0);

		this.scrollTo(x, y, 300);
	};
});