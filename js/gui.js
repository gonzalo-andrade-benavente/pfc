/* PFC GUI - Three.js */
var controls, meshs;

function createGUI() {
	console.log("[PFC gui.js]: GUI Loaded.");
	var controls = new function() {
		this.wireframe = true;
		this.visible = true;
		this.home = function() {
			window.open("./PFCIndex.html", "_self");
		}
		this.map = function() {
			window.open("./PFCMyRute.html", "_self");
		}
		this.refresh = function() {
			location.reload();
		}
		this.export = function () {
			var a, exporter;
			var mesh, material;
			console.log("[PFC gui.js]: Export with THREE.X3dExporter.");
			exporter = new THREE.X3DExporter();
			if (combined_geometry) {
				console.log(combined_geometry);
				//combined_geometry = addFaceVertexUvs(combined_geometry);
				//material = new THREE.MeshBasicMaterial( { map: texture, wireframe: false, side:THREE.DoubleSide} );
				//material= new THREE.MeshBasicMaterial( { color: "rgb(0,0,0)", wireframe: true ,side:THREE.DoubleSide} );
				mesh = new THREE.Mesh(combined_geometry);				
				a = exporter.parse(mesh);		
				var formData = new FormData();
				var name = sessionStorage.rute.substring(sessionStorage.rute.indexOf("/") + 1, sessionStorage.rute.length);
				var file_name = name.substring(0, name.indexOf("."));
				
				formData.append('file_name', file_name);
				formData.append('indexed_face_set', a);
				var xhr2 = new XMLHttpRequest();
					xhr2.open("POST", 'createX3D.php', true);
					xhr2.send(formData);
					xhr2.onreadystatechange = function () {
						if (xhr2.readyState == 4 && xhr2.status == 200) {
							console.log(xhr2.responseText);
							window.open('./downloadShapeways.php?file_name='+file_name,  "_self");
						}
					}
			}
		}
	}
	
	gui = new dat.GUI( {width: 300});
	
	/*
	gui.add(controls, 'visible').name('Visible').onChange(function (e) {
		for (var i = 0; i < scene.children.length; i++ )
			scene.children[i].material.visible = e;
	});
	*/
	/*
	gui.add(controls, 'wireframe').name('Marcos de malla').onChange(function (e) {
		for (var i = 0; i < scene.children.length; i++ )
			scene.children[i].material.wireframe = e;
	});
	*/
	gui.add(controls, 'map').name('Mapa');
	gui.add(controls, 'home').name('Inicio');
	gui.add(controls, 'export').name('Exportar Shape');
	gui.add(controls, 'refresh').name('Actualizar (F5)');
}




