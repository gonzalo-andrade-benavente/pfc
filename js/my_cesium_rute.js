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
			console.log("[PFC]:Cesium Server Terrain Provider ready");
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
	L.mapbox.accessToken = 'pk.eyJ1IjoiZ29uemFsaXRvIiwiYSI6IlVJTGIweFUifQ.waoF7m8PZbBM6u8Tg_rR7A';
	var final_bounds;


	function getRute() {
		if (xhr.upload) {
			var url = "getRute.php";
			var contenido = "rute="+sessionStorage.rute;
			xhr.open("GET", url+"?"+contenido, true);
			xhr.send();
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					if (xhr.responseText != "") {
						createMap(JSON.parse(xhr.responseText));
					}else {
						console.log("[PFC]: Error donwload rute gpx Ajax.");
					}
					
				}
			}
		}
	}
	
	function createMap(coord) {
		map = L.mapbox.map('map', id_maps[id_map]);
		//map.setZoom(14);
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
			//fitBounds pone el máximo zoom posible para la ruta.
			var positionLonLat, positionTileXY, tile;
			positionLonLat = Cesium.Cartographic.fromDegrees(coordinates[0][1], coordinates[0][0]);
			//positionLonLat = Cesium.Cartographic.fromDegrees(coordinates[coordinates.length-1][1], coordinates[coordinates.length-1][0]);
			positionTileXY = aCesiumTerrainProvider.tilingScheme.positionToTileXY(positionLonLat,12);
			tile = getTile(positionTileXY);
			/*
				Map Rectangle for the first coordinate, study the rest of coordinates.
				North-West and South-East
			*/
			var bounds = [[tile.northwest.latitude, tile.northwest.longitude], [tile.southeast.latitude, tile.southeast.longitude]];
			L.rectangle(bounds, {color: "#ffffff", weight: 2, fillOpacity:0 }).addTo(map);
			//map.setZoom(13);
			var map_bounds = [[bounds[0][0], bounds[0][1]],[final_bounds[1][0], final_bounds[1][1]]];
			//L.rectangle(map_bounds, {color: "#DFFA12", weight: 2, fillOpacity:0 }).addTo(map);
			//map.fitBounds(map_bounds);
			map.setMaxBounds(bounds);
			//map.setMaxBounds(map_bounds);
			console.log("[PFC]:TileCesium in Mapbox set bounds.");
			
		})
		.on('error', function() {
			alert('[PFC]: Error loaded omnivore file gpx');
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
		var polyOptions = { strokeColor: '#000000',	strokeOpacity: 1.0,	strokeWeight: 3};
		poly = new google.maps.Polyline(polyOptions);
		poly.setMap = map;
		var path = poly.getPath();
		for(var i=0; i < coordinates.length  ; i++){
			var myLatlng = new google.maps.LatLng(coordinates[i][0], coordinates[i][1]);
			path.push(myLatlng);
		}
		var encodeString = google.maps.geometry.encoding.encodePath(path);
		var width = 504, height = 630;	
		//var width = 2000, height = 2000;		
		// Static image contain url to mapbox rute.
		// Control ZOOM!!
		if (id_map == -1)
			var staticImage = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_maps.length-1]+'/path-4+026-0.75('+encodeString+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ map.getZoom() +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
		else
			var staticImage = 'https://api.tiles.mapbox.com/v4/'+id_maps[id_map]+'/path-4+026-0.75('+encodeString+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ map.getZoom() +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
		getTexture(staticImage);
	}

	/*
		Change layer map Mapbox.
	*/
	function changeMap() {
		map.remove();
		id_map++;
		map = L.mapbox.map('map', id_maps[id_map]);
		//map.setZoom(14);
		loadGpx();
		if (id_map == (id_maps.length-1))
			id_map = -1;
	}
	/*
		Ajax to create texture.
	*/
	function getTexture(direction) {
		if (xhr1.upload) {
			var name = sessionStorage.rute.substring(sessionStorage.rute.indexOf("/") + 1, sessionStorage.rute.length);
			var file_name = name.substring(0, name.indexOf("."));
			sessionStorage.name = file_name;
			var url = "getTexture.php";
			console.log(file_name);
			var contenido = "direction="+direction+"&name="+file_name;
			xhr.open("GET", url+"?"+contenido, true);
			xhr.send();
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					if (xhr.responseText == "") {
						window.open("./PFCMyMesh.html", "_self");
					}
					else {
						console.log("[PFC]: Error upload texture Ajax.");
					}
				}
			}
		}
	}
	/*
		Check coordinates in Tile Cesium(limits nw ne sw se).
		Save in sessionStorage the tiles.
	*/
	function checkTile(coord) {
		//var array_coordinate = new Array();
		var pos, compare_pos, positionLonLat, initial_pos;
		var north = 0, south = 0, east = 0, west = 0;
		//array_coordinate.push(new Coordinate(coord[0][0], coord[0][1]));
		positionLonLat = Cesium.Cartographic.fromDegrees(coord[0][1], coord[0][0]);
		pos = aCesiumTerrainProvider.tilingScheme.positionToTileXY(positionLonLat,12);
		initial_pos = pos;
		for(var i=1; i < coord.length; i++){
			positionLonLat = Cesium.Cartographic.fromDegrees(coord[i][1], coord[i][0]);
			compare_pos = aCesiumTerrainProvider.tilingScheme.positionToTileXY(positionLonLat,12);
			if (pos.x != compare_pos.x) {
				//array_coordinate.push(new Coordinate(coord[i][0], coord[i][1]));
				//console.log("[PFC]: Coordinate change:"+i);
				if (pos.x < compare_pos.x)
					east = east + 1;
				else
					west = west + 1;
				pos = compare_pos;
			} else if (pos.y != compare_pos.y) {
				//array_coordinate.push(new Coordinate(coord[i][0], coord[i][1]));
				//console.log("Coordinate change:"+i);
				if (pos.y < compare_pos.y)
					south = south + 1;
				else
					north = north + 1;
				pos = compare_pos;
			}
		}
		
		/*
			Check the variable and draw more rectangle.
		*/
		moreMesh(west, initial_pos, "w");
		moreMesh(east, initial_pos, "e");
		moreMesh(north, initial_pos, "n");
		moreMesh(south, initial_pos, "s");
		//console.log("[PFC]: Total coordinates:" + coord.length);
		//console.log("[PFC]: west:"+west+"/east:"+east+"/north:"+north+"/south:"+south);
	}
	
	function moreMesh(contador, tile, cardinalidad) {
		var new_tile, bounds, map_bounds;
		if(contador != 0) {
			//console.log("[PFC]: Initial Tile: X:" + tile.x + " Y:" + tile.y);
			switch(cardinalidad) {
				case "w":	
							//console.log("[PFC]: West");
							while(contador != 0) {
								tile.x--;
								new_tile = getTile(tile);
								bounds = [[new_tile.northwest.latitude, new_tile.northwest.longitude], [new_tile.southeast.latitude, new_tile.southeast.longitude]];
								L.rectangle(bounds, {color: "#191414", weight: 2, fillOpacity:0 }).addTo(map);
								contador--;
							}
							break;
				case "e":
							//console.log("[PFC]: East");
							while(contador != 0) {
								tile.x++;
								new_tile = getTile(tile);
								bounds = [[new_tile.northwest.latitude, new_tile.northwest.longitude], [new_tile.southeast.latitude, new_tile.southeast.longitude]];
								L.rectangle(bounds, {color: "#191414", weight: 2, fillOpacity:0 }).addTo(map);
								contador--;
							}
							break;
				case "n":
							//console.log("[PFC]: North");
							while(contador != 0) {
								tile.y--;
								new_tile = getTile(tile);
								bounds = [[new_tile.northwest.latitude, new_tile.northwest.longitude], [new_tile.southeast.latitude, new_tile.southeast.longitude]];
								L.rectangle(bounds, {color: "#191414", weight: 2, fillOpacity:0 }).addTo(map);
								contador--;
							}
							break;
				case "s":
							//console.log("[PFC]: South");
							while(contador != 0) {
								tile.y++;
								new_tile = getTile(tile);
								bounds = [[new_tile.northwest.latitude, new_tile.northwest.longitude], [new_tile.southeast.latitude, new_tile.southeast.longitude]];
								L.rectangle(bounds, {color: "#191414", weight: 2, fillOpacity:0 }).addTo(map);
								contador--;
								final_bounds = bounds;
							}
							break;
			}
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

