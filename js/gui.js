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
			/*
			for(var i = 0; i < geometry2.vertices.length; i++) {
				geometry.faces.push(new THREE.Face3(i, geometry2.vertices.length + i, i));
			}
			*/
			//geometry = createFaces(geometry, geometry2);
			//geometry = createBase(geometry);
			//geometry = addFaceVertexUvs(geometry);		
			//The last don´t be trate jet.
			geometry = studyGeometry(geometry, geometry2);
			//studyGeometry(geometry, geometry2);
			//var texture = THREE.ImageUtils.loadTexture( "./textures/"+ sessionStorage.name +".png" );
			//scene.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { map: texture, wireframe: false } )));
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

function createBase(geometry) {
	//for(var i = 0; )
	//Create the base
	geometry.computeBoundingBox();
	geometry.vertices.push(new THREE.Vector3(geometry.boundingBox.min.x, geometry.boundingBox.min.y, 0));
	geometry.vertices.push(new THREE.Vector3(geometry.boundingBox.max.x, geometry.boundingBox.min.y, 0));
	geometry.vertices.push(new THREE.Vector3(geometry.boundingBox.min.x, geometry.boundingBox.max.y, 0));
	geometry.vertices.push(new THREE.Vector3(geometry.boundingBox.max.x, geometry.boundingBox.max.y, 0));
	geometry.faces.push(new THREE.Face3(geometry.vertices.length-4, geometry.vertices.length-3, geometry.vertices.length-2));
	geometry.faces.push(new THREE.Face3(geometry.vertices.length-2, geometry.vertices.length-3, geometry.vertices.length-1));
	return geometry;
}

function createFaces(geometry, geometry2) {
	//In geometry2 have the old data of geometry.
	for(var i = 0; i < geometry2.vertices.length-2; i++ ) {
		geometry.faces.push(new THREE.Face3(i,geometry2.vertices.length + i, geometry2.vertices.length + i + 1));
		geometry.faces.push(new THREE.Face3(i,geometry2.vertices.length + i + 1, geometry2.vertices.length + i + 2));
	}
	return geometry;
}

function addFaceVertexUvs(geometry) {
	geometry.computeBoundingBox();
	var max = geometry.boundingBox.max,
		min = geometry.boundingBox.min;
	var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
	var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
	geometry.faceVertexUvs[0] = [];
	for (i = 0; i < geometry.faces.length ; i++) {
		var v1 = geometry.vertices[geometry.faces[i].a], v2 = geometry.vertices[geometry.faces[i].b], v3 = geometry.vertices[geometry.faces[i].c];
		geometry.faceVertexUvs[0].push(
		[
			new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
			new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
			new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
		]);

	}
	geometry.uvsNeedUpdate = true;
	return geometry;
}

function studyGeometry(geometry, geometry2) {
	//In geometry2 have the old data of geometry.
	var southVertices = new Array(),
		northVertices = new Array(),
		eastVertices = new Array(),
		westVertices = new Array();
	
	//Save the index of the limits(west, east, north, south).
	geometry2.computeBoundingBox();
	for(var i = 0; i < geometry2.vertices.length; i++) {
		/*
		if (geometry.vertices[i].y === geometry2.boundingBox.min.y)
			southVertices.push(i);			
		else if (geometry.vertices[i].x === geometry2.boundingBox.min.x)
			westVertices.push(i);
		else if (geometry.vertices[i].x === geometry2.boundingBox.max.x)
			eastVertices.push(i);	
		else if (geometry.vertices[i].y === geometry2.boundingBox.max.y)
			northVertices.push(i);	
		*/
		if (geometry2.vertices[i].x == geometry2.boundingBox.min.x)
			westVertices.push(geometry2.vertices[i]);
	}
	sortVector(geometry, westVertices, "y");
	/*
	var displace = geometry2.vertices.length;
	for(var i = 0; i < southVertices.length-1; i++) {
		geometry.faces.push(new THREE.Face3( southVertices[i], southVertices[i] + displace, southVertices[i+1]+displace));
		geometry.faces.push(new THREE.Face3( southVertices[i], southVertices[i+1], southVertices[i+1]+displace));
	}
	for(var i = 0; i < westVertices.length-1; i++) {
		geometry.faces.push(new THREE.Face3( westVertices[i], westVertices[i] + displace, westVertices[i+1]+displace));
		geometry.faces.push(new THREE.Face3( westVertices[i], westVertices[i+1], westVertices[i+1]+displace));
	}
	//intersection (south-west)
	geometry.faces.push(new THREE.Face3( southVertices[0], westVertices[0], westVertices[0]+displace));
	geometry.faces.push(new THREE.Face3( southVertices[0]+displace, westVertices[0]+displace, southVertices[0]));
	*/
	//sortVector(geometry2, southVertices);

	return geometry;
}

function sortVector(geometry, vertices, coordinate) {
	var i,j;
	var aux;
	var control = true;
	if (coordinate == "y"){
		while(control) {
			for(i = 0; i < vertices.length; i++) {
				console.log("hola");
			}
			control = false;
		}
	}
}

/*
Latitud 
Varía entre 90º N y 90º S pasando por 0º que es el Ecuador 
Longitud 
Se toma como base 0 el meridiano de Greenwich. Si nos movemos hacia el este llegamos a 180º E y si es hacia el oeste sería 180º O. 
*/



