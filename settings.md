Back to [adventure map documentation](../readme.md).
# Adventure map settings

## Grid settings

The grid settings contain the width and height of the grid and the tags.
This list of tags is only used in the editor to display a list of possible tags to
attach to the nodes.

### Data structure

 + `width {number}` ---The width of the grid.
 + `height {number}` ---The height of the grid.
 + `tags {array}` ---A list of tag strings.

### Grid settings example
~~~
var gridSettings = {
		width: 20,
		height: 20,
		tags: [
			'Player',
			'Label'
		]
	};
~~~

## Tile settings

The tile settings contain information about the size of the tiles an the images,
there are two types of images, the background of the tile and the doodads.
Every tile must have a background but the doodad is optional.
This data structure contains the list of possible images not the actual images
on the map.

### Data structure

 + `tiles {array}` ---A list of filename strings.
 + `doodads {array}` ---A list of doodad items with the following structure:
  + `image {string}` ---The image path and filename, used in the editor of if it's not an animation.
  + `url {string}` ---The path and name of the animation.
  + `frameRate {number}` ---The frame rate at which the animation is played.
  + `width {number}` ---The width of the image or animation.
  + `height {number}` ---The height of the image or animation.
 + `tileWidth {number}` ---The width of the tiles.
 + `tileHeight {number}` ---The height of the tiles.
 + `defaultTile {number}` ---The default tile with which the map is filled when cleared from the editor, refers to an index in the `tiles` array.

### Tile settings example
~~~
var tileSettings = {
		tiles: [
			'resources/images/image.png'
		],
		doodads: [
			{
				image: 'resources/images/bunny/bun_stand_0001.png',
				url: 'resources/images/bunny/bun',
				animation: 'stand',
				frameRate: 5,
				width: 240,
				height: 520
			}
		],
		tileWidth: 256,
		tileHeight: 256,
		defaultTile: 3
	};
~~~

### Node settings

The node settings control how the nodes -which represent levels- are actually displayed.
There's a list of images for the node and there's a `itemCtors` object, each key can match
a tag and the value is a view constructor. When the node has the tag the an instance of the
view is created and displayed at the node.

### Data structure

 + `nodes {array}` ---A list of objects with node image information with the following structure:
  + `image {string}` ---The path and filename of the image.
  + `width {number}` ---The width of the image.
  + `height {number}` ---The height of the image.
  + `characterSettings: {object}` ---Optional, used to display the id.
   + `height {number}` ---The height
   + `data {object}` ---CharacterSettings for the [`scoreView`](http://doc.gameclosure.com/api/ui-text.html#class-ui.scoreview) to display the level id.
 + `itemCtors {object}` ---A list of view constructors, the keys can match tags.

### Node settings example
~~~
var nodeSettings = {
		nodes: [
			{
				image: 'resources/images/node/activeRing.png',
				width: 168,
				height: 145,
				characterSettings: {
					height: 60,
					data: characterSettings.numbers
				}
			},
			{
				image: 'resources/images/node/blue.png',
				width: 94,
				height: 89,
				characterSettings: {
					height: 60,
					data: characterSettings.numbers
				}
			},
			{
				image: 'resources/images/node/dark.png',
				width: 94,
				height: 89,
				characterSettings: {
					height: 60,
					data: characterSettings.numbers
				}
			}
		],
		itemCtors: {
			Label: LabelView,
			Player: PlayerView
		}
	};
~~~

### Path settings

The path settings define the way the paths are displayed, there are three different
types of paths: dashed, dotted or line.

### Data structure

 + `dotDistance {number}` ---The distance between the centers of the dots, only applies to the paths with the type 'dot'.
 + `dashDistance {number}` ---The distance between the centers of the dashes, only applies to the paths with the type 'dash'.
 + `paths {array}` ---A list of possible paths with the following structure:
  + `type {string}` ---The type of path, possible values are: 'dash', 'dot' or 'line'.
  + `image {string}` ---The path and filename of the node.
  + `width {number}` ---The width of the node.
  + `height {number}` ---The height of the node.

### Path settings example
~~~
var pathSettings = {
		dotDistance: 60,
		dashDistance: 60,
		paths: [
			{type: 'dash', image: 'resources/images/path/dash.png', width: 51, height: 31},
			{type: 'dot', image: 'resources/images/path/dot.png', width: 31, height: 31},
			{type: 'line', image: 'resources/images/path/line.png', height: 31}
		]
	};
~~~
