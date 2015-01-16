/* uploadjs Proyecto fin de carrera */

var form, fileSelect, uploadButton ;

window.onload=function(){
	form = document.getElementById('file-form');
	fileSelect = document.getElementById('file-select');
	uploadButton = document.getElementById('upload-button');
	
	form.onsubmit = function(event) {
		event.preventDefault();
		// Update button text.
		uploadButton.innerHTML = 'Subiendo...';
	}
	
};

