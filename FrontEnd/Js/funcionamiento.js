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

let nombreArchivoPrincipal = "";

function onFileSelectPrincipal(event) {
  this.selectedFile = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = reader.result.toString().trim();
    var editor = ace.edit("editor");
    editor.setValue(text);
  };
  reader.readAsText(this.selectedFile);
  nombreArchivoPrincipal = this.selectedFile.filename;
  console.log(nombreArchivoPrincipal);
  //METIENDO LA INFORMACION EN LA PESTAÑA ACTIVA
}
function onFileSelectCopia(event) {
  this.selectedFile = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = reader.result.toString().trim();
    var editor = ace.edit("editor_secundario");
    editor.setValue(text);
  };
  reader.readAsText(this.selectedFile);
  //METIENDO LA INFORMACION EN LA PESTAÑA ACTIVA
}
/*
    AÑADIENDO LISTENERS A LOS BOTONES
*/
const subirArchivo = document.getElementById("subirArchivo");
subirArchivo.addEventListener("change", onFileSelectPrincipal, false);
const subirArchivoCopia = document.getElementById("subirArchivoCopia");
subirArchivoCopia.addEventListener("change", onFileSelectCopia, false);

function guardarArchivoPrincipal() {
  let nombreArchivo;
  var editor = ace.edit("editor");
  let textA = editor.getValue();  
  // console.log('imipirkaldsklasdfj dsalkfsdajlk;');
  // console.log(textA);
  if (nombreArchivoPrincipal === "") {
    nombreArchivo = "editor_principal.java";
  } else {
    nombreArchivo = nombreArchivoPrincipal;
  }
  download(nombreArchivo, textA);
}
function guardarLexicos() {
  let nombreArchivo = "Reporte_ErroresLexicos";
  var editor = ace.edit("editor_lexicos");
  let textA = editor.getValue();  
  download(nombreArchivo, textA);
}
function guardarSintacticos() {
  let nombreArchivo = "Reporte_ErroresSintacticos";
  var editor = ace.edit("editor_sintacticos");
  let textA = editor.getValue();  
  download(nombreArchivo, textA);
}
//GUARDAR ARCHIVO COPIA
function guardarArchivoB() {
  let nombreArchivo = document.getElementById("nombre").value + ".java";
  var editor = ace.edit("editor_secundario");
  let informacion = editor.getValue();
  if (nombreArchivo === "") alert("Escriba un nombre para el archivo");
  else download(nombreArchivo, informacion);
}

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
/**
 * ANALISIS DE LOS ARCHIVOS PARA ENCONTRAR COPIAS
 */
let listaErrores = [];

function arbolAST(json) {
  document.getElementById("arbol_AST").innerHTML = "";
  document.getElementById("arbol_AST").appendChild(renderjson(json));
}
function setErrores(errores) {
  var editor_lexicos = ace.edit("editor_lexicos");
  var editor_sintacticos = ace.edit("editor_sintacticos");
  let strLex = "ERRORES LEXICOS\n";
  let strSin = "ERRORES SINTACTICOS\n";
  if (errores != null) {
    errores.forEach((error) => {
      //ERRORES LEXICOS
      console.log(error);
      if (error["TIPO_ERROR"] == "LEXICO") {
        strLex += 'Este es un error léxico: ' + error["Error"] + ', en la linea: ' + error["Linea"] + ', en la columna: ' + error["Columna"] + '\n' ;
      }
      else if (error["TIPO_ERROR"] == "SINTACTICO"){
        strSin += error["Error"] + '\n';
      }
    });
  }
    editor_lexicos.setValue(strLex);
    editor_sintacticos.setValue(strSin);
}
//PETICION AL SERVIDOR ARBOL ARCHIVO PRINCIPAL
async function arbol_A() {
  var editor = ace.edit("editor");
  let textA = editor.getValue();
  /// console.log(textA);
  if (textA != "") {
    const ast = await getArbol_Errores(textA);
    arbolAST(ast.AST);
    console.log(ast.ListaErrores);
    setErrores(ast.ListaErrores);
  }
}
//PETICION AL SERVIDOR ARBOL ARCHIVO SECUNDARIO
async function arbol_B() {
  var editor = ace.edit("editor_secundario");
  let text = editor.getValue();
  //console.log(text);
  if (text != "") {
    const ast = await getArbol_Errores(text);
    arbolAST(ast.AST);
    console.log(ast.ListaErrores);
    setErrores(ast.ListaErrores);

  }
}

async function getArbol_Errores(txt) {
  url = "http://localhost:4200/parser";
  const data = { text: txt };
  const ast = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => {
      console.log("Success:", response.Salida);
      console.log(response);
      return response;
    });
  return ast;
}
/*
  REPORTES DE LA COPIA
*/

