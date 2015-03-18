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
var combined_geometry = new THREE.Geometry();
var combined = new THREE.Geometry();
//index_tile to each tile in info_tile.
var index_tile = 0;
//to handle the height scalar.
var quotient = 0;
//To combined geometry
var materials = new Array(), index_material = 0;

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
function load(coord) {
	/*
		info_tiles contains all information about tiles of the rute gpx.
		Each element of the array is a InfoTile element.
	*/ 
	//Create scene ThreeJs with threejs.js
	loadThreeJS();
	//Create Graphic User Interface with gui.js
	createGUI();
	var level = 14;
	info_tiles = new Array(); 
	checkTile(coord, level);
	rectangle_tiles = createRectangle(info_tiles, level);
	var promise = [];
	for(i = 0; i < rectangle_tiles.length; i++) {		
		requestPromise = aCesiumTerrainProvider.requestTileGeometry(rectangle_tiles[i].x, rectangle_tiles[i].y, level, false).then(function(data){
				asociateGeometry(data, 1000);
				index_tile++;
		});
		var tilePromise = Cesium.when(requestPromise);
        promise.push(tilePromise);
		
		
	}
	Cesium.when.all(promise, function() {
		createTerrain();
    });
	
	
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


function getGeometry(x, y) {
	var geometry;
	for (i = 0; i < rectangle_tiles.length; i++) {
		if ((rectangle_tiles[i].x == x) && (rectangle_tiles[i].y == y)) {
			geometry = rectangle_tiles[i].geometry;
			break;
		}
	}
	console.log(geometry);
	if (!geometry)
		console.log('NO GEOMETRY');
	
	return geometry;
}

function getVertex(geometry, cardinality) {

	if (geometry) {
		//geometry.computeBoundingBox();
	while(!geometry.boundingBox) {
		geometry.computeBoundingBox();
	}
		var i, j, vertex = new Array();
		//console.log("[PFC my_cesium_mesh]: BoundingBox Geometry ok!");
		switch (cardinality) {
			case 'east': {
				for(i = 0; i < geometry.vertices.length; i++) {
					if ((geometry.vertices[i].x === geometry.boundingBox.max.x) && (geometry.vertices[i].z != 0))
						vertex.push(i);
				}
				vertex = sortVector(geometry, vertex, 'y');
				break;
			}
			case 'west': {
				for(i = 0; i < geometry.vertices.length; i++) {
					if ((geometry.vertices[i].x === geometry.boundingBox.min.x) && (geometry.vertices[i].z != 0))
						vertex.push(i);
				}
				vertex = sortVector(geometry, vertex, 'y');
				break;
			}
			case 'north': {
				for(i = 0; i < geometry.vertices.length; i++) {
					if ((geometry.vertices[i].y === geometry.boundingBox.max.y) && (geometry.vertices[i].z != 0))
						vertex.push(i);
				}
				vertex = sortVector(geometry, vertex, 'x');
				break;
			}
			case 'south': {
				for(i = 0; i < geometry.vertices.length; i++) {
					if ((geometry.vertices[i].y === geometry.boundingBox.min.y) && (geometry.vertices[i].z != 0))
						vertex.push(i);
				}
				vertex = sortVector(geometry, vertex, 'x');
				break;
			}			
		}
		return vertex;
	} else {
		//console.log("[PFC my_cesium_mesh.js]: Error cesium bounding box geometry.");
		$( "#dialog-cesium" ).dialog( "open" );
		//createTerrain();
		//window.open("./PFCMyMesh.html", "_self");
	}
}

function createTerrain() {
	var i, j;
	if (rectangle_tiles[0].geometry) {
		console.log('[PFC my_cesium_mesh.js]: Geometries created in rectangle_tiles');
		var rectangle = maxMinTileXY();
		//Add initial geometry.
		var x = 0, y = 0; z = 0;
		var geometry;
		//Name actually file gpx.
		var name = sessionStorage.rute.substring(sessionStorage.rute.indexOf("/") + 1, sessionStorage.rute.length);
		var texture, material;
		for(i = rectangle[0][0]; i <= rectangle[1][0]; i++) {
			for(j = rectangle[1][1]; j >= rectangle[0][1]; j--) {
			    //texture = THREE.ImageUtils.loadTexture("textures/" + name.substring(0, name.indexOf(".")) + b + ".png");
				//material = new THREE.MeshBasicMaterial( { map: texture, wireframe: false, side:THREE.DoubleSide } );
				material = new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: true ,side:THREE.DoubleSide} );
				console.log("Tile ("+ i + "," + j + ")");
				geometry = getGeometry(i,j);
				addGeometryScene(geometry, x, y, z, material);
				y = y + 33;
			}
			y = 0;
			x = x + 33;
			west = true;
		}
		/*	--------------------------------------------------------------------------------------------------------
			Show the combined geometry.
		*/
		showCombinedGeometry();
	} else {
		setTimeout(createTerrain, 10);
	}
}

