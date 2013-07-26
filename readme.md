# Adventure map engine

The Adventure map class is used to display an overview of all levels in the game.
The levels are displayed as nodes on a tiled background, they can be connected with paths.

The map contains a model, your can [read about the model here](model.md).

## Configuration

The map can be configured with settings objects, there are settings for the background, 
the nodes, items and tags.

You can read more detailed information about the settings [here](../settings.md).

### Tags

A node can be tagged, it's possible to define a view for a tag, when a node has a
certain tag and the node is visible then the view will be instanciated and shown on
the node. This feature allows you to show custom items on the map.

### AdventureMap class

The `AdventureMap` class wraps the adventure map model and view class instances.

Parameters
 + `superview {View}` ---The view which contains the adventure map view.
 + `editMode {boolean}` ---If `true` then the node id will be displayed on the tiles.
 + `gridSettings {object}` ---General grid settings like width and height.
 + `tileSettings {object}` ---Settings for the tiles: images, tileWidth and tileHeight, etc.
 + `pathSettings {object}` ---Options for how the path will be displayed: dotted, dashed, ett. 
 + `nodeSettings {object}` ---Display options for the nodes on the map.
 + `inputLayerIndex {number}` ---Which layer will handle inputs.

~~~
import adventuremap.AdventureMap as AdventureMap;

this._adventureMap = new AdventureMap({
	superview: this,
	x: 0,
	y: 0,
	width: this.baseWidth,
	height: this.baseHeight,
	editMode: (inputLayerIndex === 0),
	gridSettings: gridSettings,
	tileSettings: tileSettings,
	pathSettings: pathSettings,
	nodeSettings: nodeSettings,
	inputLayerIndex: inputLayerIndex
});
~~~

#### Methods

__getModel()__

Get an instance of the adventure map model, the model contains the map data, nodes and their state.

Returns
 {AdventureMapModel} ---`AdventureMapModel` instance.

__getAdventureMapView()__

Get an instance of the adventure map view, the view is the visual representation the the map.

Returns
 {AdventureMapView} ---`AdventureMapView` instance.

__setScale(scale)__

Set the scale of the map, the scale can be in the range of 0.5..2.

Parameters
 + `scale {number}` ---The scale.

__load(data)__

Load a map, you can make a map with the map editor.

Parameters
 + `data {object}` ---The map data.

__refreshTile(tileX, tileY)__

Refresh a tile, all images and views will be updated.

Parameters
 + `tileX {number}` ---The x position on the grid, must be an integer.
 + `tileY {number}` ---The y position on the grid, must be an integer.

#### Events

__'ClickTag', callback(tag, tile)__

Called when a tag on a tile is clicked.

Parameters
 + `tag {string}` ---The tag which is clicked.
 + `tile {object}` ---The tile on which the tag is placed, contains a `tileX` and `tileY` property.

__'ClickNode', callback(tile)__

Called when a node -which represents a level- is clicked.

Parameters
 + `tile {object}` ---The tile on which the tag is placed, contains a `tileX` and `tileY` property.