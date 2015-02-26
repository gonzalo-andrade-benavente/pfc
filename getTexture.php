<?php
	/* Save image mapbox to use like a texture. */
	$direction = str_replace(" ", "+", $_GET["direction"]);
	copy( $direction, 'textures/'.$_GET["name"].'.png');
	//echo "";
	$total_imagenes = count(glob("textures/{*.jpg,*.gif,*.png}",GLOB_BRACE));
	echo $total_imagenes;
	//echo 'textures/'.$_GET["name"].'.png';
?>