/* 
	PFC my_cesium Library: CesiumJS + ThreeJS 
	This library uses tiles of CesiumJS and Threejs to create a mesh.
*/
//variable to access to data in Cesium.
var aCesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
	url : '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
});
/*
	Variable global to handler the asynchronous cesium terrain provider.
	info_tiles: save the information of route mesh.
	rectangle_tiles: save the information of route mesh with add to complete a rectangle.
*/
var info_tiles, rectangle_tiles;
var mesh_export;
var combined_geometry = new THREE.Geometry();
//Position gemetries
//var x = -20, y = 0, z = 0;
//index_tile to each tile in info_tile.
var mapbox_texture, index_tile = 0;
//to know where put the geometry.
var tile_x, tile_y;
var tile_actually_x, tile_actually_y;
var geometry_previous;

//to handle the height scalar.
var quotient;
/*
	Variable global contains maximum value of height(z) in the vertex.
*/
var max_vertice;
/*
	To create the connection vertex.
*/
var geometry_before;
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
					console.log("[PFC my_cesium_mesh.js]: File " + sessionStorage.rute + " loaded.");
					load(JSON.parse(xhr.responseText));
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
var change_x, index_tile = 0;
function load(coord) {
	/*
		info_tiles contains all information about tiles of the rute gpx.
		Each element of the array is a InfoTile element.
	*/ 
	//Create scene ThreeJs with threejs.js
	loadThreeJS();
	//Create Graphic User Interface with gui.js
	createGUI();
	info_tiles = new Array(); 
	checkTile(coord, 14);
	rectangle_tiles = createRectangle(info_tiles, 14);
	for(i = 0; i < rectangle_tiles.length; i++) {
		aCesiumTerrainProvider.requestTileGeometry(rectangle_tiles[i].x, rectangle_tiles[i].y, 14, false).then(function(data){
				asociateGeometry(data, 1000);
				index_tile++;
			});
	}
	createGeometries();
}

function maxMinTileXY() {
	var min_x = rectangle_tiles[0].x, max_x = rectangle_tiles[0].x, min_y = rectangle_tiles[0].y, max_y = rectangle_tiles[0].y;
		for(i = 1; i < rectangle_tiles.length; i++) {
			if (rectangle_tiles[i].x < min_x)
				min_x = rectangle_tiles[i].x;
			if (rectangle_tiles[i].x > max_x)
				max_x = rectangle_tiles[i].x;
			if (rectangle_tiles[i].y < min_y) 
				min_y = rectangle_tiles[i].y;
			if (rectangle_tiles[i].y > max_y)
				max_y = rectangle_tiles[i].y;
		}
	return [[min_x, min_y],[max_x, max_y]];
}

function createGeometries() {
	if (rectangle_tiles[0].geometry) {
		console.log('[PFC my_cesium_mesh.js]: Geometries created in rectangle_tiles');
		rectangle = maxMinTileXY();
		
		var x = 0; y = 0; z = 0;
		var index = 0, previous_geometry;
		var east = false;
		for(i = rectangle[0][0]; i <= rectangle[1][0]; i++) {
			for(j = rectangle[0][1]; j <= rectangle[1][1]; j++) {
				if (previous_geometry){
					var data_geometry = changeVertex(rectangle_tiles[index].geometry, previous_geometry, east);
					rectangle_tiles[index].geometry = data_geometry[0];
					y = y + data_geometry[1];
					addGeometryScene(rectangle_tiles[index].geometry, x, y, z);
				} else {
					addGeometryScene(rectangle_tiles[index].geometry, x, y, z);
				}
				z = z - 33;
				previous_geometry = rectangle_tiles[index].geometry;
				index++;
				east = false;
			}
			y = 0;
			z = 0;
			x = x + 33;
			east = true;
		}
		
	} else {
		setTimeout(createGeometries, 10);
	}
}

function changeVertex(geometry, pre_geometry, east) {
	var max_actually, max_previous, i;
	var min_actually, min_previous, y;
		if (pre_geometry.boundingBox == null)
			pre_geometry.computeBoundingBox();
		if (geometry.boundingBox == null)
			geometry.computeBoundingBox();
		if (!east) {
			var south_vertex = new Array(), north_vertex = new Array();
			for(i=0; i < geometry.vertices.length; i++) {
				if ((geometry.vertices[i].y === geometry.boundingBox.min.y) && (geometry.vertices[i].z != 0)) 
					south_vertex.push(i);
			}
			south_vertex = sortVector(geometry, south_vertex, "x");
			for(i = 0; i < pre_geometry.vertices.length; i++) {
				if ((pre_geometry.vertices[i].y === pre_geometry.boundingBox.max.y) && (pre_geometry.vertices[i].z != 0)) 
					north_vertex.push(i);			
			}
			north_vertex = sortVector(pre_geometry, north_vertex, "x");
			y = pre_geometry.vertices[north_vertex[0]].z - geometry.vertices[south_vertex[0]].z; 
		} else {
			//Geometry at the east of initial.
			var south_vertex = new Array(), pre_south_vertex = new Array();
			for(i=0; i < geometry.vertices.length; i++) {
				if ((geometry.vertices[i].y === geometry.boundingBox.min.y) && (geometry.vertices[i].z != 0)) 
					south_vertex.push(i);
			}
			south_vertex = sortVector(geometry, south_vertex, "x");
			for(i = 0; i < pre_geometry.vertices.length; i++) {
				if ((pre_geometry.vertices[i].y === pre_geometry.boundingBox.max.y) && (pre_geometry.vertices[i].z != 0)) 
					pre_south_vertex.push(i);			
			}
			pre_south_vertex = sortVector(pre_geometry, pre_south_vertex, "x");
			y = geometry.vertices[south_vertex[0]].z - pre_geometry.vertices[pre_south_vertex[pre_south_vertex.length-1]].z;
		}
	return [geometry , y];
}

/*
	Add geometry to scene.
*/
function addGeometryScene(geometry, x, y, z){
	material= new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: true ,side:THREE.DoubleSide} );
	mesh = new THREE.Mesh( geometry, material );
	mesh.rotation.x =  Math.PI / 180 * (-90);
	mesh.position.set(x, y, z);
	scene.add(mesh);	
}
/*
	Recieve data from asynchronous cesium then create and store the geometry for each tile.
*/
function asociateGeometry(data, scale) {
	var mesh, facesQuantized, geometry;
	var xx = data._uValues, 
		yy = data._vValues,
		heights = data._heightValues;
	facesQuantized = data._indices;
	var geometry = new THREE.Geometry();
	for(var i=0; i < heights.length; i++)
		geometry.vertices.push( new THREE.Vector3(Math.round(xx[i]/scale),Math.round(yy[i]/scale),Math.round(heights[i]/scale)));
	
	for(var i=0; i < facesQuantized.length; i=i+3)
		geometry.faces.push(new THREE.Face3(facesQuantized[i], facesQuantized[i+1], facesQuantized[i+2]));
	rectangle_tiles[index_tile].geometry = geometry;
	
	//geometry = addFaceVertexUvs(geometry);
	//geometry = addBase(geometry);
	//geometry = addFaceVertexUvs(geometry);
}

	
	