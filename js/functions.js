/* Functions */
/*
	Function returns all mesh to the rute gpx.
*/
function checkTile(coord) {
	//var array_coordinate = new Array();
	var info_tiles = new Array();
	var compare_pos, positionLonLat, initial_pos;
	var north = 0, south = 0, east = 0, west = 0;
	//array_coordinate.push(new Coordinate(coord[0][0], coord[0][1]));
	positionLonLat = Cesium.Cartographic.fromDegrees(coord[0][1], coord[0][0]);
	positionTileXY = aCesiumTerrainProvider.tilingScheme.positionToTileXY(positionLonLat,12);
	var tile = getTile(positionTileXY);
	info_tiles.push(new InfoTile(positionTileXY.x, positionTileXY.y, "c",tile.northwest.latitude, tile.northwest.longitude, tile.southeast.latitude, tile.southeast.longitude));
	initial_pos = positionTileXY;
	for(var i=1; i < coord.length; i++){
		positionLonLat = Cesium.Cartographic.fromDegrees(coord[i][1], coord[i][0]);
		compare_pos = aCesiumTerrainProvider.tilingScheme.positionToTileXY(positionLonLat,12);
		if (positionTileXY.x != compare_pos.x) {
			//array_coordinate.push(new Coordinate(coord[i][0], coord[i][1]));
			//console.log("[PFC]: Coordinate change:"+i);
			if (positionTileXY.x < compare_pos.x)
				east = east + 1;
			else
				west = west + 1;
			positionTileXY = compare_pos;
		} else if (positionTileXY.y != compare_pos.y) {
			//array_coordinate.push(new Coordinate(coord[i][0], coord[i][1]));
			//console.log("Coordinate change:"+i);
			if (positionTileXY.y < compare_pos.y)
				south = south + 1;
			else
				north = north + 1;
			positionTileXY = compare_pos;
		}
	}
	
	/*
		Check the variable and draw more rectangle.
		Pass info_tiles for reference.
	*/
	moreMesh(west, initial_pos, "w", info_tiles);
	moreMesh(east, initial_pos, "e", info_tiles);
	moreMesh(north, initial_pos, "n", info_tiles);
	moreMesh(south, initial_pos, "s", info_tiles);
	return info_tiles;
}
/*
	Function to find all tiles to create all mesh
	of the rute.
*/	
function moreMesh(contador, tile, cardinalidad, info_tiles) {
	var new_tile, bounds, map_bounds;
	if(contador != 0) {
		//console.log("[PFC]: Initial Tile: X:" + tile.x + " Y:" + tile.y);
		switch(cardinalidad) {
			case "w":	
						//console.log("[PFC]: West");
						while(contador != 0) {
							tile.x--;
							new_tile = getTile(tile);
							bounds = [[new_tile.northwest.latitude, new_tile.northwest.longitude], [new_tile.southeast.latitude, new_tile.southeast.longitude]];
							//L.rectangle(bounds, {color: "#191414", weight: 2, fillOpacity:0 }).addTo(map);
							info_tiles.push(new InfoTile(tile.x, tile.y, "w", new_tile.northwest.latitude, new_tile.northwest.longitude, new_tile.southeast.latitude, new_tile.southeast.longitude));
							contador--;
						}
						break;
			case "e":
						//console.log("[PFC]: East");
						while(contador != 0) {
							tile.x++;
							new_tile = getTile(tile);
							bounds = [[new_tile.northwest.latitude, new_tile.northwest.longitude], [new_tile.southeast.latitude, new_tile.southeast.longitude]];
							//L.rectangle(bounds, {color: "#191414", weight: 2, fillOpacity:0 }).addTo(map);
							info_tiles.push(new InfoTile(tile.x, tile.y, "e", new_tile.northwest.latitude, new_tile.northwest.longitude, new_tile.southeast.latitude, new_tile.southeast.longitude));
							contador--;
						}
						break;
			case "n":
						//console.log("[PFC]: North");
						while(contador != 0) {
							tile.y--;
							new_tile = getTile(tile);
							bounds = [[new_tile.northwest.latitude, new_tile.northwest.longitude], [new_tile.southeast.latitude, new_tile.southeast.longitude]];
							//L.rectangle(bounds, {color: "#191414", weight: 2, fillOpacity:0 }).addTo(map);
							info_tiles.push(new InfoTile(tile.x, tile.y, "n", new_tile.northwest.latitude, new_tile.northwest.longitude, new_tile.southeast.latitude, new_tile.southeast.longitude));
							contador--;
						}
						break;
			case "s":
						//console.log("[PFC]: South");
						while(contador != 0) {
							tile.y++;
							new_tile = getTile(tile);
							bounds = [[new_tile.northwest.latitude, new_tile.northwest.longitude], [new_tile.southeast.latitude, new_tile.southeast.longitude]];
							//L.rectangle(bounds, {color: "#191414", weight: 2, fillOpacity:0 }).addTo(map);
							info_tiles.push(new InfoTile(tile.x, tile.y, "s", new_tile.northwest.latitude, new_tile.northwest.longitude, new_tile.southeast.latitude, new_tile.southeast.longitude));
							contador--;
							final_bounds = bounds;
						}
						break;
		}
	}
}

/*
	FUNCTION radians to degrees.
*/
function radianToDegrees(radians) {
	return (radians * 180)/ Math.PI;	
}
/*
	FUNCTION create a Tile Cesium Rectangle with vertices in degrees[latitude and longitude].
	sw: SouthWest, se:SouthEast, nw: NorthWest, ne:NorthEast. 
*/
function getTile(positionTileXY) {
	var myTile, sw, se, nw, ne;;
	var rectangleTileXY = aCesiumTerrainProvider.tilingScheme.tileXYToRectangle(positionTileXY.x, positionTileXY.y, 12);
	sw = new Coordinate(radianToDegrees(Cesium.Rectangle.southwest(rectangleTileXY).latitude),radianToDegrees(Cesium.Rectangle.southwest(rectangleTileXY).longitude));
	se = new Coordinate(radianToDegrees(Cesium.Rectangle.southeast(rectangleTileXY).latitude),radianToDegrees(Cesium.Rectangle.southeast(rectangleTileXY).longitude));
	nw = new Coordinate(radianToDegrees(Cesium.Rectangle.northwest(rectangleTileXY).latitude),radianToDegrees(Cesium.Rectangle.northwest(rectangleTileXY).longitude));
	ne = new Coordinate(radianToDegrees(Cesium.Rectangle.northeast(rectangleTileXY).latitude),radianToDegrees(Cesium.Rectangle.northeast(rectangleTileXY).longitude));
	myTile = new Tile(ne, se, nw, sw);
	return myTile;
}