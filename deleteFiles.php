<?php	
	$files = glob('textures/*'); 
	foreach($files as $file){ 
		if(is_file($file))
			unlink($file); 
	}
	
	$files = glob('uploads/*'); 
	foreach($files as $file){ 
		if(is_file($file))
			unlink($file); 
	}
	
	$files = glob('texture/*'); 
	foreach($files as $file){ 
		if(is_file($file))
			unlink($file); 
	}
	
	$files = glob('export/*'); 
	foreach($files as $file){ 
		if(is_file($file))
			unlink($file); 
	}
	echo "[PFC deleteFiles.php]: Information cleaned correctly.";
?>