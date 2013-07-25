import event.Emitter as Emitter;

import .models.AdventureMapModel as AdventureMapModel;

import .views.AdventureMapView as AdventureMapView;

exports = Class(Emitter, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		this._model = new AdventureMapModel({
			tileWidth: opts.gridSettings.tileWidth,
			tileHeight: opts.gridSettings.tileHeight,
			width: opts.gridSettings.width,
			height: opts.gridSettings.height,
			defaultTile: opts.gridSettings.defaultTile
		});

		this._scrollData = {
			x: 0,
			y: 0,
			scale: 1
		};

		this._gridSettings = opts.gridSettings;
		this._tileSettings = opts.tileSettings;
		this._pathSettings = opts.pathSettings;
		this._nodeSettings = opts.nodeSettings;

		opts.tileWidth = opts.gridSettings.tileWidth;
		opts.tileHeight = opts.gridSettings.tileHeight;
		opts.map = this._model.getMap();
		opts.scrollData = this._scrollData;
		this._adventureMapView = new AdventureMapView(opts);

		this._adventureMapView.on('Size', bind(this._model, 'onSize'));
		this._adventureMapView.on('ScrollLeft', bind(this._model, 'onScrollLeft'));
		this._adventureMapView.on('ScrollRight', bind(this._model, 'onScrollRight'));
		this._adventureMapView.on('ScrollUp', bind(this._model, 'onScrollUp'));
		this._adventureMapView.on('ScrollDown', bind(this._model, 'onScrollDown'));
		this._adventureMapView.on('ClickTag', bind(this, 'onClickTag'));
		this._adventureMapView.on('ClickNode', bind(this, 'onClickNode'));

		this._model.on('NeedsPopulate', bind(this._adventureMapView, 'needsPopulate'));
		this._model.on('Update', bind(this._adventureMapView, 'onUpdate'));
		this._model.on('UpdateTile', bind(this._adventureMapView, 'refreshTile'));

		this._adventureMapView.tick = bind(this, function(dt) {
			this._adventureMapView.style.visible && this._model.tick(dt);
		});
	};

	this.getModel = function () {
		return this._model;
	};

	this.getAdventureMapView = function () {
		return this._adventureMapView;
	};

	this.getAdventureMapLayers = function () {
		return this._adventureMapView.getAdventureMapLayers();
	};

	this.getScrollData = function () {
		return this._scrollData;
	};

	this.setScale = function (scale) {
		if (scale < 0.5) {
			scale = 0.5;
		} else if (scale > 2) {
			scale = 2;
		}
		this._adventureMapView.setScale(scale);

		return scale;
	};

	this.load = function (data) {
		this._model.load(data);

		var modelData = this._model.getData();
		this._adventureMapView.setTileWidth(modelData.tileWidth);
		this._adventureMapView.setTileHeight(modelData.tileHeight);
		this._adventureMapView.onUpdate(modelData);
	};

	this.refreshTile = function (tileX, tileY) {
		this._adventureMapView.refreshTile(tileX, tileY);
	};

	this.onClickTag = function (tag, tile) {
		this.emit('ClickTag', tag, tile);
	};

	this.onClickNode = function (tile) {
		this.emit('ClickNode', tile);
	};
});