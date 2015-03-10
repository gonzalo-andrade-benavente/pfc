<?php
	$xml = new SimpleXMLElement("<X3D xmlns:xsd='http://www.w3.org/2001/XMLSchema-instance' version='3.0' profile='Immersive' xsd:noNamespaceSchemaLocation='http://www.web3d.org/specifications/x3d-3.0.xsd' />");
	
	$head = $xml->addChild('head');
	$meta = $head->addChild("meta name='filename' content='filename.x3d'");
	$meta = $head->addChild("meta name='generator' content='3xdExport.js'");
	
	//$head->addChild("meta", "name='filename' content='thetahedronMusicTextureExport.x3d'");
	//$head->addChild("<meta name='filename' content='thetahedronMusicTextureExport.x3d'/>");
	//$head->addChild("<meta name='generator' content='3xdExport.js'/>");
	
	/*
	for ($i = 1; $i <= 8; ++$i) {
		$track = $xml->addChild('track');
		$track->addChild('path', "song$i.mp3");
		$track->addChild('title', "Track $i - Track Title");
	}
	*/
	Header('Content-type: text/xml');
	print($xml->asXML());
?>