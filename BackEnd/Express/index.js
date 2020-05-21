const express = require("express");
const app = express();
var parser = require("../Gramatica/gramatica");

const getAST = {
    returnAST: function (input){
        let AST;
        try {
            AST =  parser.parse(input.toString());
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

    res.send({ Salida: "SE COMPILO CORRECTAMENTE", AST: arbolAST });
});

app.listen(3000, () => {
 console.log("El servidor está inicializado en el puerto 3000");
});


module.exports = app;