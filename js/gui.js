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
		this.texture = function() {
			var rectangle = maxMinTileXY();
			var columns = 0, rows = 0;
			for(var i = rectangle[0][0]; i <= rectangle[1][0]; i++) {
				columns++;
			}
			
			for(var j = rectangle[1][1]; j >= rectangle[0][1]; j--) {
					rows++;
			}
				
			var name = sessionStorage.rute.substring(sessionStorage.rute.indexOf("/") + 1, sessionStorage.rute.length);
			var file_name = name.substring(0, name.indexOf("."));
			var xhr = new XMLHttpRequest();
			var url = "createImage.php";
			var contenido = "rows="+rows+"&columns="+columns+"&name="+file_name;
			//var contenido = "direction="+direction+"&name="+file_name + index;
			xhr.open("GET", url+"?"+contenido, true);
			xhr.send();
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					console.log(xhr.responseText);
					/*
					if (combined_geometry.vertices.length > 0) {
						if (quotient > 0) {
							console.log("[PFC gui.js]: quotient to bigger " + quotient);
							//combined_geometry.vertices[i].y = combined_geometry.vertices[i].y / (quotient/2);
							for(i = 0; i < combined_geometry.vertices.length; i++)
								combined_geometry.vertices[i].y = combined_geometry.vertices[i].y / (quotient * 2) ;
						}
						
						combined_geometry.uvsNeedUpdate = true;
						combined_geometry.buffersNeedUpdate = true;
						combined_geometry = addFaceVertexUvs(combined_geometry);
						
						console.log("[PFC gui.js]: combined_geometry exist.");
						texture = THREE.ImageUtils.loadTexture(xhr.responseText);
						material = new THREE.MeshBasicMaterial( { map: texture, wireframe: true } );
						//material= new THREE.MeshBasicMaterial( { color: "rgb(0,0,0)", wireframe: true ,side:THREE.DoubleSide} );
						mesh = new THREE.Mesh( combined_geometry, material );
						mesh.position.set(-80, 0, 0);
						scene.add(mesh);						
					} else {
						console.log("[PFC gui.js]: combined_geometry doesn't merge.");
					}
					*/
				}
			}
		
		}
		this.merge = function () {
			/*
			var materials = new Array();
			texture = THREE.ImageUtils.loadTexture('images/europa.jpg');
			materials.push(new THREE.MeshBasicMaterial({map:texture}));
			materials.push(new THREE.MeshBasicMaterial({map:texture}));
			
			var combined = new THREE.Geometry();

			var geometry = new THREE.BoxGeometry(50, 0.5, 50);
			
			for(var i = 0; i < geometry.faces.length; i++) {
				geometry.faces[i].materialIndex = 0;
			}
			
			var cube1 = new THREE.Mesh(geometry);
			cube1.position.set(-50,0,0);
			cube1.updateMatrix();
			combined.merge(cube1.geometry, cube1.matrix, 0);

			var cube2 = new THREE.Mesh(geometry);
			cube2.position.set(0,0,0);
			cube2.updateMatrix();
			combined.merge(cube2.geometry, cube2.matrix, 1);
			*/
			if (quotient > 0) {
				console.log("[PFC gui.js]: quotient to bigger " + quotient);
				//combined_geometry.vertices[i].y = combined_geometry.vertices[i].y / (quotient/2);
				for(i = 0; i < combined.vertices.length; i++)
					combined.vertices[i].y = combined.vertices[i].y / (quotient * 4) ;
			}
			
			var material = new THREE.MeshFaceMaterial(materials);
			var mesh = new THREE.Mesh(combined, material);
			scene.add(mesh);
			
		}
		this.export = function () {
			var a, exporter;
			var mesh, material;
			console.log("[PFC gui.js]: Export with THREE.X3dExporter.");
			exporter = new THREE.X3DExporter();
			if (combined) {
				var material = new THREE.MeshFaceMaterial(materials);
				var mesh = new THREE.Mesh(combined, material);
				//material= new THREE.MeshBasicMaterial( { color: "rgb(0,0,0)", wireframe: true ,side:THREE.DoubleSide} );
				//mesh = new THREE.Mesh(combined_geometry, material);
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
						}
					}
				
				
			}
			//console.log(a);
		}
		this.download = function () {
			var rectangle = maxMinTileXY();
			var columns = 0, rows = 0;
			for(var i = rectangle[0][0]; i <= rectangle[1][0]; i++) {
				columns++;
			}
			
			for(var j = rectangle[1][1]; j >= rectangle[0][1]; j--) {
					rows++;
			}
				
			var name = sessionStorage.rute.substring(sessionStorage.rute.indexOf("/") + 1, sessionStorage.rute.length);
			var file_name = name.substring(0, name.indexOf("."));
			var xhr = new XMLHttpRequest();
			var url = "createImage.php";
			var contenido = "rows="+rows+"&columns="+columns+"&name="+file_name;
			//var contenido = "direction="+direction+"&name="+file_name + index;
			xhr.open("GET", url+"?"+contenido, true);
			xhr.send();
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					console.log(xhr.responseText);
					var a, exporter;
					var mesh, material;
					console.log("[PFC gui.js]: Export with THREE.X3dExporter.");
					exporter = new THREE.X3DExporter();
					if (combined) {
						material = new THREE.MeshFaceMaterial(materials);
						mesh = new THREE.Mesh(combined, material);
						//material= new THREE.MeshBasicMaterial( { color: "rgb(0,0,0)", wireframe: true ,side:THREE.DoubleSide} );
						//mesh = new THREE.Mesh(combined_geometry, material);
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
		}
		this.study = function () {
			console.clear();
			var geometry, material, texture, mesh;
			var combine = new THREE.Geometry();
			var x = 0, y = 0, z = 0;
			texture = THREE.ImageUtils.loadTexture('images/europa.jpg');
			
			for(var i = 0; i < 3; i++) {
				geometry = new THREE.PlaneGeometry(10,10,10);
				//material = new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: true ,side:THREE.DoubleSide} );
				material = new THREE.MeshBasicMaterial( { map: texture, side:THREE.DoubleSide} );
				mesh = new THREE.Mesh(geometry, material);
				mesh.rotation.x =  Math.PI / 180 * (-90);
				mesh.position.set(x,y,z);
				scene.add(mesh);
				x = x - 10;
				mesh.updateMatrix();
				combine.merge(mesh.geometry, mesh.matrix);
			}
			z = z + 20;
			x = 0;
			//material = new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)", wireframe: true ,side:THREE.DoubleSide} );
			combine = addFaceVertexUvs(combine);
			material = new THREE.MeshBasicMaterial( { map: texture, side:THREE.DoubleSide} );
			mesh = new THREE.Mesh(combine, material);
			mesh.position.set(x,y,z);
			scene.add(mesh);
			
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
	//gui.add(controls, 'download').name('Descargar Shape');
	gui.add(controls, 'study').name('Texturas');
	gui.add(controls, 'refresh').name('Actualizar (F5)');
}




