/*------------ Generador de terreno---------*/
console.log('generador de terreno');

GeneradorTerreno = function(ancho, alto, segmentos, alisado) {
	this.ancho = ancho;
	this.alto = alto;
	this.segmentos = segmentos;
	this.alisado = alisado;
	
	//arrays de 0...n;
	this.terreno = new Array();
	//Recordar que trabajamos por coordenadas.(x,y) 
	
	this.inicio = function() {
		this.terreno = new Array();
		for(var i=0; i <= this.segmentos; i++) {
			this.terreno[i]= new Array();
			for(var j=0; j <= this.segmentos; j++)
				this.terreno[i][j]=0;
		}
	}
	
	this.cuadroDiamante = function() {
		this.inicio();
		
		//x columnas, y filas.
		var tamaño = this.segmentos + 1;
		for(var longitud = this.segmentos; longitud >= 2; longitud /= 2) {
			//console.log(longitud);
			var mitad = longitud/2;
			this.alisado /= 2;
			
			//Generamos los nuevos valores del cuadro
			for(var x = 0; x < this.segmentos; x += longitud){
				for(var y = 0; y < this.segmentos; y += longitud) {
					//console.log("x:" + Math.round(x) + " y:" + Math.round(y));
					//console.log("x:" + x + " y:" + y);
					//				izquierda arriba	  		derecha arriba				izquierda abajo						izquierda arriba
					//var promedio = this.terreno[x][y] + this.terreno[x+longitud][y] + this.terreno[x][y+longitud] + this.terreno[x+longitud][y+longitud];
					
					/*--------------------------------------------------------------------------
					Codigo anterior no funciona bien por las posiciones con decimales en la tabla.
					----------------------------------------------------------------------------*/
					var promedio = this.terreno[Math.round(x)][Math.round(y)] + //izquierda arriba
					this.terreno[Math.round(x+longitud)][Math.round(y)] + 	//derecha arriba
					this.terreno[Math.round(x)][Math.round(y+longitud)] + 	//izquierda abajo
					this.terreno[Math.round(x+longitud)][Math.round(y+longitud)];	//izquierda arriba

					promedio /= 4;
					promedio += 2 * this.alisado * Math.random() - this.alisado;
					this.terreno[Math.round(x) + Math.round(mitad)][ Math.round(y) + Math.round(mitad)] = promedio;	
				}
			}
		
			
			//Generamos los nuevos valores del diamante.
			
			for(var x = 0; x < this.segmentos; x += mitad){
				for(var y = (x + mitad)%longitud; y < this.segmentos; y += longitud) {
					/* ------------------------------------------------------------------------------------------------- 
					---- Añado código para tratar los valores como enteros redondeados y para no -----------------------
					---- excederme de los valores del arreglo ----------------------------------------------------------
					----------------------------------------------------------------------------------------------------*/
					if (((Math.round((Math.round(x) - mitad + tamaño)%tamaño)) < this.segmentos) && (y < this.segmentos) && ((Math.round((Math.round(x) + mitad)%tamaño)) < this.segmentos) && ((Math.round((Math.round(y) - mitad + tamaño)%tamaño)) < this.segmentos) && ((Math.round((Math.round(y) + mitad)%tamaño)) < this.segmentos)) {
						//console.log("[" + Math.round((Math.round(x) + mitad)%tamaño) + "][" + Math.round(y) + "]")
						var promedio = this.terreno[Math.round((Math.round(x) - mitad + tamaño)%tamaño)][Math.round(y)] + //mitad izquierda
						this.terreno[Math.round((Math.round(x) + mitad)%tamaño)][Math.round(y)] + //mitad derecha
						this.terreno[Math.round(x)][Math.round((Math.round(y) - mitad + tamaño)%tamaño)] + //mitad arriba
						this.terreno[Math.round(x)][Math.round((Math.round(y) + mitad)%tamaño)]; //mitad abajo
					
						promedio /= 4;
						promedio += 2 * this.alisado * Math.random() - this.alisado;
						//console.log(promedio);
						this.terreno[Math.round(x)][Math.round(y)] = promedio;
					}
					
				
				}
			}
		
		}
		
		/*for(x=0; x<this.segmentos; x++)
				for(y=0; y<this.segmentos; y++)
					console.log("terreno["+x+"]["+y+"]:" + this.terreno[x][y]);
		*/
			
		//Devolvemos el terreno.
		return this.terreno;
	}
	
}
