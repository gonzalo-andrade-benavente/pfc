<?php
	$url = "ruta8congo.gpx";
	$xml = simplexml_load_file($url);
	
	foreach($xml->trk->trkseg->trkpt as $trk){
		echo $trk["lat"];
		echo "<br>";
		echo $trk["lon"];
		echo "<br>";
	}

?>