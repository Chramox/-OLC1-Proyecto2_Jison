function onFileSelect(event) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = reader.result.toString().trim();
       
        let index =  localStorage.getItem("index");
        console.log('index ' + index);
        let nombre =  "entrada" + index;
        let entrada = document.getElementById(nombre);
        entrada.value = text;
        
        localStorage.setItem( nombre, this.selectedFile.name);
    }
    reader.readAsText(this.selectedFile);
    //METIENDO LA INFORMACION EN LA PESTAÑA ACTIVA
}

  function generarReporte(listaToken, listaSintactico){
    let titulo;
    //INICIO 
    let contador = 0;
    titulo = "Lista de Errores Encontrados";
    

    let html = "<!DOCTYPE html> \n" +
        "<html>\n" +
            "<head> \n" +
                "<title>Tokens Encontrados</title> \n" +
                "<meta charset = 'UTF-8'> \n" +
            "</head> \n" +
            "<body> \n" +
            "<br><br> \n" +
            "<center><h1>" + titulo + "</h1><br> \n" +
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
    listaToken.forEach(token => {
      let Lexema = token.lexemaToken;
      if (token.lexemaToken.includes('<'))
      {
          Lexema = token.lexemaToken.replace("<", "[");
      }
      else if (token.lexemaToken.includes('>'))
      {
          Lexema = token.lexemaToken.replace(">", "]");
      }
      else
      {
          Lexema = token.lexemaToken;
      }
      html += "" +
        "<tr> \n " +
            "<td>" + contador + "</td> \n"
            + "<td>" + "Lexico" + "</td> \n" +
            "<td>" + token.fila + "</td> \n" +
            "<td>" + token.columna + "</td> \n" +
            "<td>" + "El caracter " + Lexema + " no pertenece al lenguaje"+ "</td> \n" +
        "</tr>\n";
      contador++;
    });
    listaSintactico.forEach(error => {
      html += "" +
        "<tr> \n " +
            "<td>" + contador + "</td> \n"
            + "<td>" + "Sintactico" + "</td> \n" +
            "<td>" + error.tokenActual.fila + "</td> \n" +
            "<td>" + error.tokenActual.columna + "</td> \n" +
            "<td>" + "Valor actual: " + error.tokenActual.tipoToken + " Se esperaba: " + error.tokenEsperado +  "</td> \n" +
        "</tr>\n";
      contador++;
    });
    //CERRAR HTML
    html += "</tbody> \n </table></div> \n </center> \n </body> \n </html> \n";
    download('ReporteErrores.html', html);


}