function showCombinedGeometry() {
	$( "#dialog-geometry" ).dialog( "open" );
	/*
	if (quotient > 0) {
		console.log("[PFC my_cesium_mesh.js]: quotient to bigger " + quotient);
		for(i = 0; i < combined_geometry.vertices.length; i++) {
			combined_geometry.vertices[i].z = combined_geometry.vertices[i].z / (quotient * 1000) ;
		}
	}
	*/
	var rectangle = maxMinTileXY();
	var columns = 0, rows = 0;
	for(var i = rectangle[0][0]; i <= rectangle[1][0]; i++) {
		columns++;
	}
	for(var j = rectangle[1][1]; j >= rectangle[0][1]; j--) {
			rows++;
	}
	var name = sessionStorage.rute.substring(sessionStorage.rute.indexOf("/") + 1, sessionStorage.rute.length);
	var file_name = name.substring(0, name.indexOf("."));
	var xhr = new XMLHttpRequest();
	var url = "createImage.php";
	var contenido = "rows="+rows+"&columns="+columns+"&name="+file_name;
	//var contenido = "direction="+direction+"&name="+file_name + index;
	xhr.open("GET", url+"?"+contenido, true);
	xhr.send();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			console.log("[PFC my_cesium_mesh.js] Texture create in " + xhr.responseText);
			/*
			var material = new THREE.MeshFaceMaterial(materials);
			var mesh = new THREE.Mesh(combined, material);
			scene.add(mesh);
			*/
			
			var texture, material, mesh;
			texture = THREE.ImageUtils.loadTexture(xhr.responseText);
			combined_geometry = addFaceVertexUvs(combined_geometry);
			combined_geometry = addBase(combined_geometry);
			material = new THREE.MeshBasicMaterial( { map: texture, wireframe: false, side:THREE.DoubleSide} );
			mesh = new THREE.Mesh(combined_geometry, material);
			mesh.rotation.x =  Math.PI / 180 * (-90);
			scene.add(mesh);
			
			$( "#dialog-geometry" ).dialog( "close" );
		}
	}
}
/*
	Add geometry to scene.
*/
function addGeometryScene(geometry, x, y, z, material) {
	materials.push(material);
	if (!geometry) {
		$( "#dialog-cesium" ).dialog( "open" );
		//createTerrain();
		//window.open("./PFCMyMesh.html", "_self");
	}
	var copy_geometry = geometry.clone();
	for(var i = 0; i < copy_geometry.faces.length; i++) {
		copy_geometry.faces[i].materialIndex = 0;
	}
	var tile = new THREE.Mesh(geometry);
	//tile.rotation.x =  Math.PI / 180 * (-90);
	tile.position.set(x, y, z);
	tile.updateMatrix();
	combined.merge(tile.geometry, tile.matrix, index_material);
	index_material++;
	//geometry = addFaceVertexUvs(geometry)
	var mesh = new THREE.Mesh( geometry, material );
	//mesh.rotation.x =  Math.PI / 180 * (-90);
	mesh.position.set(x, y, z);
	
	mesh.updateMatrix();
	combined_geometry.merge(mesh.geometry, mesh.matrix);
	//scene.add(mesh);	
	
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
	var new_height;
	for(var i=0; i < heights.length; i++) {
			//geometry.vertices.push( new THREE.Vector3(Math.round(xx[i]/scale),Math.round(yy[i]/scale),Math.round(heights[i]/scale)));
			new_height = (((data._maximumHeight - data._minimumHeight) * heights[i]) / 32767) + data._minimumHeight;
			geometry.vertices.push( new THREE.Vector3(Math.round(xx[i]/scale),Math.round(yy[i]/scale), new_height/30));
	}	
	for(var i=0; i < facesQuantized.length; i=i+3)
		geometry.faces.push(new THREE.Face3(facesQuantized[i], facesQuantized[i+1], facesQuantized[i+2]));
	rectangle_tiles[index_tile].geometry = geometry;
	
	//geometry = addFaceVertexUvs(geometry);
	//geometry = addBase(geometry);
	//geometry = addFaceVertexUvs(geometry);	
}


	
	