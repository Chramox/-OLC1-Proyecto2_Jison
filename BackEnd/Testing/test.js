var fs = require("fs");
var parser = require("../Gramatica/gramatica");

class Archivo {
  constructor(clases, metodos, variables) {
    this.listaClases = clases;
    this.listaMetodos = metodos;
    this.listaVariables = variables;
  }
}
class Clase {
  constructor(identificador, metodos, contadorMetodos) {
    this.nombreClase = identificador;
    this.Metodos = metodos;
    this.contadorMetodos = contadorMetodos;
  }
}
class Metodo {
  constructor(clase, tipo, id, parametros, variables) {
    this.ClasePadre = clase;
    this.FuncionTipo = tipo;
    this.Id = id;
    this.Parametros = parametros;
    this.Variables = variables;
  }
}
class Parametro {
  constructor(tipo, id) {
    this.tipoDato = tipo;
    this.nombreParam = id;
  }
}
class Variable {
  constructor(clase, metodo, tipo, id) {
    this.ClasePadre = clase;
    this.MetodoPadre = metodo;
    this.TipoDato = tipo;
    this.Id = id;
  }
}
let original;
let copia;
let variablesCopia = [],
  metodosCopia = [],
  clasesCopia = [];

fs.readFile("./test.txt", (err, data) => {
  if (err) throw err;
  let hola = parser.parse(data.toString());
  fs.readFile("./copia.txt", (err, data) => {
    if (err) throw err;
    let hola2 = parser.parse(data.toString());
    llenarEstructura(hola, "original");
    llenarEstructura(hola2, "copia");
    compararArchivos();
    console.log("CLASES COPIA");
    console.log(JSON.stringify(clasesCopia, null, 4));
    console.log("METODOS COPIA");
    console.log(JSON.stringify(metodosCopia, null, 4));
    console.log("VARIABLES COPIA");
    console.log(JSON.stringify(variablesCopia, null, 4));
  });
  // llenarEstructura(hola, "original");
  // console.log( hola ); //PARA VER BIEN LA ESTRUCTURA
  //console.log( JSON.stringify(hola, null, 4)  );
  // arbol1 = JSON.stringify(hola, null, 4) ;
});

function llenarEstructura(arbolAST, archivo) {
  let listado = arbolAST["CLASES"];
  // console.log(listado);
  let listaClases = [];
  let listaMetodos = [];
  let listaVariables = [];

  listado.forEach((clase) => {
    listaMetodos = [];
    listaVariables = [];
    let listaInstr = clase["INST"];
    let nombreClase = clase["IDENTIFICADOR"];

    listaInstr.forEach((inst) => {
      // console.log("INSTRUCCION");
      // console.log(inst);
      if (inst["TIPO_INST"] == "funcion") {
        //  console.log("ESTAMOS DENTRO DE UNA FUNCION O METODO");
        let listparam = inst["PARAMETROS"];
        let listaParametros = [];
        let nombreMetodo = inst["IDENTIFICADOR"];
        listparam.forEach((param) => {
          //  console.log(param);
          let tipoDato = param["TIPO_DATO"];
          let id = param["ID"];
          let newParam = new Parametro(tipoDato, id);
          listaParametros.push(newParam);
        });

        //VARIABLES QUE SE PUEDEN CONSIDERAR COPIA
        let list_inst = inst["INSTRUCCIONES"];

        list_inst.forEach((instruccion) => {
          let declaracion = instruccion["Declaracion"];
          if (declaracion != null) {
            //REVISANDO SI ES UNA LISTA DE VARIABLES O UNA SOLA
            let listadoDeclaraciones = declaracion["ListaDeclaraciones"];
            let tipoDato = declaracion["TIPO_DATO"];
            listadoDeclaraciones.forEach((decl) => {
              //AQUI YA TODAS SON VARIABLES
              let variable = new Variable(
                nombreClase,
                nombreMetodo,
                tipoDato,
                decl["IDENTIFICADOR"]
              );
              listaVariables.push(variable);
            });
          }
        });
        let newMetodo = new Metodo(
          nombreClase,
          inst["TIPO_FUNCION"],
          nombreMetodo,
          listaParametros,
          listaVariables
        );
        listaMetodos.push(newMetodo);
      }
    });
    let newClase = new Clase(nombreClase, listaMetodos, listaMetodos.length);
    listaClases.push(newClase);
    // console.log("NUEVA CLASE");
    // console.log( JSON.stringify(newClase, null, 4) );
    // console.log("LISTADO CLASES");
    // console.log( JSON.stringify(listaClases, null, 4) );
  });

  if (archivo == "original") {
    original = new Archivo(listaClases, listaMetodos, listaVariables);
    console.log("ORIGINAL");
    console.log(JSON.stringify(listaClases, null, 4));
  } else {
    copia = new Archivo(listaClases, listaMetodos, listaVariables);
    console.log("COPIA");
    console.log(JSON.stringify(listaClases, null, 4));
  }
  // console.log(JSON.stringify(listaClases, null, 4));
}

