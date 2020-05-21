var fs = require("fs");
var parser = require("../Gramatica/gramatica");

class Clase{
  constructor(identificador, metodos){
    this.nombreClase = identificador;
    this.Metodos = metodos;
  }
}
class Metodo{
  constructor(clase, tipo, parametros){
    this.ClasePadre =  clase;
    this.FuncionTipo = tipo;
    this.Parametros = parametros;
  }
}
class Parametro{
  constructor(tipo, id){
    this.tipoDato = tipo;
    this.nombreParam = id;
  }
}

let original = new Archivo(undefined, undefined);
let copia = new Archivo(undefined, undefined);

fs.readFile("./test.txt", (err, data) => {
  if (err) throw err;
  let hola =  parser.parse(data.toString());

  console.log(hola);
  llenarEstructura(hola);
  //console.log( hola ); //PARA VER BIEN LA ESTRUCTURA
 // console.log( JSON.stringify(hola, null, 4)  );  
  //arbol1 = JSON.stringify(hola, null, 4) ;
});

function llenarEstructura(arbolAST) {
  let listado = arbolAST["CLASES"] ;
  console.log(listado);
  let listaClases = [];

  listado.forEach(clase => {
    console.log("ENTRAMOS AL FOR");
    console.log(clase);
    let listaInstr = clase["INST"];
    let nombreClase = clase["IDENTIFICADOR"];
    let listaMetodos = [];
    listaInstr.forEach(inst => {
      console.log("INSTRUCCION");
      console.log(inst);
      if(inst["TIPO_INST"] == "funcion"){
        console.log("ESTAMOS DENTRO DE UNA FUNCION O METODO");
        let listparam = inst["PARAMETROS"];
        let listaParametros = [];
        listparam.forEach(param => {
          console.log(param);
          let tipoDato = param["TIPO_DATO"];
          let id = param["ID"];
          let newParam = new Parametro(tipoDato, id);
          listaParametros.push(newParam);
        });
        let newMetodo = new Metodo(nombreClase, inst["TIPO_FUNCION"], listaParametros);
        listaMetodos.push(newMetodo);
      }
    });
    let newClase = new Clase(nombreClase, listaMetodos);
    listaClases.push(newClase);
  });

  console.log(JSON.stringify(listaClases, null, 4));
  original = listaClases;
}

