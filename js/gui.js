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
				console.log("[PFC gui.js]: combined_geometry doesn't exist.")
			}
		}
		this.clean = function () {
			if (scene.children.length != 0) {
				scene.remove(scene.children[0]);
				this.clean();
			} else {
				console.log("[PFC gui.js]: Childrens in scene removed.")
			}
		}
		this.clone = function () {
			var geometry = scene.children[0].geometry.clone();
			for(i = 0; i < geometry.vertices.length; i++)
				geometry.vertices[i].z = geometry.vertices[i].z/2;
			var material = new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: true ,side:THREE.DoubleSide} );
			var mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(scene.children[0].position.x - 10, scene.children[0].position.y, scene.children[0].position.z);
			mesh.rotation.x =  Math.PI / 180 * (-90);
			scene.remove(scene.children[0]);
			scene.add(mesh);
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
	//gui.add(controls, 'combined').name('Combinado(merge)');
	gui.add(controls, 'map').name('Mapa');
	gui.add(controls, 'home').name('Inicio');
	gui.add(controls, 'combined').name('Visualizar Terreno');
	//gui.add(controls, 'clean').name('Limpiar escena');
	//gui.add(controls, 'clone').name('Clonar geometrias');
	gui.add(controls, 'refresh').name('Actualizar (F5)');
}