/**
 *   EVALUACION PARA VER SI SE ENCUENTRA COPIA
 */

function compararArchivos() {
  original.listaClases.forEach((clase) => {
    compararClase(clase);
  });
}
function compararClase(claseEvaluar) {
  let esClaseCopia = true;
  copia.listaClases.forEach((clase) => {
    if (claseEvaluar.nombreClase == clase.nombreClase) {
      //tienen el mismo nombre las clases --> comparar metodos
      let esMetodoCopia = false;
      claseEvaluar.Metodos.forEach((metodoOriginal) => {
        esMetodoCopia = clase.Metodos.some((metodoCopia) => {
          let res = compararMetodo(metodoOriginal, metodoCopia);
          console.log("Resultado Comparacion " + res);
          return res;
        });
        
        console.log("esMetodoCopia: " + esMetodoCopia);
        if (!esMetodoCopia) {
          esClaseCopia = false; //metodo no hay copia --> clase no es copia
        } else {
          metodosCopia.push(metodoOriginal);
        }
      });
    }
    if (claseEvaluar.contadorMetodos != clase.contadorMetodos) {
      esClaseCopia = false;
    } //cantidad de metodos no igual }
    //si considieron todos los metodos ---> clase es copia
    if (esClaseCopia) {
      clasesCopia.push(claseEvaluar);
    }
  });
}
function compararMetodo(metodoOriginal, metodoCopia) {
  console.log("METODOS COMPARADOS");
  console.log("Original");
  console.log(metodoOriginal);
  console.log("Copia");
  console.log(metodoCopia);

  let tipoFuncion = metodoOriginal.FuncionTipo;

  if (tipoFuncion == metodoCopia.FuncionTipo) {
    //mismo tipo ---> comparar parametros
    if (metodoOriginal.Parametros.length == metodoCopia.Parametros.length) {
      //misma cantidad de parametros ---> comparar tipo y orden
      for (let index = 0; index < metodoOriginal.Parametros.length; index++) {
        const param1 = metodoOriginal.Parametros[index].tipoDato;
        const param2 = metodoCopia.Parametros[index].tipoDato;
        if (param1 != param2) {
          return false; //parametro diferentes no es copia
        }
      }
      //si se considera copia los metodos ----> revisar sus variables
      compararVariables(metodoOriginal, metodoCopia);
      return true; //todo es iguAL
    } else {
      return false; //cantidad parametros diferente
    }
  } else {
    return false; //tipos diferentes
  }
}
function compararVariables(metodoOriginal, metodoCopia) {
  //solo comparar tipo de datos, porque supuestamente ya pertenecen al mismo metoodo

  metodoCopia.Variables.forEach((variable) => {
    metodoOriginal.Variables.some((varOriginal) => {
      if (variable.tipoDato == varOriginal.tipoDato) {
        //son iguales
        variablesCopia.push(varOriginal);
        return true;
      }
    });
  });
}
