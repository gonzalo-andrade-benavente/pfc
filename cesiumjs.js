	//Puede ser que la latitud y longitud estén a réves.
	var lat = -1.6404555, lon = 42.8139115;
	//var lat = 43, lon = -20;
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
		//geometry.computeBoundingSphere();
		/*
		for(var i=0; i < verticesQuantized.length; i=i+3){
			geometry.vertices.push(new THREE.Vector3(Math.round(verticesQuantized[i]/1000), Math.round(verticesQuantized[i+1]/1000), Math.round(verticesQuantized[i+2]/1000)));
			console.log("x:"+ Math.round(verticesQuantized[i]/1000) +" y:"+ Math.round(verticesQuantized[i+1]/1000) +" z:"+ Math.round(verticesQuantized[i+2]/1000));
		}
		*/
		for(var i=0; i < heights.length; i++){
			geometry.vertices.push( new THREE.Vector3(Math.round(x[i]/1000),Math.round(y[i]/1000),Math.round(heights[i]/1000)));
		}

		for(var i=0; i < facesQuantized.length; i=i+3){
			geometry.faces.push(new THREE.Face3(facesQuantized[i], facesQuantized[i+1], facesQuantized[i+2]));
			//console.log(facesQuantized[i] +","+facesQuantized[i+1]+","+ facesQuantized[i+2]);
		}
		
		//geometry.computeBoundingSphere();
		mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial( {wireframe : true}) );
		scene.add(mesh);
	}
	/*
		FUNCIÓN CREACIÓN MESH CON QuantizedMeshTerrainData
	*/
	function mesh2(cesium) {
		var verticesQuantized;
		verticesQuantized = cesium._quantizedVertices;
		var height = changeHeight(cesium._minimumHeight, cesium._maximumHeight, verticesQuantized[1]);
	}
	/*
		FUNCIÓN OBTENCION DATOS CESIUM
	*/
	function foo(data) {
		//PRINCIPAL
		// obtengo un terrain data.
		var cesium = data;
		console.log(cesium);
		//cuadrado();
		mesh1(cesium);
		//mesh2(cesium);		
	}
	
	function cuadrado(){
		var geometry = new THREE.Geometry();
		geometry.vertices.push(
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(100, 0, 0),
			new THREE.Vector3(200, 0, 0),
			new THREE.Vector3(0, 100, 0),
			new THREE.Vector3(100, 100, 0),
			new THREE.Vector3(200, 100, 0),
			new THREE.Vector3(0, 200, 0),
			new THREE.Vector3(100, 200, 0),
			new THREE.Vector3(200, 200, 0)
		);
		geometry.faces.push( new THREE.Face3(0,1,3), new THREE.Face3(3,4,1), new THREE.Face3(1,4,2), new THREE.Face3(4,5,2), new THREE.Face3(3,6,4), new THREE.Face3(6,7,4), new THREE.Face3(4,7,5), new THREE.Face3(7,5,8) );
		scene.add(new THREE.Mesh( geometry, new THREE.MeshNormalMaterial( {wireframe : true}) ));
	}
	
	function changeHeight(min, max, height) {
		var minQ = 0, maxQ = 32767;
		var correct;
			interval = max - min;
			interval = interval/maxQ;
			correct = min + (height*interval);
		return correct;
	}

	/*
		FUNCIÓN PARA OBTENER LOS DATOS DE CESIUM
	*/
	function requestTilesWhenReady() {
		if (aCesiumTerrainProvider.ready) {
			console.log("Terrain Provider ready");
			positionTileXY = aCesiumTerrainProvider.tilingScheme.positionToTileXY(positionLonLat,12);
			//obtengo un cartesian.
			aCesiumTerrainProvider.requestTileGeometry(positionTileXY.x,positionTileXY.y,12,true)
				.then(function(data) {
					 foo(data);
					});   
		} else {
				setTimeout(requestTilesWhenReady, 10);
			}
	}

	var aCesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
		url : '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
		});

	//coordenadas de Pamplona
	var positionLonLat = Cesium.Cartographic.fromDegrees(lat, lon);
	//pasamos a grados.
	
	//CesiumMath.toDegrees(radians) , CesiumMath.toRadians(degrees)
    requestTilesWhenReady();