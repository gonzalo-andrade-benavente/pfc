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

	var xhr = new XMLHttpRequest(), xhr1 = new XMLHttpRequest();
	var id_maps = new Array('gonzalito.k53kcf3d', 'gonzalito.k53e4462','gonzalito.k53h65oo', 'gonzalito.78706231');
	var map, id_map = 0;
	var coordinates;
	//L.mapbox.accessToken = 'pk.eyJ1IjoiZ29uemFsaXRvIiwiYSI6IlVJTGIweFUifQ.waoF7m8PZbBM6u8Tg_rR7A';
	var final_bounds;
	/*
		info_tiles contains all information about tiles of the rute gpx.
		Each element of the array is a InfoTile element.
	*/
	var info_tiles = new Array();
	var rectangle_tiles;
	/*
		Class to save x and y Cesium and bounds Cesium to Mapbox.
		Cardinality: c:center, w:west, e:east, n:north, s:south;
	*/
	function InfoTile(x, y, cardinality, northwest_latitude, northwest_longitude, southeast_latitude, southeast_longitude, longitude, latitude, index){
		this.x = x;
		this.y = y;
		this.bounds = [[northwest_latitude, northwest_longitude],[southeast_latitude, southeast_longitude]];
		this.cardinality = cardinality;
		/*
			Reverse, to create correctly GeoJson.
			Normal is [latitude, longitude];
		*/
		this.coordinate = [longitude, latitude];
		this.index = index;
	}
	
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
		map.on('mouse click', function(e) {
			console.log(e.containerPoint.toString() + ', ' + e.latlng.toString());
		});
		coordinates = coord;
		checkTile(coordinates, 14);
		rectangle_tiles = createRectangle(info_tiles);
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
		var gpxLayer = omnivore.gpx(sessionStorage.rute)
		.on('ready', function() {
			//var bounds = [[info_tiles[0].bounds[0][0], info_tiles[0].bounds[0][1]], [info_tiles[info_tiles.length-1].bounds[1][0], info_tiles[info_tiles.length-1].bounds[1][1]]];
			var bounds = [[info_tiles[0].bounds[0][0], info_tiles[0].bounds[0][1]], [info_tiles[info_tiles.length-1].bounds[1][0], info_tiles[info_tiles.length-1].bounds[1][1]]];
			//map.setMaxBounds(bounds);
			map.fitBounds(bounds);
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
		var width = 504, height = 630;
		if (rectangle_tiles.length > 0)
			//for(i = 0; i < info_tiles.length; i++) {
			for(i = 0; i < rectangle_tiles.length; i++) {
				bounds = [[rectangle_tiles[i].bounds[0][0], rectangle_tiles[i].bounds[0][1]], [rectangle_tiles[i].bounds[1][0], rectangle_tiles[i].bounds[1][1]]];
				map.setMaxBounds(bounds);
				zoom = 16;
				//if the image contain coordinate draw rute, else only with the bounds obtain image.
				if ((rectangle_tiles[i].coordinate[0] == 0) && (rectangle_tiles[i].coordinate[1] == 0)) {
					//without coordinates
					if (id_map == -1) 
						static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_maps.length-1]+'/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
					else 
						static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_map]+'/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
					console.log(static_image_json);
				} else {
					//with coordinates.
				}
				/*
				var reverse_line_points, long_array;
				var init, end;
				//One or more tiles.
				if (info_tiles.length > 1) {
					//All tiles minus last.
					if (i != info_tiles.length-1) {
						//Coordinates in that tile. info_tile[i].index is the first coordinate 
						//in that tile.
						long_array = info_tiles[i+1].index - info_tiles[i].index;
						init = info_tiles[i].index;
						end = info_tiles[i].index + long_array;
					} else {
						//Last tile.
						long_array = coordinates.length - info_tiles[i].index;
						init = info_tiles[i].index;
						end = coordinates.length;
					}			
				} else {
					long_array = line_points.length;
					init = 0;
					end = long_array;
				}
				
				//Invert the position to make draw the rute.
				reverse_line_points = new Array(long_array);	
				for(j = 0; j < reverse_line_points.length; j++) {
					reverse_line_points[j] = new Array(2);
					reverse_line_points[j][0] = line_points[init][1];
					reverse_line_points[j][1] = line_points[init][0];
					init++;
				}
				console.log("[PFC my_cesium_rute.js]: Mesh "+i+" coordinates "+reverse_line_points.length);
				//Modified change the size of array of coordinates.
				while (reverse_line_points.length > 122)
					reverse_line_points = modifiedCoordinates(reverse_line_points);
					
				console.log("[PFC my_cesium_rute.js]: Mesh "+i+" coordinates "+ reverse_line_points.length);
				
				var geo_json = {
					"type": "Feature",
					 "properties": {
						"stroke": "#fc4353",
						"stroke-width": 5
					},
					"geometry": {
						"type": "LineString",
						"coordinates": reverse_line_points
					}

				};
				var width = 504, height = 630;	
				var encode_json = JSON.stringify(geo_json);
				var encode_json_uri = encodeURIComponent(encode_json);
				//bounds = [[info_tiles[i].bounds[0][0], info_tiles[i].bounds[0][1]], [info_tiles[i].bounds[0][0], info_tiles[i].bounds[0][1]]];
				//map.setMaxBounds(bounds);
				zoom = 14;
				if (id_map == -1) 
					static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_maps.length-1]+'/geojson('+encode_json_uri+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
				else 
					static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_map]+'/geojson('+encode_json_uri+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
				
				console.log(static_image_json);
				
				bounds = [[info_tiles[i].bounds[0][0], info_tiles[i].bounds[0][1]], [info_tiles[i].bounds[1][0], info_tiles[i].bounds[1][1]]];
				map.setMaxBounds(bounds);
				zoom = 14;
				if (id_map == -1) 
					static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_maps.length-1]+'/geojson('+encode_json_uri+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
				else 
					static_image_json = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_map]+'/geojson('+encode_json_uri+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ zoom +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
				
				//Obtain texture file.
				//getTexture(encodeURIComponent(static_image_json), i, info_tiles[i].cardinality);
				//console.log(encodeURIComponent(static_image_json));
				//window.open("./PFCMyMesh.html", "_self");
			*/
			}
	}
	
	function modifiedCoordinates(coord) {
		var long_array;
		/*
			If size is odd add a new position, later the for end we have to treat the last value.
			Duplicate the last value.
		*/
		if ((coord.length%2) == 0)
			long_array = (coord.length/2);
		else
			long_array = ((coord.length+1)/2);
		var coord_change = new Array(long_array);
		var j = 0;
		for(i = 0; i < coord.length-1; i = i + 2) {
			coord_change[j] = new Array(2);
			coord_change[j][0] = (coord[i][1] + coord[i+1][1])/2;
			coord_change[j][1] = (coord[i][0] + coord[i+1][0])/2;
			j++;
		}
		if ((coord.length%2) == 1) {
			coord_change[j] = new Array(2);
			coord_change[j][0] = (coord[i][1] + coord[i][1])/2;
			coord_change[j][1] = (coord[i][0] + coord[i][0])/2;
			i++
		}
		
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
	function getTexture(direction, index, cardinality) {
		if (xhr1.upload) {
			var name = sessionStorage.rute.substring(sessionStorage.rute.indexOf("/") + 1, sessionStorage.rute.length);
			var file_name = name.substring(0, name.indexOf("."));
			//sessionStorage.name = file_name;
			var url = "getTexture.php";
			console.log(file_name);
			var contenido = "direction="+direction+"&name="+file_name + index + cardinality;
			xhr.open("GET", url+"?"+contenido, true);
			xhr.send();
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					if (xhr.responseText == "")
						console.log("[PFC my_cesium_rute.js]: Texture upload ok. ");
					else 
						console.log("[PFC my_cesium_rute.js]: Error upload texture Ajax.");
				window.open("./PFCMyMesh.html", "_self");
				}
			}
		}
	}