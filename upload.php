<?php
	/* upload.php */
	$target_dir = "uploads/";
	if (move_uploaded_file($_FILES["ruta"]["tmp_name"], $target_dir.$_FILES["ruta"]["name"])) {
        echo $target_dir.$_FILES["ruta"]["name"];
    } else {
        echo "";
    }
?>