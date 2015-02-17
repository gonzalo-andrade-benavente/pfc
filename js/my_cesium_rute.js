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
		checkTile(coordinates);
		loadGpx();
	}
	/*
		Draw rute gpx in map.
	*/
	function loadGpx() {
	//Añadimos la ruta a través del método omnivore, se podría dibujar la línea como polyline.
		var gpxLayer = omnivore.gpx(sessionStorage.rute)
		.on('ready', function() {
			/*
			var positionLonLat, positionTileXY, tile;
			positionLonLat = Cesium.Cartographic.fromDegrees(coordinates[0][1], coordinates[0][0]);
			positionTileXY = aCesiumTerrainProvider.tilingScheme.positionToTileXY(positionLonLat,12);
			tile = getTile(positionTileXY);
			var bounds = [[tile.northwest.latitude, tile.northwest.longitude], [tile.southeast.latitude, tile.southeast.longitude]];
			L.rectangle(bounds, {color: "#ffffff", weight: 2, fillOpacity:0 }).addTo(map);
			var map_bounds = [[bounds[0][0], bounds[0][1]],[final_bounds[1][0], final_bounds[1][1]]];
			map.setZoom(14);
			map.setMaxBounds(bounds);
			*/
			var bounds = [[info_tiles[0].bounds[0][0], info_tiles[0].bounds[0][1]], [info_tiles[info_tiles.length-1].bounds[1][0], info_tiles[info_tiles.length-1].bounds[1][1]]];
			map.setMaxBounds(bounds);
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
		for(i = 0; i < info_tiles.length; i++) {
			var reverse_line_points, long_array;
			var init, end;
			/*
				One or more tiles.
			*/
			if (info_tiles.length > 1) {
				/*
					All tiles minus last.
				*/
				if (i != info_tiles.length-1) {
					/*
						Coordinates in that tile. info_tile[i].index is the first coordinate 
						in that tile.
					*/
					long_array = info_tiles[i+1].index - info_tiles[i].index;
					init = info_tiles[i].index;
					end = info_tiles[i].index + long_array;
				} else {
				/*
					Last tile.
				*/
					long_array = coordinates.length - info_tiles[i].index;
					init = info_tiles[i].index;
					end = coordinates.length;
				}			
			} else {
				long_array = line_points.length;
				init = 0;
				end = long_array;
			}
			
			/*
				Invert the position to make draw the rute.
			*/
			reverse_line_points = new Array(long_array);	
			for(j = 0; j < reverse_line_points.length; j++) {
				reverse_line_points[j] = new Array(2);
				reverse_line_points[j][0] = line_points[init][1];
				reverse_line_points[j][1] = line_points[init][0];
				init++;
			}
			console.log("[PFC my_cesium_rute.js]: Mesh "+i+" coordinates "+reverse_line_points.length);
			//Reduce the array without lose the route.
			while (reverse_line_points.length > 134)
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
			getTexture(encodeURIComponent(static_image_json), i, info_tiles[i].cardinality);
			//console.log(encodeURIComponent(static_image_json));
			//window.open("./PFCMyMesh.html", "_self");
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
	/*
		Check coordinates in Tile Cesium(limits nw ne sw se).
		Obtain all mesh from the rute gpx also we need to add more.
		Add all tiles into info_tiles ARRAY.
	*/
	function checkTile(coord) {
		//array_coordinate.push(new Coordinate(coord[0][0], coord[0][1]));
		var i, j,positionLonLat, positionTileXY, tile;
		positionLonLat = Cesium.Cartographic.fromDegrees(coord[0][1], coord[0][0]);
		positionTileXY = aCesiumTerrainProvider.tilingScheme.positionToTileXY(positionLonLat,12);
		tile = getTile(positionTileXY);
		info_tiles.push(new InfoTile(positionTileXY.x, positionTileXY.y, "c",tile.northwest.latitude, tile.northwest.longitude, tile.southeast.latitude, tile.southeast.longitude, coord[0][1], coord[0][0], 0));
		for (i = 1; i < coord.length; i ++) {
			var positionLonLat_actual, positionTileXY_actual;
			positionLonLat_actual = Cesium.Cartographic.fromDegrees(coord[i][1], coord[i][0]);
			positionTileXY_actual = aCesiumTerrainProvider.tilingScheme.positionToTileXY(positionLonLat_actual,12);
			if ((positionTileXY.x != positionTileXY_actual.x) || (positionTileXY.y != positionTileXY_actual.y)) {
				tile = getTile(positionTileXY_actual);
				if (positionTileXY.x < positionTileXY_actual.x)
					info_tiles.push(new InfoTile(positionTileXY_actual.x, positionTileXY_actual.y, "w",tile.northwest.latitude, tile.northwest.longitude, tile.southeast.latitude, tile.southeast.longitude, coord[i][1], coord[i][0], i));
				else if (positionTileXY.x > positionTileXY_actual.x)	
					info_tiles.push(new InfoTile(positionTileXY_actual.x, positionTileXY_actual.y, "e",tile.northwest.latitude, tile.northwest.longitude, tile.southeast.latitude, tile.southeast.longitude, coord[i][1], coord[i][0], i));
				else if (positionTileXY.y < positionTileXY_actual.y)
					info_tiles.push(new InfoTile(positionTileXY_actual.x, positionTileXY_actual.y, "s",tile.northwest.latitude, tile.northwest.longitude, tile.southeast.latitude, tile.southeast.longitude, coord[i][1], coord[i][0], i));
				else if (positionTileXY.y > positionTileXY_actual.y)
					info_tiles.push(new InfoTile(positionTileXY_actual.x, positionTileXY_actual.y, "n",tile.northwest.latitude, tile.northwest.longitude, tile.southeast.latitude, tile.southeast.longitude, coord[i][1], coord[i][0], i));
				positionTileXY = positionTileXY_actual;
			}
		}
		
		/*
			Remove repeat elements.
		*/
		
		var info_tiles_clone = info_tiles;
		for(i = 0; i < info_tiles_clone.length; i++) {
			var actual = info_tiles_clone[i];
			var pos = new Array();
			for(j = 0; j < info_tiles.length; j++){
				if ((actual.x == info_tiles[j].x) && (actual.y == info_tiles[j].y))
					pos.push(j);
			}
			/*
				is j=1 because the first never remove.
			*/
			for(j = 1; j < pos.length; j++)
				info_tiles.splice(pos[j],1);
		}
		/*
			Compare the two last.
		*/
		if (info_tiles.length > 1) 
			if ((info_tiles[info_tiles.length-1].x == info_tiles[info_tiles.length-2].x) && (info_tiles[info_tiles.length-1].y == info_tiles[info_tiles.length-2].y)) {
				info_tiles.splice(info_tiles.length-1,1);
			}

		
		for(i = 0; i < info_tiles.length; i++) {
			var bounds = [[info_tiles[i].bounds[0][0], info_tiles[i].bounds[0][1]], [info_tiles[i].bounds[1][0], info_tiles[i].bounds[1][1]]];
			L.rectangle(bounds, {color: "#191414", weight: 2, fillOpacity:0 }).addTo(map);
		}
		
		
	}
	
	/*
	##############################################################################################
	##############################  CESIUM  ######################################################
	##############################################################################################
	*/
	/*
		CLASS Tile
	*/
	function Tile(northeast, southeast, northwest, southwest) {
		this.northeast = northeast;
		this.southeast = southeast;
		this.northwest = northwest;
		this.southwest = southwest;
		this.distanceKm = ((northeast.latitude - southeast.latitude)/0.01)*1.1132;
		this.distanceCoordinate = northeast.latitude - southeast.latitude;
	}
	/*
		CLASS Cordinate
	*/
	function Coordinate(latitude, longitude) {
		this.latitude = latitude;
		this.longitude = longitude;
	}
	/*
		FUNCTION radians to degrees.
	*/
	function radianToDegrees(radians) {
		return (radians * 180)/ Math.PI;	
	}
	/*
		FUNCTION create a Tile Cesium Rectangle with vertices in degrees[latitude and longitude].
		sw: SouthWest, se:SouthEast, nw: NorthWest, ne:NorthEast. 
	*/
	function getTile(positionTileXY) {
		var myTile, sw, se, nw, ne;;
		var rectangleTileXY = aCesiumTerrainProvider.tilingScheme.tileXYToRectangle(positionTileXY.x, positionTileXY.y, 12);
		sw = new Coordinate(radianToDegrees(Cesium.Rectangle.southwest(rectangleTileXY).latitude),radianToDegrees(Cesium.Rectangle.southwest(rectangleTileXY).longitude));
		se = new Coordinate(radianToDegrees(Cesium.Rectangle.southeast(rectangleTileXY).latitude),radianToDegrees(Cesium.Rectangle.southeast(rectangleTileXY).longitude));
		nw = new Coordinate(radianToDegrees(Cesium.Rectangle.northwest(rectangleTileXY).latitude),radianToDegrees(Cesium.Rectangle.northwest(rectangleTileXY).longitude));
		ne = new Coordinate(radianToDegrees(Cesium.Rectangle.northeast(rectangleTileXY).latitude),radianToDegrees(Cesium.Rectangle.northeast(rectangleTileXY).longitude));
		myTile = new Tile(ne, se, nw, sw);
		return myTile;
	}

