<?php
	/*
	$fichero = fopen($_GET["rute"], "r");
	$coordenadas[][]="";
	$i = 0;
	if ($fichero) {
		while (($linea = fgets($fichero)) !== false) {
			if (strrpos($linea, "lat=") === false) { // nota: tres signos de igual
				
			}else {
				$poslat = strrpos($linea, "lat=");
				$lat = substr($linea, $poslat + 4, -1);
				$lon = $lat;
				$poslat2 = strrpos($lat, '" '); 
				$lat = substr($lat, 1, $poslat2 - 1); //Valor latitud
				
				$poslon = strrpos($lon, "lon=");
				$lon = substr($lon, $poslat + 4, -2); //Valor longitud
				//echo $lat."  y  ".$lon."<br>";
				$coordenadas[$i][0]=floatval($lat);			
				$coordenadas[$i][1]=floatval($lon);
				$i++;
			}
		}
		$js_array = json_encode($coordenadas);
		echo $js_array;
	} else {
		echo "";
	}
	*/
	
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