import menus.views.components.ButtonView as ButtonView;

import menus.constants.menuConstants as menuConstants;

menuConstants.BUTTONS.BLUE.DOWN = 'resources/images/editor/button1Down.png';
menuConstants.BUTTONS.BLUE.UP = 'resources/images/editor/button1Up.png';
menuConstants.BUTTONS.GREEN.DOWN = 'resources/images/editor/button2Down.png';
menuConstants.BUTTONS.GREEN.UP = 'resources/images/editor/button2Up.png';
menuConstants.BUTTONS.RED.DOWN = 'resources/images/editor/button3Down.png';
menuConstants.BUTTONS.RED.UP = 'resources/images/editor/button3Up.png';
menuConstants.DIALOG.CONTENT_BORDER = 'resources/images/editor/contentBorder.png';
menuConstants.DIALOG.CONTENT.BACKGROUND = 'resources/images/editor/item.png';
menuConstants.DIALOG.BACKGROUND = 'resources/images/editor/background.png';
menuConstants.TITLE.BACKGROUND = 'resources/images/editor/title.png';

exports = Class(ButtonView, function(supr) {
	this.init = function(opts) {
		opts = merge(
			opts,
			{
				on: {
					up: bind(this, 'emit', 'Up')
				}
			}
		);

		supr(this, 'init', [opts]);

		this._text.updateOpts({size: 26});
	};
});
