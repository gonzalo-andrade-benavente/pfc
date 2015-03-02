<?php
	//Create image
	//header("Content-Type: image/png");
	$rows = (int) $_GET['rows'];
	$columns = (int) $_GET['columns'];
	$file = $_GET['name'];
	//resource imagecreate ( int $width , int $height )
	$background_image = @imagecreate($columns*200, $rows*200)
		or die("Cannot Initialize new GD image stream");
	$background_color = imagecolorallocate($background_image, 255, 255, 255);
	$times = 0;
	for($i = 0; $i < $columns; $i++) {
		for($j = 0; $j < $rows; $j++) {
			$times++;
		}
	}
	
	
	$resp = imagepng($background_image,'texture/'.date('ymdhis').'.png');
	echo $times;
?>