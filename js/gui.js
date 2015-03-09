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
		this.scalar = function() {
			if (quotient > 0) {
				for(var i = 0; i < scene.children.length; i++) {
					geometry = scene.children[i].geometry;
					geometry.verticesNeedUpdate = true;
					for(var j = 0; j < geometry.vertices.length; j++) {
						geometry.vertices[j].z = geometry.vertices[j].z  / (quotient * 2);
					}
				}	
			}
		}
		this.combined = function() {
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
						
						/*
						geometry = new THREE.BoxGeometry(10,10,10);
						material = new THREE.MeshBasicMaterial( { map: texture, wireframe: true, side:THREE.DoubleSide } );
						
						material.needsUpdate = true;
						
						mesh = new THREE.Mesh( geometry, material );
						mesh.position.set(0, 0, 10);
						scene.add(mesh);
						*/
						
					} else {
						console.log("[PFC gui.js]: combined_geometry doesn't merge.");
					}
				}
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
	gui.add(controls, 'map').name('Mapa');
	gui.add(controls, 'home').name('Inicio');
	gui.add(controls, 'combined').name('Geo. combinada');
	gui.add(controls, 'scalar').name('scalar');
	gui.add(controls, 'refresh').name('Actualizar (F5)');
}




