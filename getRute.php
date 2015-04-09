<?php
	$coordenadas[][]="";
	$i = 0;
	
	$xml = simplexml_load_file($_GET["rute"]);
	
	foreach($xml->trk->trkseg->trkpt as $trk){
		$coordenadas[$i][0]=floatval($trk["lat"]);			
		$coordenadas[$i][1]=floatval($trk["lon"]);
		$i++;
	}
	$js_array = json_encode($coordenadas);
	echo $js_array;
	
?>
