/* Classes */
/*
	Class Tile
*/
function Tile(northeast, southeast, northwest, southwest) {
	this.northeast = northeast;
	this.southeast = southeast;
	this.northwest = northwest;
	this.southwest = southwest;
	this.distanceKm = ((northeast.latitude - southeast.latitude)/0.01)*1.1132;
	this.distanceCoordinate = northeast.latitude - southeast.latitude;
}
/*
	Class Cordinate
*/
function Coordinate(latitude, longitude) {
	this.latitude = latitude;
	this.longitude = longitude;
}
/*
	Class to save x and y Cesium and bounds Cesium to Mapbox.
	Cardinality: c:center, w:west, e:east, n:north, s:south;
*/
function InfoTile(x, y, cardinality, northwest_latitude, northwest_longitude, southeast_latitude, southeast_longitude){
	this.x = x;
	this.y = y;
	this.bounds = [[northwest_latitude, northwest_longitude],[southeast_latitude, southeast_longitude]];
	this.cardinality = cardinality;
	this.texture = "";
}