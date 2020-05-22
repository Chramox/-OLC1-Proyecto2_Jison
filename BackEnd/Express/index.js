const express = require("express");
const app = express();
const parser = require("../Gramatica/gramatica");
const morgan = require('morgan');
const cors = require('cors');
const instruccionesAPI = require("../Gramatica/instrucciones").instruccionesAPI;

const CONFIGURACION = {
    application:{
        cor:{
            server: [
                {
                    origin: "localhost:4200",
                    credentials: true
                }
            ]
        }
    }
};
app.set('json spaces', 2);
app.set('port', 4200);
app.use(morgan('dev'));
app.use(cors(CONFIGURACION.application.cor.server));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const getAST = {
    returnAST: function (input){
        let AST;
        try {
            AST =  parser.parse(input.toString());
            instruccionesAPI.clearListaErrores();
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
    console.log("texto: " + texto);
    const retornos =  getAST.returnAST(texto);
    const errores = JSON.stringify(retornos.ListaErrores, null, 2);
    res.send({ Salida: "SE COMPILO CORRECTAMENTE", AST: retornos.AST , ListaErrores: errores});  
    
});

app.listen(4200, () => {
 console.log("El servidor está inicializado en el puerto 4200");
});


module.exports = app;