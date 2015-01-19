<?php
	/* upload.php */
	$target_dir = "uploads/";
	if (move_uploaded_file($_FILES["ruta"]["tmp_name"], $target_dir.$_FILES["ruta"]["name"])) {
        echo "El fichero se ha subido correctamente.";
    } else {
        echo "Lo sentimos, error en la subida del fichero.";
    }
?>