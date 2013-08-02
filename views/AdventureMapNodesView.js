import ui.View as View;
import ui.resource.Image as Image;

import .tiles.NodeView as NodeView;
import .AdventureMapLayerView;

exports = Class(AdventureMapLayerView, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts])

		this._nodeItemViews = [];
	};

	this.addNodeItemView = function(nodeItemView) {
		this._nodeItemViews.push(nodeItemView);
	};

	this.populateView = function (data) {
		var nodeItemViews = this._nodeItemViews;
		var i = nodeItemViews.length;

		while (i) {
			nodeItemViews[--i].style.visible = false;
		}

		var grid = data.grid;
		var width = this._gridSettings.width;
		var height = this._gridSettings.height;
		var tileWidth = this._tileSettings.tileWidth;
		var tileHeight = this._tileSettings.tileHeight

		for (var y = 0; y < height; y++) {
			var line = [];
			for (var x = 0; x < width; x++) {
				var view = null;
				var tile = grid[y][x];
				if (this._editMode || tile.node) {
					view = new NodeView({
						superview: this,
						x: x * tileWidth,
						y: y * tileHeight,
						width: tileWidth,
						height: tileHeight,
						adventureMap: this._adventureMap,
						tileSettings: this._tileSettings,
						nodeSettings: this._nodeSettings,
						adventureMapView: this._adventureMapView
					});

					view.update(grid, x, y);
				}
				line[x] = view;
			}

			this._views.push(line);
		}

		this._grid = grid;
		this._needsPopulate = false;
	};

	this.onUpdate = function (data) {
		this._needsPopulate && this.populateView(data);
	};

	this.refreshTile = function (tileX, tileY) {
		this._views[tileY][tileX].update(this._grid, tileX, tileY);
	};
});