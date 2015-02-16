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
*/
var info_tiles;
var mesh_export;
var combined_geometry = new THREE.Geometry();
//Position gemetries
var x = 0, y = 0, z = 0;
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
	//Create scene ThreeJs with threejs.js
	loadThreeJS();
	//Create Graphic User Interface with gui.js
	createGUI();
	info_tiles = new Array(); 
	checkTile(coord);
	tile_x = info_tiles[0].x ; tile_y = info_tiles[0].y;
	tile_actually_x = info_tiles[0].x; tile_actually_y = info_tiles[0].y;
	for(i = 0; i < info_tiles.length; i++) {
		aCesiumTerrainProvider.requestTileGeometry(info_tiles[i].x, info_tiles[i].y, 12, true).then(function(data){
			createMeshCesium(data);			
		});
	}
}

function createMeshCesium(data) {
	/*
		index_tile contains the position to each mesh tile.
	*/
	var mesh, facesQuantized, geometry;
	var xx = data._uValues, 
		yy = data._vValues,
		heights = data._heightValues;
	facesQuantized = data._indices;
	var geometry = new THREE.Geometry();
	for(var i=0; i < heights.length; i++)
		geometry.vertices.push( new THREE.Vector3(Math.round(xx[i]/1000),Math.round(yy[i]/1000),Math.round(heights[i]/1000)));
	
	for(var i=0; i < facesQuantized.length; i=i+3)
		geometry.faces.push(new THREE.Face3(facesQuantized[i], facesQuantized[i+1], facesQuantized[i+2]));
	
	geometry = addBase(geometry);
	geometry = addFaceVertexUvs(geometry);
	
	/*
		mult provide the factor to multiply to know the new position
		of the mesh. Before do the rest with the central position.
	*/
	var mult_x = 0, mult_y = 0, mult_x_escalate = 0, mult_y_escalate = 0;
	if (info_tiles[index_tile].cardinality != 'c') {
		mult_x = info_tiles[index_tile].x - tile_x;
		mult_y = info_tiles[index_tile].y - tile_y;
		/*
			Escalate dimensions.
		*/
		mult_x_escalate = info_tiles[index_tile].x - tile_actually_x;
		mult_y_escalate = info_tiles[index_tile].y - tile_actually_y;
		if (mult_y_escalate > 0) {
			//Actually is at the south of last tile.
			geometry = escalateGeometry(geometry, geometry_previous, 's');
		} else if (mult_y_escalate < 0) {
			//Actually is at the north of last tile.
			geometry = escalateGeometry(geometry, geometry_previous, 'n');
		} else if (mult_x_escalate > 0) {
			//Actually is at the easth of last tile.
			geometry = escalateGeometry(geometry, geometry_previous, 'e');
		} else if (mult_x_escalate < 0) {
			//Actually is at the west of last tile.
			geometry = escalateGeometry(geometry, geometry_previous, 'w');
		}
		tile_actually_x = info_tiles[index_tile].x; 
		tile_actually_y = info_tiles[index_tile].y;
		
		x = x + (33 * mult_x);
		z = z + (33 * mult_y);
		
	} else {
		geometry_previous = geometry;
	}
	/*
		Change the geometry previous to compare the actually geometry.
	*/
	geometry_previous = geometry;
	mapbox_texture = sessionStorage.name + index_tile + info_tiles[index_tile].cardinality;
	var texture = THREE.ImageUtils.loadTexture( "./textures/"+ mapbox_texture + ".png" );
	var material= new THREE.MeshBasicMaterial( { map: texture, wireframe: true, side:THREE.DoubleSide } );
	//var material= new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: true ,side:THREE.DoubleSide} );
	mesh = new THREE.Mesh( geometry, material );
	mesh.name = "tile"+index_tile;
	mesh_export = mesh;
	mesh.rotation.x =  Math.PI / 180 * (-90);
	mesh.position.set(x, y, z);
	scene.add(mesh);
	/*
		Set x,y,z equal zero to come back to center point.
	*/
	x = 0; y = 0; z = 0;
	mesh.updateMatrix();
	combined_geometry.merge(mesh.geometry, mesh.matrix);
	index_tile++;
}
/*
	Receive the actual geometry and the previous geometry, so we need to change
	the values of the geometry.
*/
function escalateGeometry(geometry, geometry_pre, cardinality) {
	if (geometry_pre.boundingBox == null)
		geometry_pre.computeBoundingBox();
	if (geometry.boundingBox == null)
		geometry.computeBoundingBox();
	var max_previous, max_actually, i;
	var vertex = new Array();
	switch (cardinality) {
		case 's': 	{
						//console.log("South");
						//Find north vertex in geometry actually.
						for(i = 0; i < geometry.vertices.length; i++) {
							if ((geometry.vertices[i].y === geometry.boundingBox.max.y) && (geometry.vertices[i].z != 0)) 
								vertex.push(i);			
						}
						//Sort vector where height is equal and distinct of zero (z).
						vertex = sortVector(geometry, vertex, "x");
						//Maximum vertex to scale the next mesh.
						max_actually = majorValue(geometry, vertex);
						vertex.length = 0;
						//Find south vertex in geometry previous.
						for(i = 0; i < geometry_pre.vertices.length; i++) {
							if ((geometry_pre.vertices[i].y === geometry_pre.boundingBox.min.y) && (geometry_pre.vertices[i].z != 0)) 
								vertex.push(i);			
						}
						max_previous = majorValue(geometry_pre, vertex);
						break;
					}
		case 'n': 	{
						//console.log("North");
						//Find south vertex in geometry actually.
						for(i = 0; i < geometry.vertices.length; i++) {
							if ((geometry.vertices[i].y === geometry.boundingBox.min.y) && (geometry.vertices[i].z != 0)) 
								vertex.push(i);			
						}
						//Sort vector where height is equal and distinct of zero (z).
						vertex = sortVector(geometry, vertex, "x");
						//Maximum vertex to scale the next mesh.
						max_actually = majorValue(geometry, vertex);
						vertex.length = 0;
						//Find north vertex in geometry previous.
						for(i = 0; i < geometry_pre.vertices.length; i++) {
							if ((geometry_pre.vertices[i].y === geometry_pre.boundingBox.max.y) && (geometry_pre.vertices[i].z != 0)) 
								vertex.push(i);			
						}
						max_previous = majorValue(geometry_pre, vertex);
						break;
					}
		case 'w': 	{
						//console.log("West");
						//Find east vertex in geometry actually.
						for(i = 0; i < geometry.vertices.length; i++) {
							if ((geometry.vertices[i].x === geometry.boundingBox.max.x) && (geometry.vertices[i].z != 0)) 
								vertex.push(i);			
						}
						//Sort vector where height is equal and distinct of zero (z).
						vertex = sortVector(geometry, vertex, "y");
						//Maximum vertex to scale the next mesh.
						max_actually = majorValue(geometry, vertex);
						vertex.length = 0;
						//Find west vertex in geometry previous.
						for(i = 0; i < geometry_pre.vertices.length; i++) {
							if ((geometry_pre.vertices[i].x === geometry_pre.boundingBox.min.x) && (geometry_pre.vertices[i].z != 0)) 
								vertex.push(i);			
						}
						max_previous = majorValue(geometry_pre, vertex);
						break;
					}
		case 'e': 	{
						//console.log("East");
						//Find west vertex in geometry actually.
						for(i = 0; i < geometry.vertices.length; i++) {
							if ((geometry.vertices[i].x === geometry.boundingBox.min.x) && (geometry.vertices[i].z != 0)) 
								vertex.push(i);			
						}
						//Sort vector where height is equal and distinct of zero (z).
						vertex = sortVector(geometry, vertex, "y");
						//Maximum vertex to scale the next mesh.
						max_actually = majorValue(geometry, vertex);						
						vertex.length = 0;
						//Find west vertex in geometry previous.
						for(i = 0; i < geometry_pre.vertices.length; i++) {
							if ((geometry_pre.vertices[i].x === geometry_pre.boundingBox.max.x) && (geometry_pre.vertices[i].z != 0)) 
								vertex.push(i);			
						}
						max_previous = majorValue(geometry_pre, vertex);
						break;
					}
	}
	
	/*
		Change value of vertices "z" height respect the maximum value of mesh center or another mesh.
		Quotient contains the most high value to scalar. 
		########################## Escale ###########################
	*/
	if ((max_previous/max_actually) > 1) {
		if (quotient) {
			if ((max_previous/max_actually) > quotient)
				quotient = (max_previous/max_actually);
		} else {
			quotient = max_previous/max_actually;
		}
	}

	for (i = 0; i < geometry.vertices.length; i++)
		geometry.vertices[i].z = geometry.vertices[i].z * (max_previous/max_actually);	
	return geometry;
}
/*
	Return major value of one vertex.
*/
function majorValue(geometry, vertex){
	var val = geometry.vertices[vertex[0]].z;
	for(i = 1; i < vertex.length; i++) {
		if (geometry.vertices[vertex[i]].z > val)
			val = geometry.vertices[vertex[i]].z;
	}
	return val;
}

	
	