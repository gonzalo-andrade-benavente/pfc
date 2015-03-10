<?php
	/*
	$xml = new SimpleXMLElement("<X3D xmlns:xsd='http://www.w3.org/2001/XMLSchema-instance' version='3.0' profile='Immersive' xsd:noNamespaceSchemaLocation='http://www.web3d.org/specifications/x3d-3.0.xsd' />");
	
	$head = $xml->addChild("head");
		$meta = $head->addChild("meta name='filename' content='filename.x3d'");
		$meta = $head->addChild("meta name='generator' content='3xdExport.js'");
	
	$scene = $xml->addChild("Scene");
		$transform = $scene->addChild("Transform scale='0.38463 0.38463 0.38463'", "");
		//$shape = $transform->addChild("Shape");
			//$shape = $transform->addChild("Shape");
				//$appearance = $shape->addChild("Appearance");
	
	
	//$head->addChild("meta", "name='filename' content='thetahedronMusicTextureExport.x3d'");
	//$head->addChild("<meta name='filename' content='thetahedronMusicTextureExport.x3d'/>");
	//$head->addChild("<meta name='generator' content='3xdExport.js'/>");
	
	for ($i = 1; $i <= 8; ++$i) {
		$track = $xml->addChild('track');
		$track->addChild('path', "song$i.mp3");
		$track->addChild('title', "Track $i - Track Title");
	}
	
	Header('Content-type: text/xml');
	print($xml->asXML());
	*/
	$xml = fopen("export\\".$_POST['file_name'].".x3d", "w") or die("Unable to open file!");
	fwrite($xml, "<?xml version='1.0' encoding='UTF-8'?>");
	//fwrite($xml, "<!DOCTYPE X3D PUBLIC 'ISO//Web3D//DTD X3D 3.0//EN' 'http://www.web3d.org/specifications/x3d-3.0.dtd'>");
	fwrite($xml, "<X3D xmlns:xsd='http://www.w3.org/2001/XMLSchema-instance' version='3.0' profile='Immersive' xsd:noNamespaceSchemaLocation='http://www.web3d.org/specifications/x3d-3.0.xsd'>");
	fwrite($xml, "<head>");
		fwrite($xml, "<meta name='filename' content='".$_POST['file_name']."' />");
		fwrite($xml, "<meta name='generator' content='3xdExport.js' />");
	fwrite($xml, "</head>");	
	fwrite($xml, "<Scene>");
		fwrite($xml, "<Transform scale='0.38463 0.38463 0.38463'>");
			fwrite($xml, "<Shape>");
				fwrite($xml, "<Appearance>");
					fwrite($xml, "<ImageTexture url='\"".$_POST['file_name'].".png\"' />");
					fwrite($xml, "<Material diffuseColor='0 0 1' ambientIntensity='1.0' />");
				fwrite($xml, "</Appearance>");
				fwrite($xml, "");
			fwrite($xml, "</Shape>");
		fwrite($xml, "</Transform>");
	fwrite($xml, "</Scene>");
	fwrite($xml, "</X3D>");
	fclose($xml);
	
	echo "[PFC createX3D.php]: Create X3D complete.";
?>