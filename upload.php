<?php
	/* upload.php */
	$target_dir = "uploads/";
	if (move_uploaded_file($_FILES["ruta"]["tmp_name"], $target_dir.$_FILES["ruta"]["name"])) {
        echo "true";
    } else {
        echo "false";
    }
?>