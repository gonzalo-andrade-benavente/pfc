<?php

$image1 = 'textures/ruta12.png';
$image2 = 'textures/ruta14.png';
$im1 = imagecreatefrompng($image1); // php function to create image from string
$im2 = imagecreatefrompng($image2); // php function to create image from string
// condition check if valid conversion
if ($im1 !== false) 
{
    // saves an image to specific location
    //$resp = imagepng($im,'images/'.date('ymdhis').'.png');
    // frees image from memory
    //imagedestroy($im);
	$size = getimagesize($image1);
	$blank_image = imagecreate($size[0]*2, $size[1]*2);
	//width and height
	/*
		bool imagecopymerge ( resource $dst_im , resource $src_im , int $dst_x , int $dst_y , int $src_x , int $src_y , int $src_w , int $src_h , int $pct )
		Copy a part of src_im onto dst_im starting at the x,y coordinates src_x, src_y with a width of src_w and a height of src_h. The portion defined will 
		be copied onto the x,y coordinates, dst_x and dst_y.
	*/
	imagecopymerge($blank_image, $im1, 0, 0, 0, 0, $size[0], $size[1], 100);
	imagecopymerge($blank_image, $im2, $size[0], $size[1], 0, 0, $size[0], $size[1], 100);
	$resp = imagepng($blank_image,'texture/'.date('ymdhis').'.png');
	imagedestroy($im1);
}
else 
{
    // show if any error in bytes data for image
    echo 'An error occurred.'; 
}


echo '<script> console.log(\' php javaScript\'); </script>';
?>

