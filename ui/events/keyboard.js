"use strict";

(function() {

var
	oldTool,
	shortcuts = {
		66: "paint",  // B
		32: "hand",   // Space
		72: "hand",   // H
		68: "delete", // D
		77: "mute",   // M
		83: "slip",   // S
		67: "cut"     // C
	}
;

ui.jqBody
	.keydown( function( e ) {
		// lg( "keyCode: " + e.keyCode );
		var tool = shortcuts[ e.keyCode ];
		if ( tool && tool !== ui.currentTool ) {
			if ( e.keyCode === 32 ) {
				oldTool = ui.currentTool;
			}
			ui.selectTool( tool );
		}
	})
	.keyup( function( e ) {
		if ( oldTool && e.keyCode === 32 ) {
			ui.selectTool( oldTool );
			oldTool = null;
		}
	})
;

})();
