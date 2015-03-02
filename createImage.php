<?php
	//Create image
	//header("Content-Type: image/png");
	$rows = (int) $_GET['rows'];
	$columns = (int) $_GET['columns'];
	//resource imagecreate ( int $width , int $height )
	$image = @imagecreate($columns*200, $rows*200)
		or die("Cannot Initialize new GD image stream");
	$color_fondo = imagecolorallocate($image, 0, 255, 0);
	$resp = imagepng($image,'texture/'.date('ymdhis').'.png');
	echo 'createImage()';
?>