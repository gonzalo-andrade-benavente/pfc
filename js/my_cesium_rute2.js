/*  
		PFC my_rute.js Library: Mapbox and Ajax 
		This library uses functions in my_cesium.js
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
			console.log("[PFC my_cesium_rute.js]:Cesium Server Terrain Provider ready");
			var name = sessionStorage.rute.substring(sessionStorage.rute.indexOf("/") + 1, sessionStorage.rute.length);
			var file_name = name.substring(0, name.indexOf("."));
			sessionStorage.name = file_name;
			document.getElementById('file').innerHTML = "Trabajando con el fichero <i>gps</i> " + sessionStorage.name + ".gpx <a href='PFCIndex.html'>cambiar</a>";
			getRute();
		} else {
			//console.log("[PFC]:Waiting a Terrain Provider is ready");
			setTimeout(requestTilesWhenReady, 10);
		}
	}

	var xhr = new XMLHttpRequest(), xhr1 = new XMLHttpRequest(), xhr2 = new XMLHttpRequest();
	var id_maps = new Array('gonzalito.k53kcf3d', 'gonzalito.k53e4462','gonzalito.k53h65oo', 'gonzalito.78706231');
	var map, id_map = 0;
	var coordinates;
	//L.mapbox.accessToken = 'pk.eyJ1IjoiZ29uemFsaXRvIiwiYSI6IlVJTGIweFUifQ.waoF7m8PZbBM6u8Tg_rR7A';
	/*
		info_tiles contains all information about tiles of the rute gpx.
		Each element of the array is a InfoTile element.
	*/
	var info_tiles = new Array();
	var rectangle_tiles;
	
	function getRute() {
		if (xhr.upload) {
			var url = "getRute.php";
			var contenido = "rute="+sessionStorage.rute;
			xhr.open("GET", url+"?"+contenido, true);
			xhr.send();
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4 && xhr.status == 200) 
					if (xhr.responseText != "") 
						createMap(JSON.parse(xhr.responseText));
					else
						console.log("[PFC my_cesium_rute.js]: Error donwload rute gpx Ajax.");
			}
		}
	}
	
	function createMap(coord) {
		L.mapbox.accessToken = 'pk.eyJ1IjoiZ29uemFsaXRvIiwiYSI6IlVJTGIweFUifQ.waoF7m8PZbBM6u8Tg_rR7A';
		map = L.mapbox.map('map', id_maps[id_map]);
		//map.scrollWheelZoom.disable();
		console.log("[PFC my_cesium_rute.js] Total coordinates " + coord.length);
		coordinates = coord;
		checkTile(coordinates, 14);
		rectangle_tiles = createRectangle(info_tiles, 14);
		total_images = rectangle_tiles.lenght;
		//Draw the tiles from the rute more rectangle.
		for(i = 0; i < rectangle_tiles.length; i++) {
			var bounds = [[rectangle_tiles[i].bounds[0][0], rectangle_tiles[i].bounds[0][1]], [rectangle_tiles[i].bounds[1][0], rectangle_tiles[i].bounds[1][1]]];
			L.rectangle(bounds, {color: "#0C14F7", weight: 2, fillOpacity:0 }).addTo(map);
		}
		/*
		//Draw the tiles from the rute.
		for(i = 0; i < info_tiles.length; i++) {
			var bounds = [[info_tiles[i].bounds[0][0], info_tiles[i].bounds[0][1]], [info_tiles[i].bounds[1][0], info_tiles[i].bounds[1][1]]];
			L.rectangle(bounds, {color: "#F70C0C", weight: 2, fillOpacity:0 }).addTo(map);
		}
		*/
		//createRectangle();
		loadGpx();
	}
	/*
		Draw rute gpx in map.
	*/
	function loadGpx() {
	//Añadimos la ruta a través del método omnivore, se podría dibujar la línea como polyline.
			/*
			L.mapbox.featureLayer({	type: 'Feature', geometry: {
				type: 'Point',
				coordinates: [  coordinates[0][1], coordinates[0][0] ]
			},
			properties: {
				title: 'Initial point.',
			}
			}).addTo(map);
			*/
		var gpxLayer = omnivore.gpx(sessionStorage.rute)
		.on('ready', function() {
			//var bounds = [[info_tiles[0].bounds[0][0], info_tiles[0].bounds[0][1]], [info_tiles[info_tiles.length-1].bounds[1][0], info_tiles[info_tiles.length-1].bounds[1][1]]];
			var bounds = [[info_tiles[0].bounds[0][0], info_tiles[0].bounds[0][1]], [info_tiles[info_tiles.length-1].bounds[1][0], info_tiles[info_tiles.length-1].bounds[1][1]]];
			map.fitBounds(bounds);
			//map.setMaxBounds(bounds);
			map.setZoom(14);
			//map.setZoom(14);
			
			console.log("[PFC my_cesium_rute.js]:TileCesium in Mapbox set bounds.");
			
		})
		.on('error', function() {
			alert('[PFC my_cesium_rute.js]: Error loaded omnivore file gpx');
		// fired if the layer can't be loaded over AJAX
		// or can't be parsed
		})
		.addTo(map);
	}
	/*
		Create rute gpx point to polygin and create static image.
	*/
	function drawRute() {	
		var polyline_options = { color: '#000'};		
		var i,j;
		var line_points = new Array(coordinates.length);
		for(i = 0; i < coordinates.length; i++) {
			//Polyline map.
			line_points[i] = new Array(2);
			line_points[i][0] = coordinates[i][0];
			line_points[i][1] = coordinates[i][1];
		}
		//Draw polilyne on map.
		var polyline = L.polyline(line_points, polyline_options).addTo(map);
		//console.log("[PFC my_cesium_rute.js]: Total coordinates "+coordinates.length);
		var static_image_json;
		var width = 510, height = 697;
		var json_coordinates;
		var coordinate_before = true;
		var fails = 1;
		
		map.setZoom(16);
		if (rectangle_tiles.length > 0) {
			//for(i = 0; i < 1; i++) {
			console.log(coordinates.length);
			for(i = 0; i < rectangle_tiles.length ; i++) {
			
			}
			
		}
		//window.open("./PFCMyMesh.html", "_self");
	}
	/*
		Fixed coordinates if his length is bigger than 122.
	*/
	function fixCoordinates(coord) {
		var first = coord[0], last = coord[coord.length-1];
		var long_array = 0;
		if ((coord.length%2) == 0)
			long_array = (coord.length/2);
		else
			long_array = Math.round(coord.length/2);
		
		var coord_change = new Array(long_array);
		var j = 0, i;
		
		coord_change[j] = first;
		j++;
		for(i = 1; i < coord.length-1; i = i + 2) {
			coord_change[j] = coord[i];
			j++
		}
		coord_change[j-1] = last;
		return coord_change;
	}
	/*
		Change layer map Mapbox.
	*/
	function changeMap() {
		map.remove();
		id_map++;
		map = L.mapbox.map('map', id_maps[id_map]);
		map.setZoom(13);
		loadGpx();
		if (id_map == (id_maps.length-1))
			id_map = -1;
	}
	/*
		Ajax to create texture.
	*/
	function getTexture(direction, index) {
		if (xhr1.upload) {
			var name = sessionStorage.rute.substring(sessionStorage.rute.indexOf("/") + 1, sessionStorage.rute.length);
			var file_name = name.substring(0, name.indexOf("."));
			//sessionStorage.name = file_name;
			var url = "getTexture.php";
			var contenido = "direction="+direction+"&name="+file_name + index;
			xhr.open("GET", url+"?"+contenido, true);
			xhr.send();
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					
					if (parseInt(xhr.responseText) != rectangle_tiles.length)
						drawRute();
					else {
						console.log("[PFC my_cesium_rute.js]: All textures creates successfully");
						window.open("./PFCMyMesh.html", "_self");
					}
					
				}
			}
		}
	}
	