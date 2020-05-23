
/**
 * Esta función se encarga de crear objetos Tipo Operación.
 * Recibe como parámetros el operando izquierdo y el operando derecho.
 * También recibe como parámetro el Tipo del operador
 * @param {*} operandoIzq 
 * @param {*} operandoDer 
 * @param {*} Tipo 
 */
function nuevaOperacion(operandoIzq, operandoDer, Tipo) {
	return {
		operandoIzq: operandoIzq,
		operandoDer: operandoDer,
		Tipo: Tipo
	};
}

//lista de errores lexicos y sintacticos
let ListaErrores = new Array();
/**
 * El objetivo de esta API es proveer las funciones necesarias para la construcción de operaciones e instrucciones.
 */
const instruccionesAPI = {
	
	errorLexico:function(error,linea, columna){
		return{
			TIPO_ERROR: "LEXICO",
			Error: error,
			Linea: linea,
			Columna: columna
		};
	},
	errorSintactico: function(error){
		console.log("ERROR SINTACTICO");
		return{
			TIPO_ERROR: "SINTACTICO",
			Error: error
		};
	},
	erroresSintacticos: function(lista){
		lista.forEach(element => {
			ListaErrores.push(element);
		});
	},
	OperacionBinaria: function(left, right, op){
		return{
			IZQ: left,
			DER: right,
			Operador: op
		};
	},
	instructionAsign: function(id, value){
		return{
			ID: id,
			Valor: value
		};
	},
	instructionPlusMenus1: function(id, sign){
		return{
			ID: id,
			INST: sign
		};
	},
	declaration0: function(type, list){
		return{
			Declaracion:{
				TIPO: type,
				ListaDeclaraciones: list
			}
		};
	},
	declaration1: function(dec, decla2, comita){
		return{
			DECLA1: dec,
			COMA: comita,
			DECLA2: decla2
		};
	},
	instructionDeclaration: function(id, asig, expr){
		return{
			IDENTIFICADOR: id,
			ASIG: asig,
			EXPRESION: expr
		};
	},
	instructionImport: function(importacion){
		return{
			TIPO_INST: "import",
			IDENTIFICADOR: importacion 
		};
	},
	instructionsINIT: function(imports, classes) {
		return{
			IMPORTACIONES: imports,
			CLASES: classes
		};
	},
	instructionListClass: function(c1,c2){
		return{
			CLASES:c1,
			CLASE: c2
		};
	},
	blockInsClass: function(instrucciones, inst){
		return{
			INSTRUCCIONES: instrucciones,
			INSTRUCCION:  inst
		};
	},
	instructionClass: function(identificadorClase, instrucciones) {
		return{
			TIPO_INST: "class",
			IDENTIFICADOR: identificadorClase,
			INST: instrucciones
		};
	},
	instructionPrint: function(res,valor) {
		return{
			TIPO_INST: res,
			Valor: valor
		};
	},
	instructionReturn: function (valor) {
		return{
			TIPO_INST: "return",
			Valor: valor
		};
	},
	instructionContinue: function (){
		return{
			TIPO_INST: "continue"
		};
	},
	instructionBreak: function(){
		return{
			TIPO_INST:"break"
		};
	},
	instructionCallFunction: function(ID, lista_param){
		return{
			IDENTIFICADOR: ID,
			PARAMETROS: lista_param
		};
	},
	/*
		SENTENCIAS DE EJECUCION Y CICLOS
	*/
	newSwitch: function(condicion, ListaCase){
		return{
			TIPO_INST: "switch",
			Condicion: condicion,
			ListadoCase: ListaCase
		};
	},
	newCase: function(expresion, instrucciones){
		return{
			Case: expresion,
			Instrucciones: instrucciones
		};
	},
	newIf: function(condicion, instIF, ListaElseIF, Else){
		return{
			TIPO_INST: "if",
			Condicion: condicion,
			InstruccionesIF: instIF,
			Else: Else,
			ListadoElseIF: ListaElseIF 
		};
	},
	newElse: function(inst){
		return{
			TIPO_INST: "else",
			instrucciones: inst
		};
	},
	newElseIf: function(condicion, instrucciones){
		return{
			TIPO_INST: "else if",
			Condicion: condicion,
			Instrucciones: instrucciones
		};
	},
	newWhile: function(Expresion,instrucciones) {
		return {
			TIPO_INST:"while" ,
			Condicion: Expresion,
			Instrucciones: instrucciones
		};
	},
	newDo_While: function(Expresion, instrucciones) {
		return {
			TIPO_INST: "do while",
			Condicion: Expresion,
			Instrucciones: instrucciones
		};
	},
	newFunction: function(tipo,id,param,instr){
		return{
			TIPO_INST: "funcion",
			TIPO_FUNCION: tipo,
			IDENTIFICADOR: id,
			PARAMETROS: param,
			INSTRUCCIONES : instr
		};
	},
	newFor: function(inicio_for, final_for, aumento_decremento, instrucciones){
		return{
			TIPO_INST: "for",
			InicioFor: inicio_for,
			CondicionFinalizacion: final_for,
			Recorrido: aumento_decremento,
			Instrucciones: instrucciones
		};
	},
	newParam: function(tipo, id){
		return{
			TIPO_DATO: tipo,
			ID: id
		};
	},
	clearListaErrores: function(){
		ListaErrores = new Array();
	},
	pushError: function(info){
		ListaErrores.push(info);
	},
	getListaErrores:function(){
		return ListaErrores;
	}
}
// Exportamos nuestras constantes y nuestra API


module.exports.instruccionesAPI = instruccionesAPI;
