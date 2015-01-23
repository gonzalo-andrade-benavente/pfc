/* PFC GUI - Three.js */
var controls;


function createGUI() {
	var controls = new function() {
		//this.numberOfObjects = escena.children.length;
		this.lat = 43.314;
		this.lon = -2.002;	
		this.createMesh = function() {
			createMesh();
		}
		this.control1 = "control1";
		this.control2 = "control2";
		this.wireframe = false;
	}
	
	gui = new dat.GUI();
	gui.add(controls, 'lat').name('Latitude');
	gui.add(controls, 'lon').name('Longitude');
	gui.add(controls, 'wireframe').name('Wireframe');
	/*
	gui.add(controles, 'z', -200, 200).name('Eje Z');
	gui.add(controles, 'rotationSpeed',0,0.5).name('Velocidad de rotación');
	gui.addColor(controles, 'color').onChange(function (e) {
		materialCubo.color.setStyle(e)
	}).name('Color material');
	*/
	gui.add(controls, 'createMesh').name('Crear Mesh');	
	var folder = gui.addFolder('Folder');
		folder.add( controls, 'control1' );
		folder.add( controls, 'control2' );
		folder.close();
	gui.close();			
}

/*
Latitud 
Varía entre 90º N y 90º S pasando por 0º que es el Ecuador 
Longitud 
Se toma como base 0 el meridiano de Greenwich. Si nos movemos hacia el este llegamos a 180º E y si es hacia el oeste sería 180º O. 
*/


