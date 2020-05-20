// Constantes para los tipos de 'valores' que reconoce nuestra gramática.
const TIPO_VALOR = {
	NUMERO:         'VAL_NUMERO',
	IDENTIFICADOR:  'VAL_IDENTIFICADOR',
    CADENA:         'VAL_CADENA', 
    CHARACTER:           'VAL_CHAR',
    BOOLEANO:        'VAL_BOOLEAN'
}
const TIPO_DATO = {
    STRING:     'STRING',
    INT:        'INT', 
    CHAR:       'CHAR',
    DOUBLE:     'DOUBLE',
	BOOLEAN:    'BOOLEAN',
	VOID: 		'VOID'
}

// Constantes para los tipos de 'operaciones' que soporta nuestra gramática.
const TIPO_OPERACION = {

    MAYOR_IGUAL: 	'OP_MAYOR_IGUAL',
	MENOR_IGUAL:    'OP_MENOR_IGUAL',
	DOBLE_IGUAL:    'OP_DOBLE_IGUAL',
    DIFERENTE_A:    'DIFERENTE_A',
    DECREMENTO:     'DECREMENTO',
    INCREMENTO:     'INCREMENTO',

	SUMA:           'OP_SUMA',
	RESTA:          'OP_RESTA',
	MULTIPLICACION: 'OP_MULTIPLICACION',
    DIVISION:       'OP_DIVISION',
    POTENCIA:       'OP_POTENCIA',
    MODULO:         'OP_MODULO',
	NEGATIVO:       'OP_NEGATIVO',
	MAYOR_QUE:      'OP_MAYOR_QUE',
	MENOR_QUE:      'OP_MENOR_QUE',

	AND:  			'OP_AND',
	OR: 			'OP_OR',
	NOT:   			'OP_NOT'
};

// Constantes para los tipos de 'instrucciones' válidas en nuestra gramática.
const TIPO_INSTRUCCION = {
	WHILE:          'INST_WHILE',
    DO_WHILE:       'INST_DO_WHILE',
    IF:             'INST_IF',
    ELSE:           'INST_ELSE',
    FOR:            'INST_FOR',
    SWITCH:         'INST_SWITCH',
    ASIGNACION:     'INST_ASIGNACION',
    IMPORT:         'INST_IMPORT',
    DECLARACION:    'INST_DECLARACION',
    WRITELINE:		'INST_WRITELINE',
	CLASS:          'INST_CLASS',
	FUNCION:		'INST_DECLA_FUNCION'
}

// Constantes para los tipos de OPCION_SWITCH validas en la gramática
const TIPO_OPCION_SWITCH = { 
	CASE: 			'CASE',
	DEFAULT: 		'DEFAULT'
} 

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


/**
 * El objetivo de esta API es proveer las funciones necesarias para la construcción de operaciones e instrucciones.
 */
const instruccionesAPI = {
	
	OperacionBinaria: function(left, right, op){
		return{
			IZQ: left,
			DER: right,
			Operador: op
		};
	},
	instructionAsig: function(id, value){
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
				DECLA1: list
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
	init_Import: function(imports, imp){
		return{
			IMPORTACIONES: imports,
			IMPORTACION: imp
		};
	},
	instructionImport: function(importacion){
		return{
			RESERVADA: "import",
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
			RESERVADA: "class",
			IDENTIFICADOR: identificadorClase,
			INST: instrucciones
		};
	},
	instructionPrint: function(res,valor) {
		return{
			RESERVADA: res,
			Valor: valor
		};
	},
	intructionReturn: function (valor) {
		return{
			RESERVADA: "return",
			Valor: valor
		};
	},
	instructionContinue: function (){
		return{
			RESERVADA: "continue"
		};
	},
	instructionBreak: function(){
		return{
			RESERVADA:"break"
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
			Tipo :"switch",
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
			TIPO: "if",
			Condicion: condicion,
			InstruccionesIF: instIF,
			Else: Else,
			ListadoElseIF: ListaElseIF 
		};
	},
	newElse: function(inst){
		return{
			TIPO: "else",
			instrucciones: inst
		};
	},
	newElseIf: function(condicion, instrucciones){
		return{
			TIPO: "else if",
			Condicion: condicion,
			Instrucciones: instrucciones
		};
	},
	newWhile: function(Expresion,instrucciones) {
		return {
			TIPO:"while" ,
			Condicion: Expresion,
			Instrucciones: instrucciones
		};
	},
	newDo_While: function(Expresion, instrucciones) {
		return {
			TIPO: "do while",
			Condicion: Expresion,
			Instrucciones: instrucciones
		};
	},
	newFunction: function(tipo,id,param,instr){
		return{
			TIPO_FUNCION: tipo,
			IDENTIFICADOR: id,
			PARAMETROS: param,
			INSTRUCCIONES : instr
		};
	},
	newFor: function(inicio_for, final_for, aumento_decremento, instrucciones){
		return{
			TIPO: "for",
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
	}

}
// Exportamos nuestras constantes y nuestra API

module.exports.TIPO_OPERACION = TIPO_OPERACION;
module.exports.TIPO_INSTRUCCION = TIPO_INSTRUCCION;
module.exports.TIPO_VALOR = TIPO_VALOR;
module.exports.instruccionesAPI = instruccionesAPI;
module.exports.TIPO_OPCION_SWITCH = TIPO_OPCION_SWITCH;
module.exports.TIPO_DATO = TIPO_DATO;