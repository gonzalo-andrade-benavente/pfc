/* Create mesh's from coordinates.*/

function createMesh(coord) {
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
	
	for (var tile = 0; tile < tiles.length; tile++) {
		aCesiumTerrainProvider.requestTileGeometry(tiles[tile][0], tiles[tile][1], 12, true).then(function(data){
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
			//geometry = addFaceVertexUvs(geometry);
			//var texture = THREE.ImageUtils.loadTexture( "./textures/"+ sessionStorage.name +".png" );
			//var material= new THREE.MeshBasicMaterial( { map: texture, wireframe: true } );
			//geometry.faces.push(new THREE.Face3( 86, 87, 88));
			//var material= new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: true } );
			/*
			material.needsUpdate = true;
			geometry.buffersNeedUpdate = true;
			geometry.uvsNeedUpdate = true;
			*/
			
			//mesh = new THREE.Mesh( geometry, material );
			//mesh.rotation.x =  Math.PI / 180 * (-90);
			//mesh.position.set(x, y, z);
			//mesh.name = latitude + "/" + longitude;
			//scene.add(mesh);
		});
	}
}