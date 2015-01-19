/* uploadjs Proyecto fin de carrera */

var form, fileSelect, uploadButton ;

window.onload=function(){
	form = document.getElementById('file-form');
	fileSelect = document.getElementById('file-select');
	uploadButton = document.getElementById('upload-button');
	
	form.onsubmit = function(event) {
		event.preventDefault();
		// Update button text.
		var files = fileSelect.files;
		var formData = new FormData();
		if (files[0].name.match(/(gpx)$/))
			formData.append('ruta', files[0], files[0].name);
		else
			console.log("Extension incorrecta.");
	}
	
};

