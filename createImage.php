<?php	
	/*
	//resource imagecreate ( int $width , int $height )
	$background_image = imagecreate($columns*510, $rows*700)
		or die("Cannot Initialize new GD image stream");
	$background_color = imagecolorallocate($background_image, 255, 0, 0);
	$times = 0;
	$pos_x = 0; $pos_y = 700 * ($rows - 1);
	for($i = 0; $i < $columns; $i++) {
		for($j = 0; $j < $rows; $j++) {
			$source_image = 'textures/'.$file.$times.'.png';
			//$source_image = 'textures/ruta12.png';
			$image = imagecreatefrompng($source_image);
			//$size[0] width, $size[1] height.
			$size = getimagesize($source_image);			
			imagecopymerge($background_image, $image, $pos_x, $pos_y, 0, 0, $size[0], $size[1], 100);
			$pos_y = $pos_y - 700;
			$times++;
			imagedestroy($image);
		}
		$pos_x = $pos_x + 510;
		$pos_y = 700 * ($rows - 1);
	}
	
	$resp = imagepng($background_image,'texture/'.date('ymdhis').'.png');
	*/
	
	
	
	$rows = (int) $_GET['rows'];
	$columns = (int) $_GET['columns'];
	$file = $_GET['name'];
	$background_image = @imagecreate(510 * $columns, 700 * $rows)
		or die("Cannot Initialize new GD image stream");
	$background_color = imagecolorallocate($background_image, 0, 0, 0);
	//imagealphablending($background_color, false);
	//imagesavealpha($background_color, true);
	$times = 0;
	$x = 0;
	$y = 700 * ($rows - 1);
	for($i = 0; $i < $columns; $i++) {
		for($j = 0; $j < $rows; $j++) {
			$source_image = 'textures/'.$file.$times.'.png';
			//$source_image = 'textures/ruta14.png';
			$image = imagecreatefrompng($source_image);
			$size = getimagesize($source_image);
			imagecopymerge($background_image, $image, $x, $y, 0, 0, $size[0], $size[1], 100);
			imagedestroy($image);
			$y = $y - 700;
			$times++;
		}
		$x = $x + 510;
		$y = 700 * ($rows - 1);
	}
	
	
	imagepng($background_image,'texture/'.date('ymdhis').'.png');
	imagedestroy($background_image);
	echo $source_image;
	/*
	$source_image = 'textures/ruta11.png';
	$source_image1 = 'textures/ruta14.png';
	$image = imagecreatefrompng($source_image);
	$size = getimagesize($source_image);

	
	$image1 = imagecreatefrompng($source_image1);
	$x = 0;
	for($i = 0; $i < 2; $i++) {
		imagecopymerge($background_image, $image, $x, 0, 0, 0, $size[0], $size[1], 100);
		//imagecopymerge($background_image, $image1, $size[0], 0, 0, 0, $size[0], $size[1], 100);
		$x = $x + $size[0];
	}
	
	//$resp = imagepng($background_image,'texture/'.date('ymdhis').'.png');
	imagedestroy($image);
	imagedestroy($image1);
	*/
?>