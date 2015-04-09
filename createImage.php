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
	$width = (510 * 0.5) - 1;
	$h = (int) $_GET['rest'];
	$heigth = ( ($h - 75) * 0.5) - 1;
	

	$background_image = imagecreatetruecolor( $width * $columns, $heigth * $rows);   
	$times = 0;
	$x = 0;
	$y = $heigth * ($rows - 1);
	for($i = 0; $i < $columns; $i++) {
		for($j = 0; $j < $rows; $j++) {
			$source_image = 'textures/'.$file.$times.'.jpeg';
			$image = imagecreatefromjpeg($source_image);
			$size = getimagesize($source_image);
			imagecopy($background_image, $image, $x, $y, 0, 0, $size[0], $size[1]);
			imagedestroy($image);
			$y = $y - $heigth;
			$times++;
		}
		$x = $x + $width;
		$y = $heigth * ($rows - 1);
	}
	imagejpeg($background_image,'export/'.$file.'.jpeg');
	imagedestroy($background_image);
	echo 'export/'.$file.'.jpeg';
	
?>