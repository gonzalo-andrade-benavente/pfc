	var latitude = -2.002, longitude = 43.314, tile;
	var meshPosX = meshPosY = meshPosZ = 0;
	//camera.position.x = 50;
	//camera.position.y = 20;
	var aCesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
		url : '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
	});
	
	function loadedTerrainProvider(){
		var positionLonLat = Cesium.Cartographic.fromDegrees(longitude, latitude);
		positionTileXY = aCesiumTerrainProvider.tilingScheme.positionToTileXY(positionLonLat,12);		
		tile = getTile(positionTileXY);
		aCesiumTerrainProvider.requestTileGeometry(positionTileXY.x,positionTileXY.y,12,true).then(function(data){
			mesh1(data);
		});
		longitude = longitude + tile.distanceCoordinate;
	}
	
	function getTile(positionTileXY){
		var myTile, sw, se, nw, ne;;
		var rectangleTileXY = aCesiumTerrainProvider.tilingScheme.tileXYToRectangle(positionTileXY.x, positionTileXY.y, 12);
		sw = new Coordinate(radianToDegrees(Cesium.Rectangle.southwest(rectangleTileXY).latitude),radianToDegrees(Cesium.Rectangle.southwest(rectangleTileXY).longitude));
		se = new Coordinate(radianToDegrees(Cesium.Rectangle.southeast(rectangleTileXY).latitude),radianToDegrees(Cesium.Rectangle.southeast(rectangleTileXY).longitude));
		nw = new Coordinate(radianToDegrees(Cesium.Rectangle.northwest(rectangleTileXY).latitude),radianToDegrees(Cesium.Rectangle.northwest(rectangleTileXY).longitude));
		ne = new Coordinate(radianToDegrees(Cesium.Rectangle.northeast(rectangleTileXY).latitude),radianToDegrees(Cesium.Rectangle.northeast(rectangleTileXY).longitude));
		myTile = new Tile(ne, se, nw, sw);
		return myTile;
	}
	/*
		CLASE TILE
	*/
	function Tile(northeast, southeast, northwest, southwest){
		this.northeast = northeast;
		this.southeast = southeast;
		this.northwest = northwest;
		this.southwest = southwest;
		this.distanceKm = ((northeast.latitude - southeast.latitude)/0.01)*1.1132;
		this.distanceCoordinate = northeast.latitude - southeast.latitude;
	}
	/*
		CLASE COORDENADA
	*/
	function Coordinate(latitude, longitude){
		this.latitude = latitude;
		this.longitude = longitude;
	}
	/*
		FUNCIÓN TRANSFORMA RADIANES A GRADOS
	*/
	function radianToDegrees(radians){
		return (radians * 180)/ Math.PI;	
	}
	/*
		FUNCIÓN PARA OBTENER LOS DATOS DE CESIUM
	*/
	function requestTilesWhenReady() {
		if (aCesiumTerrainProvider.ready) {
			console.log("Terrain Provider ready");
			loadedTerrainProvider();
		} else {
			console.log("Waiting a Terrain Provider is ready");
			setTimeout(requestTilesWhenReady, 10);
		}
	}
	requestTilesWhenReady();
	
	//Puede ser que la latitud y longitud estén a réves.
	//var latitude = -1.643084, longitude = 42.819939;
	//var lat = -1.9988972, lon = 43.3215343; //Isla de santa clara.
	/*
		FUNCIÓN CREACIÓN DE MESH VERTICES + DATOS
		######## ERROR #####
	*/
	function mesh1(cesium){
		var mesh;
		var verticesQuantized, facesQuantized, geometry, mesh;
		verticesQuantized = cesium._quantizedVertices;
		var x = cesium._uValues, 
			y = cesium._vValues,
			heights = cesium._heightValues;
		facesQuantized = cesium._indices;
		var geometry = new THREE.Geometry();
		for(var i=0; i < heights.length; i++){
			geometry.vertices.push( new THREE.Vector3(Math.round(x[i]/1000),Math.round(y[i]/1000),Math.round(heights[i]/1000)));
		}
		for(var i=0; i < facesQuantized.length; i=i+3){
			geometry.faces.push(new THREE.Face3(facesQuantized[i], facesQuantized[i+1], facesQuantized[i+2]));
			//console.log(facesQuantized[i] +","+facesQuantized[i+1]+","+ facesQuantized[i+2]);
		}
		//geometry.computeBoundingSphere();
		mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial( {wireframe : true}) );
		//mesh.rotation.y = -0.5;
		//mesh.rotation.x = -1.3;
		//mesh.position.set(meshPosX, -50, 0);
		mesh.position.set(meshPosX, meshPosY, meshPosZ);
		//mesh.computeBoundingBox();
		//console.log(mesh.boundingBox);
		scene.add(mesh);
	}