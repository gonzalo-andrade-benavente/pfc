/* dnd.js */

var xhr = new XMLHttpRequest();
var fileSession;

window.onload=function() {
	if (window.File && window.FileList && window.FileReader) {
		var fileselect = document.getElementById("fileselect"),
			filedrag = document.getElementById("filedrag"),
			submitbutton = document.getElementById("submitbutton");
		
		if (xhr.upload) {	
			// file drop
			filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectHandler, false);
			filedrag.style.display = "block";
			// remove submit button
			submitbutton.style.display = "none";
		}	
	
	}else{
		document.getElementById("messages").innerHTML = "Navegador no soporta File-FileList-FileReader";
	}
};

function FileDragHover(e) {
	e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type == "dragover" ? "hover" : "");
}

function FileSelectHandler(e) {
	FileDragHover(e);
	var files = e.target.files || e.dataTransfer.files;
	var RegExPattern = /(gpx)$/;
	if (files[0].name.match(RegExPattern)) {
		var formData = new FormData();
		fileSession = files[0].name;
		formData.append('ruta', files[0], files[0].name);
		xhr.open('POST', 'upload.php', true);
		xhr.send(formData);
	} else { 
		alert('extensión no valida');
	}
}

xhr.onreadystatechange = function () {
	if (xhr.readyState == 4 && xhr.status == 200) {
		//console.log(xhr.statusText);
		var response = xhr.responseText;
		if (response == "true")
			alert("ok");
		else 
			alert("failure in the server");
	}
}

