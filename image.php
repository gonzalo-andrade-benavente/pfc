<?php
$image = 'images/imagen1.png';
$im = imagecreatefrompng($image); // php function to create image from string
// condition check if valid conversion
if ($im !== false) 
{
    // saves an image to specific location
    $resp = imagepng($im,'images/'.date('ymdhis').'.png');
    // frees image from memory
    imagedestroy($im);
}
else 
{
    // show if any error in bytes data for image
    echo 'An error occurred.'; 
}
echo '<script> console.log(\' php javaScript\'); </script>';
?>

