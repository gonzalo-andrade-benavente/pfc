/* PFC GUI - Three.js */
var estado;

window.onload = function() {

	controles = new function() {
		//this.numberOfObjects = escena.children.length;
		this.rotationSpeed = 0.02;
		this.x=-4;
		this.y=3;
		this.z=0;
		//this.color = materialCubo.color.getStyle();

		/*this.removeCube = function() {
			var allChildren = escena.children;
			var lastObject = allChildren[allChildren.length-2];
			console.log('[RM]:Eliminar objeto: ' + lastObject.name);
			if (lastObject instanceof THREE.Mesh) {
				escena.remove(lastObject);
				//this.numberOfObjects = scene.children.length;
			}
		}*/
		
		this.defaultPosition = function() {
			this.x=-4;
			this.y=3;
			this.z=0;
			this.rotationSpeed = 0.02;
		}
	}
	
	gui = new dat.GUI();
	gui.add(controles, 'x', -200, 200).name('Eje X');
	gui.add(controles, 'y', -200, 200).name('Eje Y');
	gui.add(controles, 'z', -200, 200).name('Eje Z');
	gui.add(controles, 'rotationSpeed',0,0.5).name('Velocidad de rotación');
	/*
	gui.addColor(controles, 'color').onChange(function (e) {
		materialCubo.color.setStyle(e)
	}).name('Color material');
	*/
	gui.add(controles, 'defaultPosition').name('Estado inicial');				
}


