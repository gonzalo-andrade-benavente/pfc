	var latitude = 43.314, longitude = -2.002, tile, tiles=[];
	var latitudeOrigin = 43.314, longitudeOrigin = -2.002; 
	//camera.position.x = 50;
	//camera.position.y = 20;
	var aCesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
		url : '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
	});
	
	function loadedTerrainProvider(x, y, z){
		var positionLonLat = Cesium.Cartographic.fromDegrees(longitude, latitude);
		positionTileXY = aCesiumTerrainProvider.tilingScheme.positionToTileXY(positionLonLat,12);
		//console.log(positionTileXY);
		tile = getTile(positionTileXY);
		aCesiumTerrainProvider.requestTileGeometry(positionTileXY.x,positionTileXY.y,12,true).then(function(data){
			mesh1(data, x, y, z);
		});
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
			console.log("[PFC]:Terrain Provider ready");
			//loadedTerrainProvider(0, 0, 0);
		} else {
			console.log("[PFC]:Waiting a Terrain Provider is ready");
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
	function mesh1(cesium, x, y, z){
		var mesh;
		var verticesQuantized, facesQuantized, geometry, mesh;
		verticesQuantized = cesium._quantizedVertices;
		var xx = cesium._uValues, 
			yy = cesium._vValues,
			heights = cesium._heightValues;
		facesQuantized = cesium._indices;
		var geometry = new THREE.Geometry();
		for(var i=0; i < heights.length; i++){
			geometry.vertices.push( new THREE.Vector3(Math.round(xx[i]/1000),Math.round(yy[i]/1000),Math.round(heights[i]/1000)));
		}
		for(var i=0; i < facesQuantized.length; i=i+3){
			geometry.faces.push(new THREE.Face3(facesQuantized[i], facesQuantized[i+1], facesQuantized[i+2]));
			//console.log(facesQuantized[i] +","+facesQuantized[i+1]+","+ facesQuantized[i+2]);
		}
		var material= new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: true } );
		mesh = new THREE.Mesh( geometry, material );
		mesh.rotation.x =  Math.PI / 180 * (-90);
		mesh.position.set(x, y, z);
		tiles.push(mesh);
		//scene.add(mesh);
	}
	/*
		FUNCIÓN CREA MAPA 4 REGIONES.
	*/
	function createMap(action) {
		tileToMesh(0, 0, 0, latitude, longitude);
		tileToMesh(32, 0, 0, latitude, longitudeOrigin + tile.distanceCoordinate);
		tileToMesh(0, 0, 32, latitudeOrigin - tile.distanceCoordinate, longitudeOrigin);
		//tileToMesh(-32, 0, 32, latitudeOrigin - tile.distanceCoordinate, longitudeOrigin - tile.distanceCoordinate);
		tileToMesh(32, 0, 32, latitudeOrigin - tile.distanceCoordinate, longitudeOrigin + tile.distanceCoordinate);
		console.log("[PFC]:Mesh creados correctamente.");
	}
	
	function tileToMesh(x, y, z, lat, lon){
		latitude = lat;
		longitude = lon;
		loadedTerrainProvider(x, y, z);
	}
	
	function merge(){
		console.log(tiles.length);
	
	
	}
	
	/*
		- Tener coordenadas de latitud y longitud, tener en cuenta la ruta gpx.
		- Obtener los tiles necesario para la ruta en CesiumJS.
		- Crear cada tile y unirlos todos en un mesh.
		- Añadir imagen de MapBox al mesh creado y ver si coincide o no.
		- Añadir el mesh creado a la escena.
	*/
	
	