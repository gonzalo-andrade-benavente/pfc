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
		this.texture = false;
	}
	
	gui = new dat.GUI();
	//gui.add(controls, 'lat').name('Latitude');
	//gui.add(controls, 'lon').name('Longitude');
	gui.add(controls, 'texture').name('Textura').onChange(function (e) {
		var texture = texture = THREE.ImageUtils.loadTexture( "./textures/"+ sessionStorage.name +".png" );
		render();
	});
	
	gui.add(controls, 'visible').name('Visible').onChange(function (e) {
		scene.children[0].visible = e;
	});
	
	gui.add(controls, 'wireframe').name('Marcos').onChange(function (e) {
		scene.children[0].material.wireframe = e;
	});
	
	
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


