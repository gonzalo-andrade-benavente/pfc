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
		
			/*
				Add to geometry her base.
			*/
			for(var i = 0; i < geometry2.vertices.length; i++) {
				geometry.vertices.push(new THREE.Vector3(geometry2.vertices[i].x, geometry2.vertices[i].y, 0));
			}
			geometry = completeGeometry(geometry, geometry2);
			//geometry = addFaceVertexUvs(geometry);
			console.log(geometry);
			var texture = THREE.ImageUtils.loadTexture( "./textures/"+ sessionStorage.name +".png" );
			scene.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { map: texture, wireframe: false, side:THREE.DoubleSide } )));
			//scene.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: false, side:THREE.DoubleSide} )));
			scene.children[1].rotation.x = Math.PI / 180 * (-90);
		}
	}
	
	gui = new dat.GUI();
	//gui.add(controls, 'lat').name('Latitude');
	//gui.add(controls, 'lon').name('Longitude');
	
	gui.add(controls, 'visible').name('Visible').onChange(function (e) {
		scene.children[scene.children.length-1].visible = e;
	});
	
	gui.add(controls, 'wireframe').name('Marcos de malla').onChange(function (e) {
		//scene.children[scene.children.length-1].material.wireframe = e;
		for (var i = 0; i < scene.children.length; i++ )
			scene.children[i].material.wireframe = e;
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

function completeGeometry(geometry, geometry2) {
	//In geometry2 have the old data of geometry.
	var southVertices = new Array(),
		northVertices = new Array(),
		eastVertices = new Array(),
		westVertices = new Array(),
		i;
	//Save the index of the limits(west, east, north, south).
	geometry2.computeBoundingBox();
	for(i = 0; i < geometry2.vertices.length; i++) {
		if (geometry.vertices[i].y === geometry2.boundingBox.min.y)
			southVertices.push(i);			
		else if (geometry.vertices[i].x === geometry2.boundingBox.min.x)
			westVertices.push(i);
		else if (geometry.vertices[i].x === geometry2.boundingBox.max.x)
			eastVertices.push(i);	
		else if (geometry.vertices[i].y === geometry2.boundingBox.max.y)
			northVertices.push(i);	
	}
	var displace = geometry2.vertices.length;
	southVertices = sortVector(geometry2, southVertices, "x");
	westVertices = sortVector(geometry2, westVertices, "y");
	eastVertices = sortVector(geometry2, eastVertices, "y");
	northVertices = sortVector(geometry2, northVertices, "x");
	
	addRelieve(geometry, southVertices, displace);
	addRelieve(geometry, westVertices, displace);
	addRelieve(geometry, eastVertices, displace);
	addRelieve(geometry, northVertices, displace);
	/*
		West and east miss a point and north two point.
	*/
	//West-south
	geometry.faces.push(new THREE.Face3(westVertices[0], westVertices[0]+displace, southVertices[0]+displace));
	geometry.faces.push(new THREE.Face3(southVertices[0], westVertices[0], southVertices[0]+displace));
	//East-south
	geometry.faces.push(new THREE.Face3(eastVertices[0], eastVertices[0]+displace, southVertices[southVertices.length-1]+displace));
	geometry.faces.push(new THREE.Face3(southVertices[southVertices.length-1], eastVertices[0], southVertices[southVertices.length-1]+displace));
	//North-West 
	geometry.faces.push(new THREE.Face3(westVertices[westVertices.length-1], westVertices[westVertices.length-1]+displace, northVertices[0]+displace));
	geometry.faces.push(new THREE.Face3(northVertices[0], westVertices[westVertices.length-1], northVertices[0]+displace));
	//North-East
	geometry.faces.push(new THREE.Face3(eastVertices[eastVertices.length-1], eastVertices[eastVertices.length-1]+displace, northVertices[northVertices.length-1]+displace));
	geometry.faces.push(new THREE.Face3(northVertices[northVertices.length-1], eastVertices[eastVertices.length-1], northVertices[northVertices.length-1]+displace));
	/*add Base goemtry*/
	geometry.faces.push(new THREE.Face3(southVertices[0]+displace, eastVertices[eastVertices.length-1]+displace, southVertices[southVertices.length-1]+displace));
	geometry.faces.push(new THREE.Face3(southVertices[0]+displace, westVertices[westVertices.length-1]+displace, eastVertices[eastVertices.length-1]+displace));
	return geometry;
}

function addRelieve(geometry, vertices, displace) {
	for(var i = 0; i < vertices.length-1; i++){
		geometry.faces.push(new THREE.Face3(vertices[i], vertices[i]+displace, vertices[i+1]+displace));
		geometry.faces.push(new THREE.Face3(vertices[i+1], vertices[i], vertices[i+1]+displace));
	}
}


function sortVector(geometry, vertices, coordinate) {
	var index_aux, control = true, i;
	if(coordinate == "y") {
		while(control) {
			control = false;
			for(var i=0; i < vertices.length-1; i++) {
				if (geometry.vertices[vertices[i]].y > geometry.vertices[vertices[i+1]].y) {
					index_aux = vertices[i+1];
					vertices[i+1] = vertices[i];
					vertices[i] = index_aux;
					control = true;
				}
			}
		}		
	} else if(coordinate == "x") {
		while(control) {
			control = false;
			for(var i=0; i < vertices.length-1; i++) {
				if (geometry.vertices[vertices[i]].x > geometry.vertices[vertices[i+1]].x) {
					index_aux = vertices[i+1];
					vertices[i+1] = vertices[i];
					vertices[i] = index_aux;
					control = true;
				}
			}
		}
	}
	return vertices;
}

/*
Latitud 
Varía entre 90º N y 90º S pasando por 0º que es el Ecuador 
Longitud 
Se toma como base 0 el meridiano de Greenwich. Si nos movemos hacia el este llegamos a 180º E y si es hacia el oeste sería 180º O. 
*/



