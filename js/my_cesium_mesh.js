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
	/*
		Function to add faces vertices to my own geomtry.
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
			geometry = addFaceVertexUvs(geometry);
			var texture = THREE.ImageUtils.loadTexture( "./textures/"+ sessionStorage.name +".png" );
			var material= new THREE.MeshBasicMaterial( { map: texture, wireframe: true } );
			//geometry.faces.push(new THREE.Face3( 86, 87, 88));
			//var material= new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: true } );
			/*
			material.needsUpdate = true;
			geometry.buffersNeedUpdate = true;
			geometry.uvsNeedUpdate = true;
			*/
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
		//Create scene Three.js
		loadThreeJS();
		//Create Graphic User Interface.
		createGUI();
		/* 
			Change the mesh, change the coordinates.
		*/
		var mesh_x = -40, mesh_y = 0, mesh_z = 0, latitude = coordinates[0][0], longitude = coordinates[0][1];
		//var mesh_x = -20, mesh_y = 0, mesh_z = 0, latitude = 43.314, longitude = -2.002;
		//console.log("[PFC]: Coordinates: " + latitude + " - " + longitude);
		loadedTerrainProvider(mesh_x, mesh_y, mesh_z, latitude, longitude);
	}
	
	