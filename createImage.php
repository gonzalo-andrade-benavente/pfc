<?php
	//Create image
	//header("Content-Type: image/png");
	$rows = (int) $_GET['rows'];
	$columns = (int) $_GET['columns'];
	$file = $_GET['name'];
	//resource imagecreate ( int $width , int $height )
	$background_image = @imagecreate($columns*510, $rows*700)
		or die("Cannot Initialize new GD image stream");
	$background_color = imagecolorallocate($background_image, 255, 255, 255);
	$times = 0;
	$pos_x = 0; $pos_y = 700 * ($rows - 1);
	for($i = 0; $i < $columns; $i++) {
		for($j = 0; $j < $rows; $j++) {
			$source_image = 'textures/'.$file.$times.'.png';
			$image = imagecreatefrompng($source_image);
			//$size[0] width, $size[1] height.
			$size = getimagesize($source_image);			
			/*
				bool imagecopymerge ( resource $dst_im , resource $src_im , int $dst_x , int $dst_y , int $src_x , int $src_y , int $src_w , int $src_h , int $pct )
				Copy a part of src_im onto dst_im starting at the x,y coordinates src_x, src_y with a width of src_w and a height of src_h. The portion defined will 
				be copied onto the x,y coordinates, dst_x and dst_y.
			*/
			imagecopymerge($background_image, $image, $pos_x, $pos_y, 0, 0, $size[0], $size[1], 100);
			$pos_y = $pos_y - 700;
			$times++;
		}
		$pos_x = $pos_x + 510;
		$pos_y = 700 * ($rows - 1);
	}
	
	
	$resp = imagepng($background_image,'texture/'.date('ymdhis').'.png');
	echo $image;
?>