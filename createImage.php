<?php
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
			if($type == 'png') {
				$source_image = 'textures/'.$file.$times.'.png';
				$image = imagecreatefrompng($source_image);
			} else if ($type == 'jpeg') {
				$source_image = 'textures/'.$file.$times.'.png';
				$image = imagecreatefromjpeg($source_image);
			}
			$size = getimagesize($source_image);
			imagecopymerge($background_image, $image, $x, $y, 0, 0, $size[0], $size[1], 100);
			imagedestroy($image);
			$y = $y - $heigth;
			$times++;
		}
		$x = $x + $width;
		$y = $heigth * ($rows - 1);
	}
	//imagejpeg($background_image,'export/'.$file.'.jpeg');
	imagepng($background_image,'export/'.$file.'.png');
	imagedestroy($background_image);
	echo 'export/'.$file.'.png';
	
?>