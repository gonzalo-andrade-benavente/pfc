<?php
	$type;
	$finfo = finfo_open(FILEINFO_MIME_TYPE); // return mime type ala mimetype extension
	foreach ( glob('textures/*') as $filename) {
		$type = finfo_file($finfo, $filename);
	}
	finfo_close($finfo);
	$posslash = strrpos($type, '/');
	echo substr($type, $posslash+1);
?>