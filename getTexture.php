<?php
	/* Save image mapbox to use like a texture. */
	$direction = str_replace(" ", "+", $_GET["direction"]);
	copy( $direction, 'textures/'.$_GET["name"].'.png');
	echo $direction;
?>