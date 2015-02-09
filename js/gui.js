/* PFC GUI - Three.js */
var controls;

function createGUI() {
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
		this.combined = function() {
			if (combined_geometry) {
				//console.log(combined_geometry.vertices[0]);
				//console.log(combined_geometry.vertices[combined_geometry.vertices.length-1]);
				//combined_mesh = geometry = addFaceVertexUvs(combined_mesh);
				//var texture = THREE.ImageUtils.loadTexture( "./textures/"+ sessionStorage.name + "0c.png" );
				//var material= new THREE.MeshBasicMaterial( { map: texture, wireframe: true, side:THREE.DoubleSide } );
				var material= new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: true ,side:THREE.DoubleSide} );
				scene.add(new THREE.Mesh(combined_geometry, material));
			}else {
				console.log("don't exist");
			}
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
	gui.add(controls, 'combined').name('Combinado(merge)');
	gui.add(controls, 'map').name('Mapa');
	gui.add(controls, 'home').name('Inicio');
	gui.add(controls, 'refresh').name('Actualizar (F5)');
}




