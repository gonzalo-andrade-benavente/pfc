<?php		
	$rows = (int) $_GET['rows'];
	$columns = (int) $_GET['columns'];
	$file = $_GET['name'];
	$width = 510;
	$heigth = 697;
	$background_image = @imagecreate($width * $columns, $heigth * $rows)
		or die("Cannot Initialize new GD image stream");
	$background_color = imagecolorallocate($background_image, 0, 0, 0);
	//imagealphablending($background_color, false);
	//imagesavealpha($background_color, true);
	$times = 0;
	$x = 0;
	$y = $heigth * ($rows - 1);
	for($i = 0; $i < $columns; $i++) {
		for($j = 0; $j < $rows; $j++) {
			$source_image = 'textures/'.$file.$times.'.png';
			//$source_image = 'textures/ruta14.png';
			$image = imagecreatefrompng($source_image);
			$size = getimagesize($source_image);
			imagecopymerge($background_image, $image, $x, $y, 0, 0, $size[0], $size[1], 100);
			imagedestroy($image);
			$y = $y - $heigth;
			$times++;
		}
		$x = $x + $width;
		$y = $heigth * ($rows - 1);
	}
	
	
	imagepng($background_image,'texture/'.$file.'.png');
	imagedestroy($background_image);
	echo '[PFC createImage.php]: Image create in texture/'.$file.'.png';
?>