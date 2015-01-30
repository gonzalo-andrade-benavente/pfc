/* PFC GUI - Three.js */
var controls;

function createGUI() {
	var controls = new function() {
		//this.numberOfObjects = escena.children.length;
		//this.lat = 43.314;
		//this.lon = -2.002;	
		//this.control1 = "control1";
		//this.control2 = "control2";
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
		this.create = function() {
			//geometry and Clone gometry to access her.
			var geometry = scene.children[0].geometry.clone(),
				geometry2 = scene.children[0].geometry.clone(); 
		
			for(var i = 0; i < geometry2.vertices.length; i++) {
				geometry.vertices.push(new THREE.Vector3(geometry2.vertices[i].x, geometry2.vertices[i].y, 0));
			}
			//Like is a copy, go over the original points.
			//Create point of each vertice with z = 0;
			for(var i = 0; i < geometry2.vertices.length; i++) {
				geometry.faces.push(new THREE.Face3(i, geometry2.vertices.length + i, i));
			}
			
			//for(var i = 0; )
			//Create the base
			geometry.computeBoundingBox();
			geometry.vertices.push(new THREE.Vector3(geometry.boundingBox.min.x, geometry.boundingBox.min.y, 0));
			geometry.vertices.push(new THREE.Vector3(geometry.boundingBox.max.x, geometry.boundingBox.min.y, 0));
			geometry.vertices.push(new THREE.Vector3(geometry.boundingBox.min.x, geometry.boundingBox.max.y, 0));
			geometry.vertices.push(new THREE.Vector3(geometry.boundingBox.max.x, geometry.boundingBox.max.y, 0));
			geometry.faces.push(new THREE.Face3(geometry.vertices.length-4, geometry.vertices.length-3, geometry.vertices.length-2));
			geometry.faces.push(new THREE.Face3(geometry.vertices.length-2, geometry.vertices.length-3, geometry.vertices.length-1));
			
			//The last don´t be trate jet.
			console.log(geometry);
			scene.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: true, side:THREE.DoubleSide} )));
			scene.children[1].rotation.x = Math.PI / 180 * (-90);
			/*
			for(var i = 0; i < geometry2.faces.length; i++) {
				geometry.faces.push(new THREE.Face3(geometry2.faces[i].a + geometry2.vertices.length, geometry2.faces[i].b + geometry2.vertices.length, geometry2.faces[i].c + geometry2.vertices.length));
			}
			*/
		}
	}
	
	gui = new dat.GUI();
	//gui.add(controls, 'lat').name('Latitude');
	//gui.add(controls, 'lon').name('Longitude');
	
	gui.add(controls, 'visible').name('Visible').onChange(function (e) {
		scene.children[0].visible = e;
	});
	
	gui.add(controls, 'wireframe').name('Marcos de malla').onChange(function (e) {
		scene.children[0].material.wireframe = e;
	});
	gui.add(controls, 'map').name('Mapa');
	gui.add(controls, 'home').name('Inicio');
	
	gui.add(controls, 'create').name('Crear mesh');
	gui.add(controls, 'refresh').name('Actualizar (F5)');
	
	
	/*
	gui.add(controles, 'z', -200, 200).name('Eje Z');
	gui.add(controles, 'rotationSpeed',0,0.5).name('Velocidad de rotación');
	gui.addColor(controles, 'color').onChange(function (e) {
		materialCubo.color.setStyle(e)
	}).name('Color material');
	*/
		
	/*
	var folder = gui.addFolder('Folder');
		folder.add( controls, 'control1' );
		folder.add( controls, 'control2' );
		folder.close();
	*/
	//gui.close();			
}

/*
Latitud 
Varía entre 90º N y 90º S pasando por 0º que es el Ecuador 
Longitud 
Se toma como base 0 el meridiano de Greenwich. Si nos movemos hacia el este llegamos a 180º E y si es hacia el oeste sería 180º O. 
*/