function reporteClases() {
  let tabla = document.getElementById("tabla_clases");
  var tableRows = tabla.getElementsByTagName("tr");
  var rowCount = tableRows.length;
  //vaciando tabla para poner datos nuevos
  while (--rowCount) {
    tabla.deleteRow(rowCount);
  }
  //llenando tablas
  clasesCopia.forEach((copia) => {
    let row = tabla.insertRow();
    let cell1 = row.insertCell();
    let cell2 = row.insertCell();
    let nombre = document.createTextNode(copia.nombreClase);
    let cantidadMetodos = document.createTextNode(copia.contadorMetodos);
    cell1.appendChild(nombre);
    cell2.appendChild(cantidadMetodos);
  });
}

function reporteMetodos() {
  let tabla = document.getElementById("tabla_metodos");
  var tableRows = tabla.getElementsByTagName("tr");
  var rowCount = tableRows.length;
  //vaciando tabla para poner datos nuevos
  while (--rowCount) {
    tabla.deleteRow(rowCount);
  }
  //llenando tablas
  metodosCopia.forEach((copia) => {
    let row = tabla.insertRow();
    let cell1 = row.insertCell();
    let cell2 = row.insertCell();
    let cell3 = row.insertCell();
    let cell4 = row.insertCell();
    let clasePadre = document.createTextNode(copia.ClasePadre);
    let tipoDato = document.createTextNode(copia.FuncionTipo);
    let nombre = document.createTextNode(copia.Id);
    //haciendo lista de parametros
    let listaParam = "";
    copia.Parametros.forEach((param) => {
      listaParam += param.tipoDato + " " + param.nombreParam + ",";
    });
    let final = listaParam.lastIndexOf(",");
    listaParam = listaParam.substring(0, final);

    let parametros = document.createTextNode(listaParam);
    cell1.appendChild(clasePadre);
    cell2.appendChild(tipoDato);
    cell3.appendChild(nombre);
    cell4.appendChild(parametros);
  });
}

function reporteVariables() {
  let tabla = document.getElementById("tabla_variables");
  var tableRows = tabla.getElementsByTagName("tr");
  var rowCount = tableRows.length;
  //vaciando tabla para poner datos nuevos
  while (--rowCount) {
    tabla.deleteRow(rowCount);
  }
  //llenando tablas
  variablesCopia.forEach((copia) => {
    let row = tabla.insertRow();
    let cell1 = row.insertCell();
    let cell2 = row.insertCell();
    let cell3 = row.insertCell();
    let cell4 = row.insertCell();
    let clasePadre = document.createTextNode(copia.ClasePadre);
    let metodoPadre = document.createTextNode(copia.MetodoPadre);
    let tipoDato = document.createTextNode(copia.TipoDato);
    let nombre = document.createTextNode(copia.Id);
    cell1.appendChild(clasePadre);
    cell2.appendChild(metodoPadre);
    cell3.appendChild(tipoDato);
    cell4.appendChild(nombre);
  });
}
/**
 *  COMPARACION DE ARCHIVOS PARA ENCONTRAR COPIA, LOGICA PARA SACAR LA COPIA
 *
 */
async function getAST_A() {
  var editor = ace.edit("editor");
  let textA = editor.getValue();
  /// console.log(textA);
  if (textA != "") {
    const ast = await getArbol_Errores(textA);
    return ast.AST;
  }
}
async function getAST_B() {
  var editor = ace.edit("editor_secundario");
  let textA = editor.getValue();
  /// console.log(textA);
  if (textA != "") {
    const ast = await getArbol_Errores(textA);
    return ast.AST;
  }
}
let original;
let copia;
let variablesCopia = [],
  metodosCopia = [],
  clasesCopia = [];
//FUNCION PARA EMPEZAR EL ANALISIS DE COPIAS

async function buscarCopia() {
  let ast1 = await getAST_A();
  let ast2 = await getAST_B();
  console.log("ARBOLES");
  console.log(ast1);
  console.log(ast2);
  llenarEstructura(ast1, "original");
  llenarEstructura(ast2, "copia");
  compararArchivos();
  reporteClases();
  reporteMetodos();
  reporteVariables();
}

