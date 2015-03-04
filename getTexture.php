<?php
	/* Save image mapbox to use like a texture. */
	/*
	$direction = str_replace(" ", "+", $_GET["direction"]);
	copy( $direction, 'textures/'.$_GET["name"].'.png');
	*/
	//echo "";
	//$total_imagenes = count(glob("textures/{*.jpg,*.gif,*.png}",GLOB_BRACE));
	//echo $total_imagenes;
	//echo 'textures/'.$_GET["name"].'.png';
	$information = json_decode($_POST['information']);
	$dev;
	foreach($information as $tile) {
		copy( $tile->direction, 'textures/'.$tile->name.'.png');
	}
	echo "[PFC getTexture.php]: All textures copy in server.";
	//echo $information[0]->direction;
?>