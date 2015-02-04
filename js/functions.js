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
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
	Create a mesh in position (x,y,z) from a tile.
*/
function createMesh(x, y, z, pos_x, pos_y) {
		aCesiumTerrainProvider.requestTileGeometry(pos_x, pos_y, 12, true).then(function(data){
			var mesh, verticesQuantized, facesQuantized, geometry;
			verticesQuantized = data._quantizedVertices;
			var xx = data._uValues, 
				yy = data._vValues,
				heights = data._heightValues;
			facesQuantized = data._indices;
			var geometry = new THREE.Geometry();
			for(var i=0; i < heights.length; i++){
				geometry.vertices.push( new THREE.Vector3(Math.round(xx[i]/1000),Math.round(yy[i]/1000),Math.round(heights[i]/1000)));
			}
			for(var i=0; i < facesQuantized.length; i=i+3){
				geometry.faces.push(new THREE.Face3(facesQuantized[i], facesQuantized[i+1], facesQuantized[i+2]));
			}
			// Texture only in surface.
			geometry = addFaceVertexUvs(geometry);
			geometry = addBase(geometry);
			//var texture = THREE.ImageUtils.loadTexture( "./textures/"+ sessionStorage.name +".png" );
			//var material= new THREE.MeshBasicMaterial( { map: texture, wireframe: true, side:THREE.DoubleSide } );
			var material= new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: true ,side:THREE.DoubleSide} );
			/*
			material.needsUpdate = true;
			geometry.buffersNeedUpdate = true;
			geometry.uvsNeedUpdate = true;
			*/
			mesh = new THREE.Mesh( geometry, material );
			mesh.rotation.x =  Math.PI / 180 * (-90);
			mesh.position.set(x, y, z);
			scene.add(mesh);
		});
}
/*
	Function to addVertexUVs to apply texture in mesh.
*/
function addFaceVertexUvs(geometry) {
	geometry.computeBoundingBox();
	var max = geometry.boundingBox.max,
		min = geometry.boundingBox.min;
	var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
	var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
	geometry.faceVertexUvs[0] = [];
	for (i = 0; i < geometry.faces.length ; i++) {
		var v1 = geometry.vertices[geometry.faces[i].a], v2 = geometry.vertices[geometry.faces[i].b], v3 = geometry.vertices[geometry.faces[i].c];
		geometry.faceVertexUvs[0].push(
		[
			new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
			new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
			new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
		]);

	}
	geometry.uvsNeedUpdate = true;
	return geometry;
}
/*
	Function Sort Vector to Base.
*/
function sortVector(geometry, vertices, coordinate) {
	var index_aux, control = true, i;
	if(coordinate == "y") {
		while(control) {
			control = false;
			for(var i=0; i < vertices.length-1; i++) {
				if (geometry.vertices[vertices[i]].y > geometry.vertices[vertices[i+1]].y) {
					index_aux = vertices[i+1];
					vertices[i+1] = vertices[i];
					vertices[i] = index_aux;
					control = true;
				}
			}
		}		
	} else if(coordinate == "x") {
		while(control) {
			control = false;
			for(var i=0; i < vertices.length-1; i++) {
				if (geometry.vertices[vertices[i]].x > geometry.vertices[vertices[i+1]].x) {
					index_aux = vertices[i+1];
					vertices[i+1] = vertices[i];
					vertices[i] = index_aux;
					control = true;
				}
			}
		}
	}
	return vertices;
}
/*
	Draw faces relieve.
*/
function addRelieve(geometry, vertices, displace) {
	for(var i = 0; i < vertices.length-1; i++){
		geometry.faces.push(new THREE.Face3(vertices[i], vertices[i]+displace, vertices[i+1]+displace));
		geometry.faces.push(new THREE.Face3(vertices[i+1], vertices[i], vertices[i+1]+displace));
	}
}
/*
	Add base to geometry.
*/
function addBase(geometry){
	/*
		Add to geometry her base.
	*/
	//In geometry2 have the old data of geometry.
	var geometry2 = geometry.clone();
	for(var i = 0; i < geometry2.vertices.length; i++) {
		geometry.vertices.push(new THREE.Vector3(geometry2.vertices[i].x, geometry2.vertices[i].y, 0));
	}
	var southVertices = new Array(), northVertices = new Array(), eastVertices = new Array(), westVertices = new Array(), i;
	//Save the index of the limits(west, east, north, south).
	geometry2.computeBoundingBox();
	// Vertices of mesh.
	for(i = 0; i < geometry2.vertices.length; i++) {
		if (geometry.vertices[i].y === geometry2.boundingBox.min.y)
			southVertices.push(i);			
		else if (geometry.vertices[i].x === geometry2.boundingBox.min.x)
			westVertices.push(i);
		else if (geometry.vertices[i].x === geometry2.boundingBox.max.x)
			eastVertices.push(i);	
		else if (geometry.vertices[i].y === geometry2.boundingBox.max.y)
			northVertices.push(i);	
	}
	//displace, value to fin her vector.-alue in the base.
	var displace = geometry2.vertices.length;
	//Sort vertices to draw faces correctly.
	southVertices = sortVector(geometry2, southVertices, "x");
	westVertices = sortVector(geometry2, westVertices, "y");
	eastVertices = sortVector(geometry2, eastVertices, "y");
	northVertices = sortVector(geometry2, northVertices, "x");
	//Add the faces.
	addRelieve(geometry, southVertices, displace);
	addRelieve(geometry, westVertices, displace);
	addRelieve(geometry, eastVertices, displace);
	addRelieve(geometry, northVertices, displace);
	/*
		West and east miss a point and north two point.
	*/
	//West-south
	geometry.faces.push(new THREE.Face3(westVertices[0], westVertices[0]+displace, southVertices[0]+displace));
	geometry.faces.push(new THREE.Face3(southVertices[0], westVertices[0], southVertices[0]+displace));
	//East-south
	geometry.faces.push(new THREE.Face3(eastVertices[0], eastVertices[0]+displace, southVertices[southVertices.length-1]+displace));
	geometry.faces.push(new THREE.Face3(southVertices[southVertices.length-1], eastVertices[0], southVertices[southVertices.length-1]+displace));
	//North-West 
	geometry.faces.push(new THREE.Face3(westVertices[westVertices.length-1], westVertices[westVertices.length-1]+displace, northVertices[0]+displace));
	geometry.faces.push(new THREE.Face3(northVertices[0], westVertices[westVertices.length-1], northVertices[0]+displace));
	//North-East
	geometry.faces.push(new THREE.Face3(eastVertices[eastVertices.length-1], eastVertices[eastVertices.length-1]+displace, northVertices[northVertices.length-1]+displace));
	geometry.faces.push(new THREE.Face3(northVertices[northVertices.length-1], eastVertices[eastVertices.length-1], northVertices[northVertices.length-1]+displace));
	/*add Base goemtry*/
	geometry.faces.push(new THREE.Face3(southVertices[0]+displace, eastVertices[eastVertices.length-1]+displace, southVertices[southVertices.length-1]+displace));
	geometry.faces.push(new THREE.Face3(southVertices[0]+displace, westVertices[westVertices.length-1]+displace, eastVertices[eastVertices.length-1]+displace));
	
	return geometry;
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