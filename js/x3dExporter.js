/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.X3DExporter = function () {};

THREE.X3DExporter.prototype = {

	constructor: THREE.X3dExporter,

	parse: function ( object ) {

		
                var vertex_output = '<Coordinate point=\"';
                var face_output = 'coordIndex=\"';
                var faceUV_output = '<TextureCoordinate point=\"';
                var faceUVIndex_output = 'texCoordIndex=\"';
                
                var nbVertex = 0;
                var nbVertexUvs = 0;
		var nbNormals = 0;

		var geometry = object.geometry;

                if ( geometry instanceof THREE.Geometry ) {

				for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

					var vertex = geometry.vertices[ i ].clone();
				//	vertex.applyMatrix4( child.matrixWorld );

					vertex_output += vertex.x + ' ' + vertex.y + ' ' + vertex.z +' ';

					nbVertex ++;

				}

                                // faces

				for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

					var face = geometry.faces[ i ];

					face_output += face.a + ' ' + face.b + ' ' +face.c + ' -1 ';
                                 
                                        }
                                
				// uvs

				for ( var i = 0, l = geometry.faceVertexUvs[ 0 ].length; i < l; i ++ ) {

					var vertexUvs = geometry.faceVertexUvs[ 0 ][ i ];

					for ( var j = 0; j < vertexUvs.length; j ++ ) {

						var uv = vertexUvs[ j ];
						// vertex.applyMatrix4( child.matrixWorld );

						faceUV_output += uv.x + ' ' + uv.y +  ' ';

                                                faceUVIndex_output += nbVertexUvs +  ' ';
                                                
                                                nbVertexUvs ++;

					}
                                        
                                        
                                        faceUVIndex_output += '-1 ';
                                        
				}
				
			}
                        
                var faceset_output = '<IndexedFaceSet solid=\"true\" ' + faceUVIndex_output + '\" \n' + face_output + '\">\n ' + vertex_output + '\" />\n' + faceUV_output + '\" /> </IndexedFaceSet>';  
		
		return faceset_output;

	}

};