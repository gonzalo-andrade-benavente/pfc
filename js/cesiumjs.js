	var latitude = 43.314, longitude = -2.002, tile, tiles=[], geometries=[];
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
			createMap();
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
		geometries.push(geometry);
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
		var mesh_aux, mesh, material, texture;
		for (var i=0; i< tiles.length ; i++){
			mesh = tiles[i];
			mesh.updateMatrix();
			geometry.merge(mesh.geometry, mesh.matrix);
			console.log(mesh.material);
		}
		geometry = addFaceVertexUvs(geometry);
		if (geometry.faceVertexUvs[0].length == geometry.faces.length) {
			texture = THREE.ImageUtils.loadTexture( "maps/file.jpeg" );
			material= new THREE.MeshBasicMaterial( {map:texture} );
		} else {
			material= new THREE.MeshBasicMaterial( { color:"rgb(255,0,0)", wireframe:true} );
		}
		
		mesh_aux = new THREE.Mesh( geometry, material );
		mesh_aux.position.set(-30, -10, 0);
		scene.add(mesh_aux);
		console.log("[PFC]: Mesh creado con merge().");
	}
	
	function createMesh(){
		geometry = addFaceVertexUvs(geometries[0]);
		//console.log(geometry);
		var material, texture;
		texture = THREE.ImageUtils.loadTexture( "maps/file.jpeg" );
		//material= new THREE.MeshBasicMaterial( { color:"rgb(255,0,0)", wireframe:true} );
		material= new THREE.MeshBasicMaterial( {wireframe:false, map:texture} );
		scene.add(new THREE.Mesh(geometry, material));
	}
	/* 
		FUNCIÓN QUE CREA LOS FACEVERTEX PARA PODER
		APLICAR LA TEXTURA A LA GEOMETRÍA CREADA.
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
		
	function addBox() {
		var geometry = new THREE.BoxGeometry(3, 3, 3, 3);
		var texture = THREE.ImageUtils.loadTexture( "maps/file.jpeg" );
		var material= new THREE.MeshBasicMaterial( {wireframe:false, map:texture} );
		var mesh = new THREE.Mesh(geometry, material);
		console.log(geometry);
		scene.add(mesh);
	}
	
	function addGeometry() {
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(0, 0, 0));
		geometry.vertices.push(new THREE.Vector3(60, 0, 0));
		geometry.vertices.push(new THREE.Vector3(0, -333, 0));
		geometry.vertices.push(new THREE.Vector3(18, -30, 0));
		geometry.faces.push(new THREE.Face3(0,2,1));
		geometry.faces.push(new THREE.Face3(2,3,1));
		geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 1), new THREE.Vector2(0, 0), new THREE.Vector2(1, 1)]);
		geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)]);	
		var texture = THREE.ImageUtils.loadTexture( "maps/file.jpeg" );
		var material= new THREE.MeshBasicMaterial( {wireframe:false, map:texture} );
		//var material= new THREE.MeshBasicMaterial( { color:"rgb(255,0,0)", wireframe:true} );
		scene.add(new THREE.Mesh(geometry, material));
		console.log(geometry)
	}
	
	function addPlane() {
		var geometry = new THREE.PlaneGeometry(4, 4, 2, 2);
		//var material = new THREE.MeshBasicMaterial( { color:"rgb(255,0,0)", wireframe:true} );
		var texture = THREE.ImageUtils.loadTexture( "maps/file.jpeg" );
		var material= new THREE.MeshBasicMaterial( {wireframe:false, map:texture} );
		
		for(var i=0; i<geometry.vertices.length; i++){
			if (i == 10)
				geometry.vertices[i].z=10;
		}
		console.log(geometry);
		scene.add(new THREE.Mesh(geometry, material));
	}
	
	/*
		- Tener coordenadas de latitud y longitud, tener en cuenta la ruta gpx.
		- Obtener los tiles necesario para la ruta en CesiumJS.
		- Crear cada tile y unirlos todos en un mesh.
		- Añadir imagen de MapBox al mesh creado y ver si coincide o no.
		- Añadir el mesh creado a la escena.
	*/
	
	