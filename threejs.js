/* Mi threejs */

/* 
	VARIABLES GLOBALES.
*/
var container;
var camera, controls, scene, renderer;
/* 
	CARGAR SI EL NAVEGADOR ES COMPATIBLE.
*/
function load() {
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
	else {
		init();
	}
}
/* 
	INICIO, CREAR LA ESCENA.
*/
function init() {
	// Clock - Para trackballs
	clock = new THREE.Clock();
	//-------------------- Creaciónn de la escena que contendrá los objetos, cámaras, luces.
	scene = new THREE.Scene();
	//-------------------- Creamos la cámara
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	//-------------------- Creamos el render y definimos el tamaño.
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMapEnabled = true; //Sombra en el renderizado
	//------------------ posición y punto de la cámara para centrar la escena 
	camera.position.z = 800;
	//camara.lookAt(new THREE.Vector3(0, 0, 0));
	//------------------ Ratón
	trackballControls = new THREE.TrackballControls(camera);
	trackballControls.rotateSpeed = 1.0;
	trackballControls.zoomSpeed = 1.0;
	trackballControls.panSpeed = 1.0;
	trackballControls.staticMoving = true;		
	//------------------ Luz
	/*
	scene.add(new THREE.HemisphereLight(0xC0C0C0, 0x826F26));
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	*/
	document.getElementById('container').appendChild(renderer.domElement);
	render();
}

function render() {
	var delta = clock.getDelta();
	trackballControls.update(delta);
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}