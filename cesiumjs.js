	//Puede ser que la latitud y longitud estén a réves.
	var lat = -1.6404555, lon = 42.8139115;
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

	/*
		FUNCIÓN PARA OBTENER LOS DATOS DE CESIUM
	*/
	function requestTilesWhenReady() {
		if (aCesiumTerrainProvider.ready) {
			console.log("Terrain Provider ready");
			positionTileXY = aCesiumTerrainProvider.tilingScheme.positionToTileXY(positionLonLat,12);
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

	var positionLonLat = Cesium.Cartographic.fromDegrees(lat, lon);
    requestTilesWhenReady();