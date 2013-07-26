Back to [adventure map documentation](../readme.md).
### AdventureModel class

The `AdventureModel` class is constructed by the `AdventureMap`, you don't have
to instanciate it yourself. 

There are a number of public functions which are mainly for internal use,
the functions listed here are useful to extend the functionallity of the map.

#### Methods

__getGrid(tileX, tileY)__

If the `tileX` and `tileY` values are undefined then this function returns the
grid else it returns a tile on the grid.

Returns
 {array|object} ---The entire grid or a tile.

__getNodesByTag()__

Get an object, each key has a list of one or more nodes.
You can use this function to divide you map into zones.

Returns
 {object} ---Each key has a list of one or more nodes.

__getNodesById()__

Get all nodes indexed by id.

Returns
 {object} ---A list of nodes.

__getMaxNodeId()__

Get the maximum node id, only numeric ids are checked.
You can use the minimum and maximum values to iterate over the nodes.

Returns
 {number} ---The highest numeric id.

__getMinNodeId()__

Get the minimum node id, only numeric ids are checked.
You can use the minimum and maximum values to iterate over the nodes.

Returns
 {number} ---The lowest numeric id.

__addTagById(id, tag)__

Add a tag to the node with the given id.
When the tag is added and the node is visible then the update function
is called, if there's a view attached to the tag then that view shows up
immidiately.

Parameters
 + `id {string}` ---The id of the node.
 + `tag {string}` ---The tag to add to the node.

See: grid settings.

__removeTagById(id, tag)__

Remove a tag from the node with the given id.
When the tag is remove and the node is visible then the update function
is called, if there's a view attached to the tag then that view is hidden
immidiately.

Parameters
 + `id {string}` ---The id of the node.
 + `tag {string}` ---The tag to add to the node.

See: grid settings.