"use strict";

ui.mainGrid = {
	init() {
		var grid = new gsuiGridSamples(),
			elGridCnt = grid.rootElement.querySelector( ".gsuigs-grid .gsuigs-content" );

		ui.mainGridSamples = grid;
		ui.mainGrid.elGridCnt = elGridCnt;
		ui.mainGrid.blocks = {};
		grid.loadTrackList();
		grid.offset( 0, 40 );
		grid.onchange = ui.mainGrid._onchangeGrid;
		grid.onchangeCurrentTime = gs.controls.currentTime.bind( null, "main" );
		grid.onchangeLoop = gs.controls.loop.bind( null, "main" );
		grid.rootElement.onfocus = gs.controls.askFocusOn.bind( null, "main" );
		grid.fnSampleCreate = function( id, uiBlock ) {
			var cmp = gs.currCmp,
				pat = cmp.patterns[ uiBlock.data.pattern ];

			ui.mainGrid.blocks[ id ] = uiBlock;
			uiBlock.name( pat.name );
			uiBlock.updateData( ui.keysToRects( cmp.keys[ pat.keys ] ) );
			uiBlock.rootElement.ondblclick = gs.openPattern.bind( null, uiBlock.data.pattern );
		};
		grid.fnSampleUpdate = function( id, uiBlock ) {
			var cmp = gs.currCmp,
				blc = cmp.blocks[ id ],
				keys = cmp.keys[ cmp.patterns[ blc.pattern ].keys ];

			uiBlock.updateData( ui.keysToRects( keys ), blc.offset, blc.duration );
		};
		grid.fnSampleDelete = function( id, uiBlock ) {
			delete ui.mainGrid.blocks[ id ];
		};
		dom.mainGridWrap.append( grid.rootElement );
		elGridCnt.ondrop = ui.mainGrid._ondrop;
		elGridCnt.ondragenter = function( e ) {
			e.dataTransfer.dropEffect = "copy";
		};
		grid.resized();
	},
	empty() {
		ui.mainGridSamples.offset( 0, 40 );
		ui.mainGridSamples.contentY( 0 );
		ui.mainGridSamples.empty();
		ui.mainGrid.blocks = {};
	},
	change( data ) {
		if ( data.tracks ) { ui.mainGridSamples.change( data ); }
		if ( data.blocks ) { ui.mainGridSamples.change( data.blocks ); }
	},
	getPatternBlocks( patId ) {
		var id, res = [], blocks = ui.mainGrid.blocks;

		for ( id in blocks ) {
			if ( blocks[ id ].data.pattern === patId ) {
				res.push( blocks[ id ] );
			}
		}
		return res;
	},

	// events:
	_onchangeGrid( obj ) {
		gs.undoredo.change( obj.tracks ? obj : { blocks: obj } );
	},
	_ondrop( e ) {
		var row = e.target,
			grid = ui.mainGridSamples,
			patId = e.dataTransfer.getData( "text" ),
			gridBCR = grid.rootElement.getBoundingClientRect(),
			pageX = e.pageX - gridBCR.left - grid._panelWidth;

		if ( patId ) {
			e.stopPropagation();
			while ( !row.classList.contains( "gsui-row" ) ) {
				row = row.parentNode;
			}
			gs.dropPattern(
				e.dataTransfer.getData( "text" ),
				row.dataset.track,
				grid.uiTimeLine.beatFloor( pageX / grid._pxPerBeat + grid._timeOffset ) );
			return false;
		}
	}
};
