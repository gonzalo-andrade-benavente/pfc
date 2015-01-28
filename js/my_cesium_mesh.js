	/* 
		PFC my_cesium Library: CesiumJS + ThreeJS 
		This library uses tiles of CesiumJS and Threejs to create a mesh.
	*/
	
	var coordinates, xhr = new XMLHttpRequest();
	//variable to access to data in Cesium.
	var aCesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
		url : '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
	});
	/*
		Function request data.
	*/
	function requestTilesWhenReady() {
		if (aCesiumTerrainProvider.ready) {
			console.log("[PFC]: Cesium Server Terrain Provider ready");
			getRute();
		} else {
			//console.log("[PFC]:Waiting a Terrain Provider is ready");
			setTimeout(requestTilesWhenReady, 10);
		}
	}
	/*
		Function request data gpx.
	*/
	function getRute() {
		if (xhr.upload) {
			var url = "getRute.php";
			var contenido = "rute="+sessionStorage.rute;
			xhr.open("GET", url+"?"+contenido, true);
			xhr.send();
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					if (xhr.responseText != "") {
						load(JSON.parse(xhr.responseText));
					}else {
						console.log("[PFC]: Error donwload rute gpx Ajax.");
					}
					
				}
			}
		}
	}
	
	function loadedTerrainProvider(x, y, z, latitude, longitude) {
		var positionLonLat = Cesium.Cartographic.fromDegrees(longitude, latitude);
		positionTileXY = aCesiumTerrainProvider.tilingScheme.positionToTileXY(positionLonLat,12);
		aCesiumTerrainProvider.requestTileGeometry(positionTileXY.x,positionTileXY.y,12,true).then(function(data){
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
			var material= new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: true } );
			mesh = new THREE.Mesh( geometry, material );
			mesh.rotation.x =  Math.PI / 180 * (-90);
			mesh.position.set(x, y, z);
			mesh.name = latitude + "/" + longitude;
			scene.add(mesh);
			console.log("[PFC]: Mesh added to scene.");
		});
	}
	/*
		Function create scene and GUI with threejs.js my library.
	*/
	function load(coor) {
		coordinates = coor;
		console.log("[PFC]: File " + sessionStorage.rute + " loaded.");
		loadThreeJS();
		createGUI();
		var mesh_x = -20, mesh_y = 0, mesh_z = 0, latitude = coordinates[0][0], longitude = coordinates[0][1];
		//var mesh_x = -20, mesh_y = 0, mesh_z = 0, latitude = 43.314, longitude = -2.002;
		console.log("[PFC]: Coordinates: " + latitude + " - " + longitude);
		loadedTerrainProvider(mesh_x, mesh_y, mesh_z, latitude, longitude);
	}
	
	