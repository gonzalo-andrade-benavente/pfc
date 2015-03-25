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
			console.log("[PFC my_cesium_rute.js]: Cesium Server Terrain Provider ready");
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
	var id_maps = new Array('gonzalito.lfk6po14', 'gonzalito.k53kcf3d', 'gonzalito.k53e4462','gonzalito.k53h65oo', 'gonzalito.78706231');
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
		console.log("[PFC my_cesium_rute.js]: Total coordinates " + coord.length);
		coordinates = coord;
		checkTile(coordinates, 14);
		rectangle_tiles = createRectangle(info_tiles, 14);
		loadGpx();
	}
	/*
		Draw rute gpx in map.
	*/
	function loadGpx() {
	//Añadimos la ruta a través del método omnivore, se podría dibujar la línea como polyline.
		/*
		var gpxLayer = omnivore.gpx(sessionStorage.rute)
		.on('ready', function() {
			//var bounds = [[info_tiles[0].bounds[0][0], info_tiles[0].bounds[0][1]], [info_tiles[info_tiles.length-1].bounds[1][0], info_tiles[info_tiles.length-1].bounds[1][1]]];
			var bounds = [[info_tiles[0].bounds[0][0], info_tiles[0].bounds[0][1]], [info_tiles[info_tiles.length-1].bounds[1][0], info_tiles[info_tiles.length-1].bounds[1][1]]];
			map.fitBounds(bounds);
			map.setZoom(14);
			console.log("[PFC my_cesium_rute.js]: TileCesium in Mapbox set bounds.");
		})
		.on('error', function() {
			alert('[PFC my_cesium_rute.js]: Error loaded omnivore file gpx');
		// fired if the layer can't be loaded over AJAX
		// or can't be parsed
		})
		.addTo(map);
		*/
		var bounds = [[info_tiles[0].bounds[0][0], info_tiles[0].bounds[0][1]], [info_tiles[info_tiles.length-1].bounds[1][0], info_tiles[info_tiles.length-1].bounds[1][1]]];
		map.fitBounds(bounds);
		map.setZoom(14);
		
		var polyline = L.polyline(coordinates, { color: 'red'}).addTo(map);
	}
	
	function drawRute(){
		console.clear();
		var i, j, bounds, out_bounds = 0, static_image_json;
		var coordinate_out, polyline;
		var json_coordinates = new Array(), reverse_line_points = new Array();
		var url = new Array();
		var polyline;
		var width = 509, height = 702;
		var zoom_map = 16;
		var name = sessionStorage.rute.substring(sessionStorage.rute.indexOf("/") + 1, sessionStorage.rute.length);
		var file_name = name.substring(0, name.indexOf("."));
		var coordinate_after, coordinate_before;
		var fails, fails_total;
		
		if (coordinates.length < 1000)
			fails_total = 1000;
		else if (coordinates > 2000)
			fails_total = 2000;
		else
			fails_total = 100;
		 
		for (i = 0; i < rectangle_tiles.length; i++) {
		//for (i = 3; i < 4; i++) {
		json_coordinates = new Array();
		reverse_line_points = new Array();
		out_bounds = 1;
		fails = 0;
			//Mesh with coordinates.
			if ( (rectangle_tiles[i].coordinate[0] != 0) && (rectangle_tiles[i].coordinate[1] != 0) ) {
				//Add coordinate of previous tile.
				if (rectangle_tiles[i].index != 0) {
					coordinate_after = coordinates[rectangle_tiles[i].index-1];
					json_coordinates.push(coordinate_after);
				}
				L.mapbox.featureLayer({
					type: 'Feature',
					geometry: {	type: 'Point',	coordinates: [  coordinates[rectangle_tiles[i].index][1],  coordinates[rectangle_tiles[i].index][0] ]	}	
				}).addTo(map);
				for(j = rectangle_tiles[i].index; j < coordinates.length; j++) {
					if ((coordinates[j][0] < rectangle_tiles[i].bounds[0][0]) && (coordinates[j][0] > rectangle_tiles[i].bounds[1][0]) && (coordinates[j][1] > rectangle_tiles[i].bounds[0][1]) && (coordinates[j][1] < rectangle_tiles[i].bounds[1][1])) {
						out_bounds = 0;
						json_coordinates.push(coordinates[j]);
					} else {
						//in - out
						if (out_bounds == 0) {
							if (fails < fails_total) {
								json_coordinates.push(coordinates[j]);
								fails++;
							}
						}
					}
				}
				if (json_coordinates.length > 0) {
					bounds = [[rectangle_tiles[i].bounds[0][0], rectangle_tiles[i].bounds[0][1]], [rectangle_tiles[i].bounds[1][0], rectangle_tiles[i].bounds[1][1]]];
					L.rectangle(bounds, {color: "#0C14F7", weight: 2, fillOpacity:0 }).addTo(map);
					map.setMaxBounds(bounds);
					//If a coordinate before.
					if ((rectangle_tiles[i].index + json_coordinates.length) < coordinates.length)
						coordinate_before = coordinates[rectangle_tiles[i].index + json_coordinates.length];
					polyline = L.polyline(json_coordinates, { color: 'red'}).addTo(map);
					for(j=0; j < json_coordinates.length; j++) 
							reverse_line_points.push([json_coordinates[j][1], json_coordinates[j][0]]);		
					while (reverse_line_points.length > 120) 
							reverse_line_points = fixCoordinates(reverse_line_points);							
					coordinate_after = 0;
					coordinate_before = 0;
					var geo_json = { "type": "Feature",	 "properties": 	{ "stroke": "#ff0000", "stroke-width": 5},
														 "geometry": 	{ "type": "LineString", "coordinates": reverse_line_points}
					};
					encode_json = JSON.stringify(geo_json);
					encode_json_uri = encodeURIComponent(encode_json);
					if (id_map == -1) 
						static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_maps.length-1]+'/geojson('+encode_json_uri+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom_map +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
					else 
						static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_map]+'/geojson('+encode_json_uri+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom_map +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;	
					console.log(i + " - " + static_image_json);
					url.push(new Request(static_image_json, file_name+i));
				}
				
			} else {
				//Some tile have rute.
				if (rectangle_tiles[i].index != 0) {
					coordinate_after = coordinates[rectangle_tiles[i].index-1];
					json_coordinates.push(coordinate_after);
				}
				for(j = rectangle_tiles[i].index; j < coordinates.length; j++) {
					if ((coordinates[j][0] <= rectangle_tiles[i].bounds[0][0]) && (coordinates[j][0] >= rectangle_tiles[i].bounds[1][0]) && (coordinates[j][1] >= rectangle_tiles[i].bounds[0][1]) && (coordinates[j][1] <= rectangle_tiles[i].bounds[1][1])) {
						out_bounds = 0;
						json_coordinates.push(coordinates[j]);
					} else {
						//in - out
						if (out_bounds == 0) { 
							if (fails < fails_total) {
								json_coordinates.push(coordinates[j]);
								fails++;
							}
						}
					}
				}
				if (json_coordinates.length > 0) {
					bounds = [[rectangle_tiles[i].bounds[0][0], rectangle_tiles[i].bounds[0][1]], [rectangle_tiles[i].bounds[1][0], rectangle_tiles[i].bounds[1][1]]];
					L.rectangle(bounds, {color: "#0C14F7", weight: 2, fillOpacity:0 }).addTo(map);
					map.setMaxBounds(bounds);
					if ((rectangle_tiles[i].index + json_coordinates.length) < coordinates.length)
						coordinate_before = coordinates[rectangle_tiles[i].index + json_coordinates.length + 1];
					polyline = L.polyline(json_coordinates, { color: 'red'}).addTo(map);
					for(j=0; j < json_coordinates.length; j++) 
							reverse_line_points.push([json_coordinates[j][1], json_coordinates[j][0]]);		
					while (reverse_line_points.length > 120) 
							reverse_line_points = fixCoordinates(reverse_line_points);						
					coordinate_after = 0;
					coordinate_before = 0;
					var geo_json = { "type": "Feature",	 "properties": 	{ "stroke": "#ff0000", "stroke-width": 5},
														 "geometry": 	{ "type": "LineString", "coordinates": reverse_line_points}
					};
					encode_json = JSON.stringify(geo_json);
					encode_json_uri = encodeURIComponent(encode_json);
					if (id_map == -1) 
						static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_maps.length-1]+'/geojson('+encode_json_uri+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom_map +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
					else 
						static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_map]+'/geojson('+encode_json_uri+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom_map +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;	
					console.log(i + " - " + static_image_json);
					url.push(new Request(static_image_json, file_name+i));
				} else {
					//Without coordinates
					bounds = [[rectangle_tiles[i].bounds[0][0], rectangle_tiles[i].bounds[0][1]], [rectangle_tiles[i].bounds[1][0], rectangle_tiles[i].bounds[1][1]]];
					L.rectangle(bounds, {color: "#0C14F7", weight: 2, fillOpacity:0 }).addTo(map);
					map.setMaxBounds(bounds);
					if (id_map == -1) 
						static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_maps.length-1]+'/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom_map +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
					else 
						static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_map]+'/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom_map +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
					console.log(i + " - " + static_image_json);
					url.push(new Request(static_image_json, file_name+i));
				}
			}
		}
		
		//window.open("./PFCMyMesh.html", "_self");
		
		/*
		//Only one call with all the information in array.
		var formData = new FormData();
		//formData.append('information',JSON.stringify(url));
		formData.append('information',JSON.stringify(url));
		var xhr2 = new XMLHttpRequest();
			xhr2.open("POST", 'getTexture.php', true);
			xhr2.upload.onprogress = function (evt) {
				$( "#dialog-message" ).dialog("open");
			}
			xhr2.onload = function () {
				$( "#dialog-message" ).dialog( "close" );
				window.open("./PFCMyMesh.html", "_self");
			}
			xhr2.send(formData);
			xhr2.onreadystatechange = function () {
				if (xhr2.readyState == 4 && xhr2.status == 200) {
					console.log(xhr2.responseText);
					//window.open("./PFCMyMesh.html", "_self");
				}
			}
		*/
	}	
	
	function drawAdvanced() {
		var name = sessionStorage.rute.substring(sessionStorage.rute.indexOf("/") + 1, sessionStorage.rute.length);
		var file_name = name.substring(0, name.indexOf("."));
		console.log("[PFC my_cesium_rute.js]: Draw advanced");	
		var i, j, a, b;
		//Coordinate after
		var coordinate_before;
		//fails, only one time can draw out.
		var fails = 1, total_fails;
		var json_coordinates = new Array();
		var reverse_line_points = new Array();
		var encode_json, encode_json_uri, static_image_json;
		//var width = 510, height = 697;
		var width = 509, height = 702;
		var zoom_map = 16;
		var url = new Array();
		
		if (coordinates.length < 1000)
			fails_total = 1000;
		else if (coordinates > 2000)
			fails_total = 2000;
		else
			fails_total = 100;
		
		if (rectangle_tiles.length > 0) {
			for(i = 0; i < rectangle_tiles.length; i++) {
				json_coordinates = new Array();
				reverse_line_points = new Array();
				coordinate_before = true;
				fails = 1;
				var bounds = [[rectangle_tiles[i].bounds[0][0], rectangle_tiles[i].bounds[0][1]], [rectangle_tiles[i].bounds[1][0], rectangle_tiles[i].bounds[1][1]]];
				map.setMaxBounds(bounds);
				//L.rectangle(bounds, {color: "#0C14F7", weight: 2, fillOpacity:0 }).addTo(map);
				
				//If no coordinate, some mesh have route.
				if ((rectangle_tiles[i].coordinate[0] == 0) && (rectangle_tiles[i].coordinate[1] == 0)) {
					//Texture whitout rute.
					for(j = 0; j < coordinates.length; j++) {
						if ((coordinates[j][0] < rectangle_tiles[i].bounds[0][0]) && (coordinates[j][0] > rectangle_tiles[i].bounds[1][0]) && (coordinates[j][1] > rectangle_tiles[i].bounds[0][1]) && (coordinates[j][1] < rectangle_tiles[i].bounds[1][1])) {
							json_coordinates.push(coordinates[j]);
						}
					}
					if (json_coordinates.length > 0) {
						var polyline_options = { color: 'red'};
						var polyline = L.polyline(json_coordinates, polyline_options).addTo(map);			
						for(j=0; j < json_coordinates.length; j++) 
							reverse_line_points.push([json_coordinates[j][1], json_coordinates[j][0]]);
						while (reverse_line_points.length > 120) 
							reverse_line_points = fixCoordinates(reverse_line_points);
						var geo_json = { "type": "Feature",	 "properties": 	{ "stroke": "#ff0000", "stroke-width": 5},
															 "geometry": 	{ "type": "LineString", "coordinates": reverse_line_points}
						};
						encode_json = JSON.stringify(geo_json);
						encode_json_uri = encodeURIComponent(encode_json);
						if (id_map == -1) 
							static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_maps.length-1]+'/geojson('+encode_json_uri+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom_map +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
						else 
							static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_map]+'/geojson('+encode_json_uri+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom_map +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;	
						url.push(new Request(static_image_json, file_name+i));
						json_coordinates = new Array();
					} else {
						if (id_map == -1) 
							static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_maps.length-1]+'/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom_map +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
						else 
							static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_map]+'/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom_map +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
					}
					url.push(new Request(static_image_json, file_name+i));
					//getTexture(static_image_json, i);
				} else {
					//console.log("[PFC my_cesium_rute.js]: Contains coordinates.");
					for(j = rectangle_tiles[i].index; j < coordinates.length; j++){
						//If route is in the mesh.
						if ((coordinates[j][0] < rectangle_tiles[i].bounds[0][0]) && (coordinates[j][0] > rectangle_tiles[i].bounds[1][0]) && (coordinates[j][1] > rectangle_tiles[i].bounds[0][1]) && (coordinates[j][1] < rectangle_tiles[i].bounds[1][1])) {
							//The coordinate before.
							if (coordinate_before) {
								if (j > 0) {
									json_coordinates.push(coordinates[j-1]);
									coordinate_before = false;
								}
							}
							json_coordinates.push(coordinates[j]);
						} else {
							//If one point out from the mesh.
							coordinate_before = true;
							//Only one mistake.
							if (fails < fails_total ) {
								json_coordinates.push(coordinates[j]);
								for(a=0; a < json_coordinates.length; a++) 
									reverse_line_points.push([json_coordinates[a][1], json_coordinates[a][0]]);	
								fails++;
							} 
							var polyline_options = { color: 'red'};
							var polyline = L.polyline(json_coordinates, polyline_options).addTo(map);
							/*
							while (reverse_line_points.length > 120) 
								reverse_line_points = fixCoordinates(reverse_line_points);
								
							var geo_json = { "type": "Feature",	 "properties": 	{ "stroke": "#ff0000", "stroke-width": 5},
																 "geometry": 	{ "type": "LineString", "coordinates": reverse_line_points}
							};
							encode_json = JSON.stringify(geo_json);
							encode_json_uri = encodeURIComponent(encode_json);
							if (id_map == -1) 
								static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_maps.length-1]+'/geojson('+encode_json_uri+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom_map +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
							else 
								static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_map]+'/geojson('+encode_json_uri+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom_map +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;	
							url.push(new Request(static_image_json, file_name+i));
							*/
							json_coordinates = new Array();
						}
					}
					//Union with the next tile.
					
					if(json_coordinates.length > 0) {					
						var polyline_options = { color: 'red'};
						var polyline = L.polyline(json_coordinates, polyline_options).addTo(map);
						for(j=0; j < json_coordinates.length; j++) 
							reverse_line_points.push([json_coordinates[j][1], json_coordinates[j][0]]);
						console.log(json_coordinates.length);
						while (reverse_line_points.length > 120) 
							reverse_line_points = fixCoordinates(reverse_line_points);
						var geo_json = { "type": "Feature",	 "properties": 	{ "stroke": "#ff0000", "stroke-width": 5},
															 "geometry": 	{ "type": "LineString", "coordinates": reverse_line_points}
						};
						encode_json = JSON.stringify(geo_json);
						encode_json_uri = encodeURIComponent(encode_json);
						if (id_map == -1) 
							static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_maps.length-1]+'/geojson('+encode_json_uri+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom_map +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
						else 
							static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_map]+'/geojson('+encode_json_uri+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom_map +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;	
						url.push(new Request(static_image_json, file_name+i));
						//getTexture(static_image_json, i);
					}  else {
						while (reverse_line_points.length > 120) 
							reverse_line_points = fixCoordinates(reverse_line_points);						
						var geo_json = { "type": "Feature",	 "properties": 	{ "stroke": "#ff0000", "stroke-width": 5},
															 "geometry": 	{ "type": "LineString", "coordinates": reverse_line_points}
						};
						encode_json = JSON.stringify(geo_json);
						encode_json_uri = encodeURIComponent(encode_json);
						if (id_map == -1) 
							static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_maps.length-1]+'/geojson('+encode_json_uri+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom_map +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
						else 
							static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_map]+'/geojson('+encode_json_uri+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom_map +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;	
						url.push(new Request(static_image_json, file_name+i));
						//getTexture(static_image_json, i);
					}
					
				}
			}
		}
		
		
		//Only one call with all the information in array.
		var formData = new FormData();
		//formData.append('information',JSON.stringify(url));
		formData.append('information',JSON.stringify(url));
		var xhr2 = new XMLHttpRequest();
			xhr2.open("POST", 'getTexture.php', true);
			xhr2.upload.onprogress = function (evt) {
				$( "#dialog-message" ).dialog("open");
			}
			xhr2.onload = function () {
				$( "#dialog-message" ).dialog( "close" );
				window.open("./PFCMyMesh.html", "_self");
			}
			xhr2.send(formData);
			xhr2.onreadystatechange = function () {
				if (xhr2.readyState == 4 && xhr2.status == 200) {
					console.log(xhr2.responseText);
					//window.open("./PFCMyMesh.html", "_self");
				}
			}
	}
	

	
	function showTiles(tile){
		/*
		for(i = 0; i < info_tiles.length; i++) {
			var bounds = [[info_tiles[i].bounds[0][0], info_tiles[i].bounds[0][1]], [info_tiles[i].bounds[1][0], info_tiles[i].bounds[1][1]]];
			L.rectangle(bounds, {color: "#F70C0C", weight: 2, fillOpacity:0 }).addTo(map);
		}
		*/
		
		for(i = 0; i < rectangle_tiles.length; i++) {
			var bounds = [[rectangle_tiles[i].bounds[0][0], rectangle_tiles[i].bounds[0][1]], [rectangle_tiles[i].bounds[1][0], rectangle_tiles[i].bounds[1][1]]];
			L.rectangle(bounds, {color: "rgb(0,255,0)", weight: 2, fillOpacity:0 }).addTo(map);
		}
		
		reverse_line_points = new Array();
		var polyline = L.polyline(coordinates, { color: 'blue'}).addTo(map);
		//for (i = 0; i < coordinates.length; i++)
		
		
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
		var name = sessionStorage.rute.substring(sessionStorage.rute.indexOf("/") + 1, sessionStorage.rute.length);
		var file_name = name.substring(0, name.indexOf("."));
		if (xhr2.upload) {
			console.log(direction);
			var url = "getTexture.php";
			var contenido = "direction="+direction+"&name="+file_name + index;
			xhr2.open("GET", url+"?"+contenido, false);
			/*
			xhr2.onreadystatechange = function () {
				if (xhr2.readyState == 4 && xhr2.status == 200) {
					if (parseInt(xhr2.responseText) != rectangle_tiles.length)
						drawAdvanced();
					else {
						console.log("[PFC my_cesium_rute.js]: All textures creates successfully");
						window.open("./PFCMyMesh.html", "_self");
					}
				}
			}
			*/
			xhr2.send();
		}
	}
	
	function Request(direction, name) {
		this.direction = direction;
		this.name = name;
	}
	