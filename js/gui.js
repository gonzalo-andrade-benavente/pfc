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
		this.rectangle = function() {
			//Global variable from: my_cesium_mesh.
			console.log(rectangle_tiles);
		}
		this.combined = function() {
			if (quotient > 0) {
				console.log("[PFC gui.js]: quotient to bigger " + quotient);	
			
			}
			/*
			if (combined_geometry) {
				if (quotient) {
					console.log("[PFC gui.js]: quotient to bigger " + quotient);
					for(i = 0; i < combined_geometry.vertices.length; i++)
						combined_geometry.vertices[i].y = combined_geometry.vertices[i].y / (quotient/2);
					console.log("[PFC gui.js]: Combined geometry scaling ");
				}
				//console.log(combined_geometry.vertices[0]);
				//console.log(combined_geometry.vertices[combined_geometry.vertices.length-1]);
				//combined_mesh = geometry = addFaceVertexUvs(combined_mesh);
				//var material= new THREE.MeshBasicMaterial( { map: texture, wireframe: true, side:THREE.DoubleSide } );
				var material= new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: true ,side:THREE.DoubleSide} );
				scene.add(new THREE.Mesh(combined_geometry, material));
			} else if (combined_geometry.vertices.length < 1) {
				console.log("[PFC gui.js]: combined_geometry doesn't merge.");
			} else { 
				console.log("[PFC gui.js]: combined_geometry doesn't exist.");
			}*/
		}

	}
	
	gui = new dat.GUI();
	
	gui.add(controls, 'visible').name('Visible').onChange(function (e) {
		for (var i = 0; i < scene.children.length; i++ )
			scene.children[i].material.visible = e;
	});
	
	gui.add(controls, 'wireframe').name('Marcos de malla').onChange(function (e) {
		for (var i = 0; i < scene.children.length; i++ )
			scene.children[i].material.wireframe = e;
	});
	gui.add(controls, 'map').name('Mapa');
	gui.add(controls, 'home').name('Inicio');
	gui.add(controls, 'combined').name('Geo. combinada');
	gui.add(controls, 'rectangle').name('Mesh rectangular');
	gui.add(controls, 'refresh').name('Actualizar (F5)');
}




