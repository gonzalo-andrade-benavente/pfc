	var latitude = 43.314, longitude = -2.002, tile, tiles=[];
	var latitudeOrigin = 43.314, longitudeOrigin = -2.002; 
	//camera.position.x = 50;
	//camera.position.y = 20;
	var aCesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
		url : '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
	});
	
	function loadedTerrainProvider(x, y, z) {
		var positionLonLat = Cesium.Cartographic.fromDegrees(longitude, latitude);
		positionTileXY = aCesiumTerrainProvider.tilingScheme.positionToTileXY(positionLonLat,12);
		//console.log(positionTileXY);
		tile = getTile(positionTileXY);
		aCesiumTerrainProvider.requestTileGeometry(positionTileXY.x,positionTileXY.y,12,true).then(function(data){
			mesh(data, x, y, z);
		});
	}
	
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
	/*
		CLASE TILE
	*/
	function Tile(northeast, southeast, northwest, southwest) {
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
	function Coordinate(latitude, longitude) {
		this.latitude = latitude;
		this.longitude = longitude;
	}
	/*
		FUNCIÓN TRANSFORMA RADIANES A GRADOS
	*/
	function radianToDegrees(radians) {
		return (radians * 180)/ Math.PI;	
	}
	/*
		FUNCIÓN PARA OBTENER LOS DATOS DE CESIUM
	*/
	function requestTilesWhenReady() {
		if (aCesiumTerrainProvider.ready) {
			console.log("[PFC]:Server Terrain Provider ready");			
		} else {
			//console.log("[PFC]:Waiting a Terrain Provider is ready");
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
	function mesh(cesium, x, y, z) {
		var mesh_aux;
		var verticesQuantized, facesQuantized, geometry;
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
		mesh_aux = new THREE.Mesh( geometry, material );
		mesh_aux.rotation.x =  Math.PI / 180 * (-90);
		mesh_aux.position.set(x, y, z);
		tiles.push(mesh_aux);
		//scene.add(mesh);
	}
	/*
		FUNCIÓN CREA MAPA 4 REGIONES.
	*/
	function createMap() {
		tileToMesh(0, 0, 0, latitude, longitude);
		tileToMesh(32, 0, 0, latitude, longitudeOrigin + tile.distanceCoordinate);
		tileToMesh(0, 0, 32, latitudeOrigin - tile.distanceCoordinate, longitudeOrigin);
		//tileToMesh(-32, 0, 32, latitudeOrigin - tile.distanceCoordinate, longitudeOrigin - tile.distanceCoordinate);
		tileToMesh(32, 0, 32, latitudeOrigin - tile.distanceCoordinate, longitudeOrigin + tile.distanceCoordinate);
		console.log("[PFC]:Array de mesh creados.");
	}
	/*
		FUNCIÓN QUE A PARTIR DE UNA LATITUD Y LONGITUD(VAR GLOBALES)
		Y LAS POSICIONES EN LA PANTALLA, CREA EL MESH.
	*/
	function tileToMesh(x, y, z, lat, lon){
		latitude = lat;
		longitude = lon;
		loadedTerrainProvider(x, y, z);
	}
	/*
		FUNCIÓN QUE CREA UN MESH A PARTIR DE VARIOS
		CON LA FUNCION "MERGE" DE GOEMETRY.
	*/
	function merge() {
		var geometry = new THREE.Geometry();
		var mesh_aux, geo;
		for (var i=0; i< tiles.length ; i++){
			geo = tiles[i];
			geo.updateMatrix();
			geometry.merge(geo.geometry, geo.matrix);
		}
		//geometry.computeTangents();
		var texture, material;
		texture = THREE.ImageUtils.loadTexture( "maps/file.jpeg" );
		material= new THREE.MeshBasicMaterial( { color:"rgb(255,0,0)", wireframe:true, map:texture} );
		//material= new THREE.MeshBasicMaterial( { color:"rgb(255,0,0)", wireframe:true} );
		mesh_aux = new THREE.Mesh( geometry, material );
		mesh_aux.position.set(-30, -10, 0);
		scene.add(mesh_aux);
		console.log("[PFC]: Mesh creado con merge().");
	}
	
	function addBox() {
		var geometry = new THREE.BoxGeometry(30, 30, 30);
		var texture = THREE.ImageUtils.loadTexture( "maps/file.jpeg" );
		var material= new THREE.MeshBasicMaterial( {wireframe:false, map:texture} );
		var mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);
	}
	
	function addGeometry() {
		var geometry = new THREE.Geometry();
			geometry.vertices.push(new THREE.Vector3(0, 0, 0));
			//geometry.vertices.push(new THREE.Vector3(30, 0, 0));
			geometry.vertices.push(new THREE.Vector3(0, -30, 0));
			geometry.vertices.push(new THREE.Vector3(30, -30, 0));
			
			geometry.faces.push(new THREE.Face3(0,1,2));
			//geometry.faces.push(new THREE.Face3(0,2,3));
			
			
			geometry.faceVertexUvs[0].push([
				new THREE.Vector2(0, 0),
				new THREE.Vector2(0, 1),
				new THREE.Vector2(1, 0),
			]);
			
			/*
			geometry.faceVertexUvs[1].push([
				new THREE.Vector2(0, 0),
				new THREE.Vector2(0, 1),
				new THREE.Vector2(1, 0),
			]);
			*/
			
		console.log(geometry);
		var texture = THREE.ImageUtils.loadTexture( "maps/file.jpeg" );
		var material= new THREE.MeshBasicMaterial( {wireframe:false, map:texture} );
		//var material= new THREE.MeshBasicMaterial( { color:"rgb(255,0,0)", wireframe:true} );
		scene.add(new THREE.Mesh(geometry, material));
	}
	
	/*
		- Tener coordenadas de latitud y longitud, tener en cuenta la ruta gpx.
		- Obtener los tiles necesario para la ruta en CesiumJS.
		- Crear cada tile y unirlos todos en un mesh.
		- Añadir imagen de MapBox al mesh creado y ver si coincide o no.
		- Añadir el mesh creado a la escena.
	*/
	
	