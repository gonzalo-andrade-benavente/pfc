<?php
	$information = json_decode($_POST['information']);
	$dev;
	foreach($information as $tile) {
		copy( $tile->direction, 'textures/'.$tile->name.'.jpeg');
		$change_image = 'textures/'.$tile->name.'.jpeg';
		$new_size = getimagesize($change_image);
		$nuevo_ancho = $new_size[0] * 0.5;
		$nuevo_alto = $new_size[1] * 0.5;
		$new_image = imagecreatetruecolor($nuevo_ancho, $nuevo_alto);
		$image = imagecreatefromjpeg($change_image);
		imagecopyresized($new_image, $image, 0, 0, 0, 0, $nuevo_ancho, $nuevo_alto, $new_size[0], $new_size[1]);
		imagejpeg($new_image,'textures/'.$tile->name.'.jpeg');
		imagedestroy($new_image);
		imagedestroy($image);
	}
	echo "[PFC getTexture.php]: All textures copy in server.";
?>


