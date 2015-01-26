/* Ajax rute.js*/

var xhr = new XMLHttpRequest();
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
				console.log(response);
			}else {
				console.log("[PFC]: Error coordenadas ruta gpx.");
			}
			
		}
}

