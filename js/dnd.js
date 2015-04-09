/* dnd.js */
var xhr = new XMLHttpRequest();

var control;
function loadPage() {
	sessionStorage.clear();
	if (window.File && window.FileList && window.FileReader) {
		document.getElementById("messages").innerHTML = "<i>Mensaje de estado:</i> Navegador soporta File-FileList-FileReader";
		var fileselect = document.getElementById("fileselect"),
			filedrag = document.getElementById("filedrag"),
			filedrag1 = document.getElementById("filedrag1"),
			submitbutton = document.getElementById("submitbutton");
		
		if (xhr.upload) {			
			filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectHandler, false);
			filedrag.style.display = "block";
			
			filedrag1.addEventListener("dragover", FileDragHover, false);
			filedrag1.addEventListener("dragleave", FileDragHover, false);
			filedrag1.addEventListener("drop", FileSelectHandler, false);
			filedrag1.style.display = "block";
		}	
	
	}else{
		document.getElementById("messages").innerHTML = "<i>Mensaje de estado:</i> Navegador no soporta File-FileList-FileReader";
	}
}

function FileDragHover(e) {
	e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type == "dragover" ? "hover" : "");
}
	
function deleteFiles() {
xhr2 = new XMLHttpRequest();
		var url = "deleteFiles.php";
		xhr2.open("GET", url, true);
		xhr2.send();
		xhr2.onreadystatechange = function () {
			if (xhr2.readyState == 4 && xhr2.status == 200) {
				console.log(xhr2.responseText);
				loadPage();
			}
		}	
}
function FileSelectHandler(e) {
	FileDragHover(e);
	sessionStorage.setItem("control", e.target.id);
	var files = e.target.files || e.dataTransfer.files;
	var RegExPattern = /(gpx)$/;
	if (files[0].name.match(RegExPattern)) {
		var formData = new FormData();
		formData.append('ruta', files[0], files[0].name);
		xhr.open('POST', 'upload.php', true);
		xhr.send(formData);
	} else { 
		alert('extensión no valida');
	}
}

xhr.onreadystatechange = function () {
	if (xhr.readyState == 4 && xhr.status == 200) {
		var response = xhr.responseText;
		if (response != "") {
			sessionStorage.setItem("rute", response);
			window.open("./PFCMyRute.html", "_self");
		} else 
			alert("failure in the server");
	}
}

