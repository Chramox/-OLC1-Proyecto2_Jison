const express = require("express");
const app = express();
const parser = require("../Gramatica/gramatica");
const instruccionesAPI = require("../Gramatica/instrucciones").instruccionesAPI;

const getAST = {
    returnAST: function (input){
        let AST;
        try {
            AST =  parser.parse(input.toString());
            instruccionesAPI.setListaErrores();
            return AST;
        } catch (error) {
            console.error(error);
            return;
        }
    }
}

app.get('/', (req, res) => {
    res.send('Saludos desde express');
});

app.get('/send', (req, res) => {
    res.send('Envio de DATA');
});

app.post('/parser', (req, res) => {

    const texto = req.body.text;
    const arbolAST =  getAST.returnAST(texto);
    const jsonAST = JSON.stringify(arbolAST.AST, null,4);
    const errores;
    res.send({ Salida: "SE COMPILO CORRECTAMENTE", AST: jsonAST , ListaErrores: errores});
});

app.listen(4200, () => {
 console.log("El servidor está inicializado en el puerto 4200");
});


module.exports = app;