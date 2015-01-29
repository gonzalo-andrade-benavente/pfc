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
		this.create = function() {
			/*
			var geometry = new THREE.Geometry();
			geometry.vertices.push(new THREE.Vector3(0,0,0));
			geometry.vertices.push(new THREE.Vector3(10,0,0));
			geometry.vertices.push(new THREE.Vector3(0,10,0));
			geometry.vertices.push(new THREE.Vector3(10,10,0));
			geometry.faces.push(new THREE.Face3(0,1,2));
			geometry.faces.push(new THREE.Face3(2,3,1));
			
			var geometry2 = geometry.clone();
			for(var i = 0; i < geometry2.vertices.length; i++) {
				geometry.vertices.push(new THREE.Vector3(geometry2.vertices[i].x, geometry2.vertices[i].y, geometry2.vertices[i].z - 2));
			}
			
			for(var i = 0; i < geometry2.faces.length; i++) {
				geometry.faces.push(new THREE.Face3(geometry2.faces[i].a + geometry2.vertices.length, geometry2.faces[i].b + geometry2.vertices.length, geometry2.faces[i].c + geometry2.vertices.length));
			}
			geometry2 = geometry.clone();
			
			for(var i = 0; i < 1; i++) {
				console.log(geometry2.faces[i]);
				geometry.faces.push(new THREE.Face3(geometry2.faces[i].a, geometry2.faces[i+1].a, geometry2.faces[i+2].a));
				geometry.faces.push(new THREE.Face3(geometry2.faces[i+1].a, geometry2.faces[i+2].a, geometry2.faces[i+3].a));
				geometry.faces.push(new THREE.Face3(geometry2.faces[i].b, geometry2.faces[i+1].b, geometry2.faces[i+2].b));
				geometry.faces.push(new THREE.Face3(geometry2.faces[i+1].b, geometry2.faces[i+2].b, geometry2.faces[i+3].b));
			}
			
			console.log(geometry);
			scene.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: false, side:THREE.DoubleSide} )));
			scene.children[1].rotation.x = Math.PI / 180 * (-90);
			*/
			var geometry = scene.children[0].geometry.clone();
			geometry2 = geometry.clone();
			
			for(var i = 0; i < geometry2.vertices.length; i++) {
				geometry.vertices.push(new THREE.Vector3(geometry2.vertices[i].x, geometry2.vertices[i].y, 0));
			}
			
			/*
			console.log(geometry2.vertices[0].x +","+ geometry2.vertices[0].y +","+ geometry2.vertices[0].z);
			console.log(geometry.vertices[geometry2.vertices.length].x, geometry.vertices[geometry2.vertices.length].y, geometry.vertices[geometry2.vertices.length].z);
			console.log(geometry.vertices[geometry2.vertices.length + 1].x, geometry.vertices[geometry2.vertices.length + 1].y, geometry.vertices[geometry2.vertices.length + 1].z);
			*/
			console.log(geometry.vertices.length);
			for(var i = 0; i < 84 ; i++ ) {
				geometry.faces.push(new THREE.Face3(i, geometry2.vertices.length + i , geometry2.vertices.length + (i + 1)));
				geometry.faces.push(new THREE.Face3(i+1, geometry2.vertices.length + i , geometry2.vertices.length + (i + 1)));
				console.log(geometry2.vertices.length + (i + 1));
			}
			
			/*
			geometry.faces.push(new THREE.Face3(0, geometry2.vertices.length, geometry2.vertices.length + 1));
			geometry.faces.push(new THREE.Face3(1, geometry2.vertices.length, geometry2.vertices.length + 1));
			geometry.faces.push(new THREE.Face3(2, geometry2.vertices.length + 1, geometry2.vertices.length + 2));
			geometry.faces.push(new THREE.Face3(3, geometry2.vertices.length + 1, geometry2.vertices.length + 2));
			*/
			//geometry.faces.push(new THREE.Face3(1, geometry2.vertices.length, geometry2.vertices.length + 1));
			//geometry.faces.push(new THREE.Face3(2, geometry2.vertices.length + 1, geometry2.vertices.length + 2));
			//geometry.faces.push(new THREE.Face3(3, geometry2.vertices.length + 1, geometry2.vertices.length + 2));
			//geometry.faces.push(new THREE.Face3(4, geometry2.vertices.length + 2, geometry2.vertices.length + 3));
			//geometry.faces.push(new THREE.Face3(5, geometry2.vertices.length + 2, geometry2.vertices.length + 3));
			
			
			//geometry.faces.push(new THREE.Face3(geometry2.faces[0].a + geometry2.vertices.length, geometry2.faces[0].b + geometry2.vertices.length, geometry2.faces[0].c + geometry2.vertices.length));
			
			/*
			for(var i = 0; i < geometry2.faces.length; i++) {
				geometry.faces.push(new THREE.Face3(geometry2.faces[i].a + geometry2.vertices.length, geometry2.faces[i].b + geometry2.vertices.length, geometry2.faces[i].c + geometry2.vertices.length));
			}
			*/
			//geometry.computeBoundingBox();			
			console.log(geometry);
			scene.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: true, side:THREE.DoubleSide} )));
			scene.children[1].rotation.x = Math.PI / 180 * (-90);
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



