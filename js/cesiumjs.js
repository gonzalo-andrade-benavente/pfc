	var aCesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
		url : '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
	});
	function loadedTerrainProvider(){
		var latitude, longitude, cesium;
		var sw, se, nw, ne;
		latitude = -2,002;
		longitude = 43.314;
		//Cartographic.fromDegrees(longitude, latitude, height, result)
		var positionLonLat = Cesium.Cartographic.fromDegrees(longitude, latitude);
		positionTileXY = aCesiumTerrainProvider.tilingScheme.positionToTileXY(positionLonLat,12);
		
		var rectangleTileXY = aCesiumTerrainProvider.tilingScheme.tileXYToRectangle(positionTileXY.x, positionTileXY.y, 12);
		sw = new Coordinate(radianToDegrees(Cesium.Rectangle.southwest(rectangleTileXY).latitude),radianToDegrees(Cesium.Rectangle.southwest(rectangleTileXY).longitude));
		se = new Coordinate(radianToDegrees(Cesium.Rectangle.southeast(rectangleTileXY).latitude),radianToDegrees(Cesium.Rectangle.southeast(rectangleTileXY).longitude));
		nw = new Coordinate(radianToDegrees(Cesium.Rectangle.northwest(rectangleTileXY).latitude),radianToDegrees(Cesium.Rectangle.northwest(rectangleTileXY).longitude));
		ne = new Coordinate(radianToDegrees(Cesium.Rectangle.northeast(rectangleTileXY).latitude),radianToDegrees(Cesium.Rectangle.northeast(rectangleTileXY).longitude));
		var myTile = new Tile(ne, se, nw, sw);
		
		console.log(myTile);
		aCesiumTerrainProvider.requestTileGeometry(positionTileXY.x,positionTileXY.y,12,true).then(function(data){
			mesh1(data);
		});
	}
	
	
	/*
		CLASE TILE
	*/
	function Tile(northeast, southeast, northwest, southwest){
		this.northeast = northeast;
		this.southeast = southeast;
		this.northwest = northwest;
		this.southwest = southwest;
		this.distance = ((northeast.latitude - southeast.latitude)/0.01)*1.1132;
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
		mesh.rotation.x =  Math.PI / 180 * (-90);
		scene.add(mesh);
	}
	/*
		FUNCIÓN OBTENCION DATOS CESIUM
	*/
	function foo(data) {
		//PRINCIPAL
		var cesium = data;
		mesh1(cesium);	
	}
		
	function changeHeight(min, max, height) {
		//Llamada de la función : var height = changeHeight(cesium._minimumHeight, cesium._maximumHeight, verticesQuantized[1]);
		var minQ = 0, maxQ = 32767;
		var correct;
			interval = max - min;
			interval = interval/maxQ;
			correct = min + (height*interval);
		return correct;
	}
