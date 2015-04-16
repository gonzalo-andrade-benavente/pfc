/* Mi threejs */

/* 
	VARIABLES GLOBALES.
*/
var container, stats;
var camera, controlCamera, scene, renderer;
/* 
	CARGAR SI EL NAVEGADOR ES COMPATIBLE.
*/
function loadThreeJS() {
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
	else {
		init();
		render();
	}
}

function initialStats() {
	var stat = new Stats();
	stat.setMode(0); // 0: framepersecundo, 1: milisecond
	// Align top-left
	stat.domElement.style.position = 'absolute';
	stat.domElement.style.left = '0px';
	stat.domElement.style.top = '0px';
	document.body.appendChild(stat.domElement);
	return stat;
}
/* 
	INICIO, CREAR LA ESCENA.
*/
function init() {

	var container = document.createElement('div');
	document.body.appendChild(container);
	stats = initialStats();
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
	camera.position.set(0,100,200);
	//camera.lookAt(scene.position);
	controlCamera = new THREE.OrbitControls(camera);
	//controlCamera.noPan = true;
	container.appendChild(renderer.domElement);
}


function render() {
	controlCamera.update();
	stats.update();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}