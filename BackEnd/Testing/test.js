var fs = require("fs");
var parser = require("../Gramatica/gramatica");
let arbol1, arbol2;

fs.readFile("./test.txt", (err, data) => {
  if (err) throw err;
  let hola =  parser.parse(data.toString());
  arbol1 = hola;
  //console.log( hola ); //PARA VER BIEN LA ESTRUCTURA
  console.log( JSON.stringify(hola, null, 4)  );  
});

fs.readFile("./copia.txt", (err, data) => {
  if (err) throw err;
  let hola =  parser.parse(data.toString());
  arbol2 = hola;
  //console.log( hola ); //PARA VER BIEN LA ESTRUCTURA
  console.log( JSON.stringify(hola, null, 4)  );  
});

let clasesAST1, clasesAST2;



