var fs = require("fs");
var parser = require("../Gramatica/gramatica");

fs.readFile("./test.txt", (err, data) => {
  if (err) throw err;
  let hola =  parser.parse(data.toString());
  console.log( hola ); //PARA VER BIEN LA ESTRUCTURA
  //console.log( JSON.stringify(hola, null, 4)  );  
});