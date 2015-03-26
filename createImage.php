<?php
	ini_set('memory_limit', '128M');
	$type;
	$finfo = finfo_open(FILEINFO_MIME_TYPE); // return mime type ala mimetype extension
	foreach ( glob('textures/*') as $filename) {
		$type = finfo_file($finfo, $filename);
	}
	finfo_close($finfo);
	
	$posslash = strrpos($type, '/');
	$type = substr($type, $posslash+1);
	
	$rows = (int) $_GET['rows'];
	$columns = (int) $_GET['columns'];
	$file = $_GET['name'];
	//510 - 697
	$width = (509 * 0.5) - 1;
	$heigth = (702 * 0.5) - 1;
	//$background_image = @imagecreate($width * $columns, $heigth * $rows)
	//	or die("Cannot Initialize new GD image stream");
		
	$background_image = imagecreatetruecolor( $width * $columns, $heigth * $rows);   
	//imagealphablending( $background_image, false );
	//imagesavealpha( $background_image, true );
	
	//$background_color = imagecolorallocate($background_image, 0, 0, 0);
	//imagealphablending($background_color, false);
	//imagesavealpha($background_color, true);
	$times = 0;
	$x = 0;
	$y = $heigth * ($rows - 1);
	for($i = 0; $i < $columns; $i++) {
		for($j = 0; $j < $rows; $j++) {
			/*
			if($type == 'png') {
				$source_image = 'textures/'.$file.$times.'.png';
				$image = imagecreatefrompng($source_image);
			} else if ($type == 'jpeg') {
				$source_image = 'textures/'.$file.$times.'.png';
				$image = imagecreatefromjpeg($source_image);
			}
			*/
			$source_image = 'textures/'.$file.$times.'.jpeg';
			$image = imagecreatefromjpeg($source_image);
			$size = getimagesize($source_image);
			//imagecopymerge($background_image, $image, $x, $y, 0, 0, $size[0], $size[1], 100);
			//imagecopy($background_image, $image, $x, $y, 0, 0, $size[0]-10, $size[1]-10);
			imagecopy($background_image, $image, $x, $y, 0, 0, $size[0], $size[1]);
			imagedestroy($image);
			$y = $y - $heigth;
			$times++;
		}
		$x = $x + $width;
		$y = $heigth * ($rows - 1);
	}
	imagejpeg($background_image,'export/'.$file.'.jpeg');
	//imagepng($background_image,'export/'.$file.'.png');
	imagedestroy($background_image);
	/*
	$change_image = 'export/'.$file.'.png';
	$new_size = getimagesize($change_image);
	$nuevo_ancho = $new_size[0] * 0.5;
	$nuevo_alto = $new_size[1] * 0.5;
	
	$new_image = imagecreatetruecolor($nuevo_ancho, $nuevo_alto);
	$image = imagecreatefrompng($change_image);
	imagecopyresized($new_image, $image, 0, 0, 0, 0, $nuevo_ancho, $nuevo_alto, $new_size[0], $new_size[1]);
	imagepng($new_image,'export/'.$file.'.png');
	imagedestroy($new_image);
	imagedestroy($image);
	*/
	echo 'export/'.$file.'.jpeg';
	
?>