<?php
	if (DIRECTORY_SEPARATOR == '/') { 
	// linux 
		$xml = fopen("export/".$_POST['file_name'].".x3d", "w") or die("Unable to open file!");
	} if (DIRECTORY_SEPARATOR == '\\') { 
	// windows
		$xml = fopen("export\\".$_POST['file_name'].".x3d", "w") or die("Unable to open file!");
	}

	
	fwrite($xml, "<?xml version='1.0' encoding='UTF-8'?>");
	//fwrite($xml, "<!DOCTYPE X3D PUBLIC 'ISO//Web3D//DTD X3D 3.0//EN' 'http://www.web3d.org/specifications/x3d-3.0.dtd'>");
	fwrite($xml, "<X3D xmlns:xsd='http://www.w3.org/2001/XMLSchema-instance' version='3.0' profile='Immersive' xsd:noNamespaceSchemaLocation='http://www.web3d.org/specifications/x3d-3.0.xsd'>");
	fwrite($xml, "<head>");
		fwrite($xml, "<meta name='filename' content='".$_POST['file_name']."' />");
		fwrite($xml, "<meta name='generator' content='3xdExport.js' />");
	fwrite($xml, "</head>");	
	fwrite($xml, "<Scene>");
		fwrite($xml, "<Transform scale='0.4 0.4 0.4'>");
			fwrite($xml, "<Shape>");
				fwrite($xml, "<Appearance>");
					fwrite($xml, "<ImageTexture url='\"".$_POST['file_name'].".jpeg\"' />");
					fwrite($xml, "<Material diffuseColor='0 0 1' ambientIntensity='1.0' />");
				fwrite($xml, "</Appearance>");
				fwrite($xml, $_POST['indexed_face_set']);
			fwrite($xml, "</Shape>");
		fwrite($xml, "</Transform>");
	fwrite($xml, "</Scene>");
	fwrite($xml, "</X3D>");
	fclose($xml);
	
	$zip = new ZipArchive();
	$filename = "export/".$_POST['file_name'].".zip";

	if ($zip->open($filename, ZipArchive::CREATE)!==TRUE) {
		echo("cannot open <$filename>\n");
	} else {
		echo "[PFC createX3D.php]: Create X3D complete.";
	}
	
	$zip->addFile("export/".$_POST['file_name'].".jpeg", $_POST['file_name'].".jpeg");
	$zip->addFile("export/".$_POST['file_name'].".x3d", $_POST['file_name'].".x3d");
	$zip->close();	
?>