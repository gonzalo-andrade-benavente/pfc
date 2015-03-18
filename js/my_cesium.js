var aCesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
	url : '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
});

function requestTilesWhenReady() {
	var lat = 42.8, lon = -1.634, level = 14;
	if (aCesiumTerrainProvider.ready) {
		console.log("[PFC my_cesium_mesh.js]: Cesium Server Terrain Provider ready");
		showData(lat, lon, level);
	} else {
		setTimeout(requestTilesWhenReady, 10);
	}
}

function showData(lat, lon, level) {
	document.write("[PFC my_cesium.js]: Show data");
	
}