/* Create mesh's from coordinates.*/

function createMesh(x, y, z, pos_x, pos_y) {
	//for (var tile = 0; tile < tiles.length; tile++) {
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
			//geometry = addFaceVertexUvs(geometry);
			
			geometry = addBase(geometry);
			
			//var texture = THREE.ImageUtils.loadTexture( "./textures/"+ sessionStorage.name +".png" );
			//var material= new THREE.MeshBasicMaterial( { map: texture, wireframe: true } );
			//geometry.faces.push(new THREE.Face3( 86, 87, 88));
			var material= new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: true ,side:THREE.DoubleSide} );
			/*
			material.needsUpdate = true;
			geometry.buffersNeedUpdate = true;
			geometry.uvsNeedUpdate = true;
			*/
			console.log(geometry);
			mesh = new THREE.Mesh( geometry, material );
			mesh.rotation.x =  Math.PI / 180 * (-90);
			mesh.position.set(x, y, z);
			//mesh.name = latitude + "/" + longitude;
			scene.add(mesh);
		});
	//}
}

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


function studyRute(coord) {
	var tiles = new Array();
	//console.log("[PFC create_mesh.js]: Coordinates " + coord.length);
	var pos, compare_pos, positionLonLat;
	var north = 0, south = 0, east = 0, west = 0;
	positionLonLat = Cesium.Cartographic.fromDegrees(coord[0][1], coord[0][0]);
	pos = aCesiumTerrainProvider.tilingScheme.positionToTileXY(positionLonLat,12);
	tiles.push([pos.x, pos.y]);
	for(var i=1; i < coord.length; i++){
		positionLonLat = Cesium.Cartographic.fromDegrees(coord[i][1], coord[i][0]);
		compare_pos = aCesiumTerrainProvider.tilingScheme.positionToTileXY(positionLonLat,12);
		if (pos.x != compare_pos.x) {
			if (pos.x < compare_pos.x)
				tiles.push([pos.x + 1, pos.y]);
			else
				tiles.push([pos.x - 1, pos.y]);
			pos = compare_pos;
		} else if (pos.y != compare_pos.y) {
			if (pos.y < compare_pos.y)
				tiles.push([pos.x, pos.y + 1]);
			else
				tiles.push([pos.x, pos.y - 1]);
			pos = compare_pos;
		}
	}
	
	
	createMesh(0, 0, 0, tiles[0][0], tiles[0][1]);
	createMesh(0, 0, 33.2, tiles[0][0], tiles[0][1]+1);
	createMesh(33.2, 0, 0, tiles[0][0]+1, tiles[0][1]);
	createMesh(33.2, 0, 33.2, tiles[0][0]+1, tiles[0][1]+1);
	createMesh(-33.2, 0, 0, tiles[0][0]-1, tiles[0][1]);
	createMesh(-33.2, 0, 33.2, tiles[0][0]-1, tiles[0][1]+1);
	
	
}