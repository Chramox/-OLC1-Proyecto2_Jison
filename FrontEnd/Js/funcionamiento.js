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
subirArchivo.addEventListener('change', onFileSelectPrincipal, false);
const subirArchivoCopia = document.getElementById("subirArchivoCopia");
subirArchivoCopia.addEventListener('change', onFileSelectCopia, false);

function guardarArchivoPrincipal(){
    let nombreArchivo;
    if(nombreArchivoPrincipal === ""){
        nombreArchivo = "editor_principal.java";
    }
    else{
        nombreArchivo = nombreArchivoPrincipal;
    }
    var editor = ace.edit("editor_secundario");
    let informacion = editor.getValue();

    download(nombreArchivo, informacion);
}

//GUARDAR ARCHIVO COPIA
function guardarArchivoB(){
    let nombreArchivo =  document.getElementById("nombre").value + ".java";
    var editor = ace.edit("editor_secundario");
    let informacion = editor.getValue();
    if(nombreArchivo === "")
        alert("Escriba un nombre para el archivo");
    else
    download(nombreArchivo, informacion);
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
/**
 * ANALISIS DE LOS ARCHIVOS PARA ENCONTRAR COPIAS
 */
function arbolAST(json)
{
  document.getElementById("arbol_AST").innerHTML = "";
  document.getElementById("arbol_AST").appendChild(renderjson(json));
}
//PETICION AL SERVIDOR ARBOL ARCHIVO PRINCIPAL
function arbol_A(){
  var editor = ace.edit("editor");
  let textA = editor.getValue();
  console.log(textA);
  if (textA != ""){
    getAST_ArchivoA(textA);

  }
  
}



async function getAST_ArchivoA(txt) {
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
      arbolAST(response.AST);
    });
}

//PETICION AL SERVIDOR ARBOL ARCHIVO SECUNDARIO




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