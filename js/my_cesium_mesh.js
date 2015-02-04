/* 
	PFC my_cesium Library: CesiumJS + ThreeJS 
	This library uses tiles of CesiumJS and Threejs to create a mesh.
*/
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
	xhr = new XMLHttpRequest();
	if (xhr.upload) {
		var url = "getRute.php";
		var contenido = "rute="+sessionStorage.rute;
		xhr.open("GET", url+"?"+contenido, true);
		xhr.send();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				if (xhr.responseText != "") {
					load(JSON.parse(xhr.responseText));
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
	/*
		info_tiles contains all information about tiles of the rute gpx.
		Each element of the array is a InfoTile element.
	*/
	var info_tiles, combined_geometries;
	//Create scene ThreeJs with threejs.js
	loadThreeJS();
	//Create Graphic User Interface with gui.js
	createGUI();
	info_tiles = checkTile(coord);
	showGeometries(info_tiles);

}

function showGeometries(info_tiles) {
	for(i = 0; i < info_tiles.length; i++) {
		switch (info_tiles[i].cardinality) {
			case "c":	createMesh(0, 0, 0, info_tiles[i].x, info_tiles[i].y, sessionStorage.name + i + info_tiles[i].cardinality);
						break;
			case "s":	createMesh(0, 0, 33, info_tiles[i].x, info_tiles[i].y, sessionStorage.name + i + info_tiles[i].cardinality);
						break;
			case "n":	createMesh(0, 0, -33, info_tiles[i].x, info_tiles[i].y, sessionStorage.name + i + info_tiles[i].cardinality);
						break;
			case "w":	createMesh(-33, 0, 0, info_tiles[i].x, info_tiles[i].y, sessionStorage.name + i + info_tiles[i].cardinality);
						break;
			case "e":	createMesh(33, 0, 0, info_tiles[i].x, info_tiles[i].y, sessionStorage.name + i + info_tiles[i].cardinality);
						break;
		}	
	}
}
	
	