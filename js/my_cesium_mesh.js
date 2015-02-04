	/* 
		PFC my_cesium Library: CesiumJS + ThreeJS 
		This library uses tiles of CesiumJS and Threejs to create a mesh.
	*/
	var coordinates, xhr = new XMLHttpRequest();
	/*
		info_tiles contains all information about tiles of the rute gpx.
		Each element of the array is a InfoTile element.
	*/
	var info_tiles;
	//variable to access to data in Cesium.
	var aCesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
		url : '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
	});
	/*
		Function request data.
	*/
	function requestTilesWhenReady() {
		if (aCesiumTerrainProvider.ready) {
			console.log("[PFC my_cesium_mesh.js]: Cesium Server Terrain Provider ready");
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
						//studyRute create the mesh. create_mesh.js
						studyRute(JSON.parse(xhr.responseText));
						console.log("[PFC my_cesium_mesh.js]: File " + sessionStorage.rute + " loaded.");
					}else {
						console.log("[PFC my_cesium_mesh.js]: Error donwload rute gpx Ajax.");
					}
					
				}
			}
		}
	}
	/*
		Function create scene and GUI with threejs.js my library.
	*/
	function load(coord) {
		coordinates = coord;
		//Create scene ThreeJs with threejs.js
		loadThreeJS();
		//Create Graphic User Interface with gui.js
		createGUI();
		info_tiles = checkTile(coord);
	}
	
	