
console.log("[PFC my_jquery.js]: My jQuery.");
	$(function() {
		$( "#dialog-message" ).dialog({
			modal: true,
			width: 400,
			autoOpen: false,
		});
		
		$( "#progressbar" ).progressbar({
			value: false
		});
 
	});