function llenarEstructura(arbolAST, archivo) {
  let listado = arbolAST["CLASES"];
  // console.log(listado);
  let listaClases = [];
  let listaMetodos = [];
  let listaVariables = [];

  if (listado != null) {
    listado.forEach((clase) => {
      listaMetodos = [];
      listaVariables = [];
      let listaInstr = clase["INST"];
      let nombreClase = clase["IDENTIFICADOR"];

      if (listaInstr != null) {
        listaInstr.forEach((inst) => {
          // console.log("INSTRUCCION");
          // console.log(inst);
          if (inst["TIPO_INST"] == "funcion") {
            //  console.log("ESTAMOS DENTRO DE UNA FUNCION O METODO");
            let listparam = inst["PARAMETROS"];
            let listaParametros = [];
            let nombreMetodo = inst["IDENTIFICADOR"];
            if (listparam != null) {
              //pueden venir parametros vacios
              listparam.forEach((param) => {
                //  console.log(param);
                let tipoDato = param["TIPO_DATO"];
                let id = param["ID"];
                let newParam = new Parametro(tipoDato, id);
                listaParametros.push(newParam);
              });
            }

            //VARIABLES QUE SE PUEDEN CONSIDERAR COPIA
            let list_inst = inst["INSTRUCCIONES"];

            if (list_inst != null) {
              list_inst.forEach((instruccion) => {
                let declaracion = instruccion["Declaracion"];
                if (declaracion != null) {
                  //REVISANDO SI ES UNA LISTA DE VARIABLES O UNA SOLA
                  let listadoDeclaraciones = declaracion["ListaDeclaraciones"];
                  let tipoDato = declaracion["TIPO"];
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
            }
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
      }
      let newClase = new Clase(nombreClase, listaMetodos, listaMetodos.length);
      listaClases.push(newClase);
      // console.log("NUEVA CLASE");
      // console.log( JSON.stringify(newClase, null, 4) );
      //  console.log("LISTADO CLASES");
      // console.log( JSON.stringify(listaClases, null, 4) );
    });
  }

  if (archivo == "original") {
    original = new Archivo(listaClases, listaMetodos, listaVariables);
    console.log("ORIGINAL");
    console.log(JSON.stringify(listaClases, null, 4));
  } else {
    copia = new Archivo(listaClases, listaMetodos, listaVariables);
    console.log("COPIA");
    console.log(JSON.stringify(listaClases, null, 4));
  }

  //console.log(JSON.stringify(listaClases, null, 4));
}

function compararArchivos() {
  clasesCopia = [];
  metodosCopia = [];
  variablesCopia = [];
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
        }
      });
    }
    if (claseEvaluar.contadorMetodos != clase.contadorMetodos) {
      esClaseCopia = false;
    } //cantidad de metodos no igual }
    //si considieron todos los metodos ---> clase es copia
    if (esClaseCopia) {
      clasesCopia.push(clase);
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
      if(!metodosCopia.includes(metodosCopia))
        metodosCopia.push(metodoCopia);
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
        if(!variablesCopia.includes(variable))
          variablesCopia.push(variable);
        return true;
      }
    });
  });
}

//REPORTES

function generarReporteErrores(listaToken, listaSintactico) {
  let titulo;
  //INICIO
  let contador = 0;
  titulo = "Lista de Errores Encontrados";

  let html =
    "<!DOCTYPE html> \n" +
    "<html>\n" +
    "<head> \n" +
    "<title>Tokens Encontrados</title> \n" +
    "<meta charset = 'UTF-8'> \n" +
    "</head> \n" +
    "<body> \n" +
    "<br><br> \n" +
    "<center><h1>" +
    titulo +
    "</h1><br> \n" +
    "<style type='text/css'>table{background-color:#c4defb;}</style>\n" +
    "<div style ='over-flow: scroll;heigth:600px;width:80%;'><table>\n" +
    "<thead>\n" +
    "<tr>\n" +
    "<th>No</th>\n" +
    "<th>Tipo error</th>\n" +
    "<th>Linea</th>\n" +
    "<th>Columna</th>\n" +
    "<th>Descripcion</th>" +
    "</tr> \n" +
    "</thead>\n" +
    "<tbody> \n";
  listaToken.forEach((token) => {
    let Lexema = token.lexemaToken;
    if (token.lexemaToken.includes("<")) {
      Lexema = token.lexemaToken.replace("<", "[");
    } else if (token.lexemaToken.includes(">")) {
      Lexema = token.lexemaToken.replace(">", "]");
    } else {
      Lexema = token.lexemaToken;
    }
    html +=
      "" +
      "<tr> \n " +
      "<td>" +
      contador +
      "</td> \n" +
      "<td>" +
      "Lexico" +
      "</td> \n" +
      "<td>" +
      token.fila +
      "</td> \n" +
      "<td>" +
      token.columna +
      "</td> \n" +
      "<td>" +
      "El caracter " +
      Lexema +
      " no pertenece al lenguaje" +
      "</td> \n" +
      "</tr>\n";
    contador++;
  });
  listaSintactico.forEach((error) => {
    html +=
      "" +
      "<tr> \n " +
      "<td>" +
      contador +
      "</td> \n" +
      "<td>" +
      "Sintactico" +
      "</td> \n" +
      "<td>" +
      error.tokenActual.fila +
      "</td> \n" +
      "<td>" +
      error.tokenActual.columna +
      "</td> \n" +
      "<td>" +
      "Valor actual: " +
      error.tokenActual.tipoToken +
      " Se esperaba: " +
      error.tokenEsperado +
      "</td> \n" +
      "</tr>\n";
    contador++;
  });
  //CERRAR HTML
  html += "</tbody> \n </table></div> \n </center> \n </body> \n </html> \n";
  download("ReporteErrores.html", html);
}

//COMUNICACION CON LA GRAMATICA PARA QUE DEVUELVA EL AST
//TODO: CONFIGURAR BIEN LA PINCHE COMUNICACION
async function enviarData(txt) {
  url = "http://localhost:4200/parser";
  const data = { text: txt };
  const ast = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => {
      console.log("Success:", response.message);
      return response.AST;
    });
  return ast;
}
