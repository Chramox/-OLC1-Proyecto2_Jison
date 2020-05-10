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

	/**
	 * Crea un nuevo objeto Tipo Operación para las operaciones binarias válidas.
	 * @param {*} operandoIzq 
	 * @param {*} operandoDer 
	 * @param {*} Tipo 
	 */
	newBinaryOperation: function(operandoIzq, operandoDer, Tipo) {
		return nuevaOperacion(operandoIzq, operandoDer, Tipo);
	},

	/**
	 * Crea un nuevo objeto Tipo Operación para las operaciones unarias válidas
	 * @param {*} operando 
	 * @param {*} Tipo 
	 */
	newUnaryOperation: function(operando, Tipo) {
		return nuevaOperacion(operando, undefined, Tipo);
	},

	/**
	 * Crea un nuevo objeto Tipo Valor, esto puede ser una cadena, un número o un identificador
	 * @param {*} valor 
	 * @param {*} Tipo 
	 */
	newValue: function(valor, Tipo) {
		return {
			Valor: valor,
			Tipo: Tipo
		};
	},
	// OPERACIONES PERMITIDAS AFUERA DE LA CLASE
	/**
	 * Crea un objeto Tipo Instrucción para la sentencia Mientras.
	 * @param {*} ID 
	 * @param {*} instrucciones 
	 */
	newClass: function(ID, instrucciones) {
		return {
			Tipo: TIPO_INSTRUCCION.CLASS,
			ID : ID,
			Instrucciones: instrucciones
		};
	},
	/**
	 * Crea un objeto Tipo Instrucción
	 * @param {*} ID 
	 */
	newImport: function(ID) {
		return {
			Identificador : ID,
			Tipo: TIPO_INSTRUCCION.IMPORT,
		}
	},
	// FUNCIONES PERMITIDAS DENTRO DE LA CLASE
	/**
	 * Crea un objeto Tipo Instrucción para la sentencia Declaración.
	 * @param {*} Tipo 
	 * @param {*} identificador 
	 * @param {*} instrucciones
	 */
	newFunction: function(Tipo,identificador, instrucciones) {
		var data_type;
		switch(Tipo){
			case "int": data_type = TIPO_DATO.INT ; break;
			case "boolean": data_type = TIPO_DATO.BOOLEAN ; break;
			case "String": data_type = TIPO_DATO.STRING ; break;
			case "char": data_type = TIPO_DATO.CHAR ; break;
			case "double": data_type = TIPO_DATO.DOUBLE; break;
			case "void": data_type = TIPO_DATO.VOID; break;
		}
		return {
			Tipo: TIPO_INSTRUCCION.FUNCION,
			ID: identificador,
			Tipo_Dato: data_type,
			Instrucciones: instrucciones
		}
	},
	/**
	 * Crea un objeto Tipo Instrucción para la sentencia Imprimir.
	 * @param {*} Impresion
	 */
	newPrint: function(Impresion) {
		return {
			Tipo: TIPO_INSTRUCCION.IMPRIMIR,
			Impresion: Impresion
		};
	},

	
	/**
	 * Crea un objeto Tipo Instrucción para la sentencia IF.
	 * @param {*} Expresion
	 * @param {*} instrucciones 
	 */
	newWhile: function(Expresion, instrucciones) {
		return {
			Tipo: TIPO_INSTRUCCION.WHILE,
			Condicion: Expresion,
			instrucciones: instrucciones
		};
	},
	/**
	 * Crea un objeto Tipo Instrucción para la sentencia IF.
	 * @param {*} Expresion
	 * @param {*} instrucciones 
	 */
	newDo_While: function(Expresion, instrucciones) {
		return {
			Tipo: TIPO_INSTRUCCION.DO_WHILE,
			Condicion: Expresion,
			instrucciones: instrucciones
		};
	},


	/**
	 * Crea un objeto Tipo instrucción para la sentencia Para.
	 * @param {*} expresionLogica
	 * @param {*} instrucciones
	 * @param {*} aumento
	 * @param {*} decremento
	 */
	nuevoPara: function (variable, valorVariable, expresionLogica, aumento, instrucciones) {
		return {
			Tipo: TIPO_INSTRUCCION.PARA,
			expresionLogica: expresionLogica,
			instrucciones: instrucciones,
			aumento: aumento,
			variable: variable,
			valorVariable: valorVariable
		}
	},

	/**
	 * Crea un objeto Tipo Instrucción para la sentencia Declaración.
	 * @param {*} Tipo 
	 * @param {*} instrucciones
	 * @param {*} identificador 
	 */
	newDeclaration: function(Tipo,identificador) {
		var data_type;
		switch(Tipo){
			case "int": data_type = TIPO_DATO.INT ; break;
			case "boolean": data_type = TIPO_DATO.BOOLEAN ; break;
			case "String": data_type = TIPO_DATO.STRING ; break;
			case "char": data_type = TIPO_DATO.CHAR ; break;
			case "double": data_type = TIPO_DATO.DOUBLE; break;
		}
		return {
			Tipo: TIPO_INSTRUCCION.DECLARACION,
			identificador: identificador,
			tipo_dato: data_type
		}
	},
	newDeclarationAsignament: function(identificador, Tipo, expresion){
		return{
			Tipo: TIPO_INSTRUCCION.DECLARACION,
			identificador: identificador,
			tipo_dato: Tipo,
			expresion: expresion
		}
	},
	/**
	 * Crea un objeto Tipo Instrucción para la sentencia Asignación.
	 * @param {*} identificador 
	 * @param {*} expresionNumerica 
	 */
	newAsignament: function(identificador, expresion) {
		return {
			Tipo: TIPO_INSTRUCCION.ASIGNACION,
			Identificador: identificador,
			Valor: expresion
		}
	},

	/**
	 * Crea un objeto Tipo Instrucción para la sentencia If.
	 * @param {*} expresionLogica 
	 * @param {*} instrucciones 
	 */
	newIf: function(expresionLogica, instrucciones) {
		return {
			Tipo: TIPO_INSTRUCCION.IF,
			expresionLogica: expresionLogica,
			instrucciones: instrucciones
		}
	},

	/**
	 * Crea un objeto Tipo Instrucción para la sentencia If-Else.
	 * @param {*} expresionLogica 
	 * @param {*} instruccionesIfVerdadero 
	 * @param {*} instruccionesIfFalso 
	 */
	newIfElse: function(expresionLogica, instruccionesIfVerdadero, instruccionesIfFalso) {
		return {
			Tipo: TIPO_INSTRUCCION.IF_ELSE,
			expresionLogica: expresionLogica,
			instruccionesIfVerdadero: instruccionesIfVerdadero,
			instruccionesIfFalso: instruccionesIfFalso
		}
	},
  
	/**
	 * Crea un objeto Tipo Instrucción para la sentencia Switch.
	 * @param {*} expresionNumerica 
	 * @param {*} instrucciones 
	 */
	nuevoSwitch: function(expresionNumerica, casos) {
		return {
			Tipo: TIPO_INSTRUCCION.SWITCH,
			expresionNumerica: expresionNumerica,
			casos: casos
		}
	},

	/**
	 * Crea una lista de casos para la sentencia Switch.
	 * @param {*} caso 
	 */
	nuevoListaCasos: function (caso) {
		var casos = []; 
		casos.push(caso);
		return casos;
	},

	/**
	 * Crea un objeto Tipo OPCION_SWITCH para una CASO de la sentencia switch.
	 * @param {*} expresionNumerica 
	 * @param {*} instrucciones 
	 */
	nuevoCaso: function(expresionNumerica, instrucciones) {
		return {
			Tipo: TIPO_OPCION_SWITCH.CASO,
			expresionNumerica: expresionNumerica,
			instrucciones: instrucciones
		}
	},
	/**
	 * Crea un objeto Tipo OPCION_SWITCH para un CASO DEFECTO de la sentencia switch.
	 * @param {*} instrucciones 
	 */
	nuevoCasoDef: function(instrucciones) {
		return {
			Tipo: TIPO_OPCION_SWITCH.DEFECTO,
			instrucciones: instrucciones
		}
	},
    
	/**
	* Crea un objeto Tipo Operador (+ , - , / , *) 
	* @param {*} operador 
	*/
	nuevoOperador: function(operador){
		return operador 
	},
 
	/**
	 * Crea un objeto Tipo Instrucción para la sentencia Asignacion con Operador
	 * @param {*} identificador 
	 * @param {*} operador 
	 * @param {*} expresionCadena 
	 */
	nuevoAsignacionSimplificada: function(identificador, operador , expresionNumerica){
		return{
			Tipo: TIPO_INSTRUCCION.ASIGNACION_SIMPLIFICADA,
			operador : operador,
			expresionNumerica: expresionNumerica,
			identificador : identificador
		} 
	}
}
// Exportamos nuestras constantes y nuestra API

module.exports.TIPO_OPERACION = TIPO_OPERACION;
module.exports.TIPO_INSTRUCCION = TIPO_INSTRUCCION;
module.exports.TIPO_VALOR = TIPO_VALOR;
module.exports.instruccionesAPI = instruccionesAPI;
module.exports.TIPO_OPCION_SWITCH = TIPO_OPCION_SWITCH;
module.exports.TIPO_DATO = TIPO_DATO;