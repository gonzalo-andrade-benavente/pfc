<?php
	//Download php
	$archivo = $_GET['file_name'].".zip";
	$path = 'export/';
	$ruta = $path.$archivo;
	if (is_file($ruta)) {
		header('Content-Type: application/force-download');
		header('Content-Disposition: attachment; filename='.$archivo);
		header('Content-Transfer-Encoding: binary');
		header('Content-Length: '.filesize($ruta));
		readfile($ruta);
	} else
		exit();

	unlink($path.$_GET['file_name'].".zip");
	unlink($path.$_GET['file_name'].".x3d");
	unlink($path.$_GET['file_name'].".jpeg");

?>