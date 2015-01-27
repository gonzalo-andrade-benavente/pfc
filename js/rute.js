/* Ajax rute.js*/

var xhr = new XMLHttpRequest();
var idMaps = new Array('gonzalito.k53kcf3d', 'gonzalito.k53e4462', 'gonzalito.k53h65oo', 'gonzalito.78706231');
var map, idMap = 0;
var coordinates;
L.mapbox.accessToken = 'pk.eyJ1IjoiZ29uemFsaXRvIiwiYSI6IlVJTGIweFUifQ.waoF7m8PZbBM6u8Tg_rR7A';

function getRute() {
	if (xhr.upload) {
		var url = "getRute.php";
		var contenido = "rute="+sessionStorage.rute;
		xhr.open("GET", url+"?"+contenido, true);
		xhr.send();
	}
}

xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var response = xhr.responseText;
			if (response != "") {
				createMap(JSON.parse(response));
				//console.log(response);
			}else {
				console.log("[PFC]: Error coordenadas ruta gpx.");
			}
			
		}
}

function createMap(coord){
	//console.log(coordinates);
	map = L.mapbox.map('map', idMaps[idMap]);
	map.setZoom(14);
	coordinates = coord;
	//bounds debe ser entregado por CESIUM al establecer los bordes con el tile correspondiente.
	//var bounds = [[43.2861328125, -2.021484375000009], [43.330078125, -1.9775390625000044]];
	//L.rectangle(bounds, {color: "#ff7800", weight: 2, fillOpacity:0 }).addTo(map);
	//map.setZoom(14);
	//map.fitBounds(bounds); //map.setMaxBounds(bounds);
	loadGpx();
	//drawRute(coordinates);
	//drawRute(coordinates);
}

function loadGpx() {
//Añadimos la ruta a través del método omnivore, se podría dibujar la línea como polyline.
	var gpxLayer = omnivore.gpx(sessionStorage.rute)
	.on('ready', function() {
		//fitBounds pone el máximo zoom posible para la ruta.
		//map.fitBounds(gpxLayer.getBounds());
		map.setMaxBounds(gpxLayer.getBounds());
		
	})
	.on('error', function() {
		alert('[PFC]: Error loaded omnivore file gpx');
	// fired if the layer can't be loaded over AJAX
	// or can't be parsed
	})
	.addTo(map);
}

function drawRute(){
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
	//Información que usaremos en localStore, otra opción es pasarla mediante php.
	var staticImage = 'https://api.tiles.mapbox.com/v4/'+idMaps[idMap]+'/path-4+026-0.75('+encodeString+')/'+ map.getCenter().lng +','+ map.getCenter().lat +','+ 14 +'/'+width+'x'+height+'.png?access_token='+L.mapbox.accessToken;
	console.log(staticImage);
}

function changeMap(){
	map.remove();
	idMap++;
	map = L.mapbox.map('map', idMaps[idMap]);
	map.setZoom(14);
	loadGpx();
	if (idMap == 3) idMap = -1;
}

