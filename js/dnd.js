/* dnd.js */

var xhr = new XMLHttpRequest();

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
	//document.getElementById("messages").innerHTML = "<p> <b> Información del fichero:</b> <br>" + "nombre"
	var formData = new FormData();
	formData.append('ruta', files[0], files[0].name);
	xhr.open('POST', 'upload.php', true);
	xhr.send(formData);
}

xhr.onreadystatechange = function () {
	if (xhr.readyState == 4 && xhr.status == 200) {
		//console.log(xhr.statusText);
		var response = xhr.responseText;
		console.log(response);
	}
}

