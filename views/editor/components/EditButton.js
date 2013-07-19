import menus.views.components.ButtonView as ButtonView;

import menus.constants.menuConstants as menuConstants;

menuConstants.BUTTONS.BLUE.DOWN = 'resources/images/editor/button1Down.png';
menuConstants.BUTTONS.BLUE.UP = 'resources/images/editor/button1Up.png';
menuConstants.BUTTONS.GREEN.DOWN = 'resources/images/editor/button2Down.png';
menuConstants.BUTTONS.GREEN.UP = 'resources/images/editor/button2Up.png';
menuConstants.BUTTONS.RED.DOWN = 'resources/images/editor/button3Down.png';
menuConstants.BUTTONS.RED.UP = 'resources/images/editor/button3Up.png';
menuConstants.DIALOG.CONTENT_BORDER = 'resources/images/editor/contentBorder.png';

exports = Class(ButtonView, function(supr) {
	this.init = function(opts) {
		opts = merge(
			opts,
			{
				on: {
					up: bind(this, 'emit', 'Up')
				},
				text: {
					fontFamily: 'BPReplay',
					size: 26,
					color: 'rgb(255, 255, 255)',
					strokeColor: 'rgb(15, 111, 55)',
					strokeWidth: 4,
					autoSize: false,
					autoFontSize: true,
					wrap: false
				}
			}
		);

		supr(this, "init", [opts]);
	};
});
