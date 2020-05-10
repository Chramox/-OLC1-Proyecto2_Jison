/*HACIENDO ANALISIS LEXICO Y SINTACTICO CON JISON*/

/* Definición Léxica */
%lex


%options case-sensitive
%%
\s+											// se ignoran espacios en blanco
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

// PALABRAS RESERVADAS

//TIPOS DE DATOS
"int"                               return 'INT';
"char"                              return 'CHAR';
"String"                            return 'STRING';
"double"                            return 'DOUBLE';
"boolean"                           return 'BOOLEAN';

";"                                 return 'PUNTO_COMA';   
","                                 return 'COMA';      
":"                                 return 'DOS_PUNTOS';  

"++"                                return 'INCREMENTO';        
"--"                                return 'DECREMENTO'; 
//OPERADORES
 
">="                                return 'MAYOR_IGUAL';        
"<="                                return 'MENOR_IGUAL';
">"                                 return 'MAYOR';             
"<"                                 return 'MENOR'; 
"!="                                return 'DIFERENTEA';   
"=="                                return 'DOBLE_IGUAL';   
"!"                                 return 'NOT';
"="                                 return 'IGUAL';   
"||"                                return 'OR';           
"&&"                                return 'AND';     
// OPERADORES
"+"                                 return 'SUMA';
"-"                                 return 'RESTA';  
"/"                                 return 'DIVISION';      
"*"                                 return 'MULTIPLICACION';
"^"                                 return 'POTENCIA';
"%"                                 return 'MODULO';

"("                                 return 'PARENTESIS_APERTURA';
")"                                 return 'PARENTESIS_CIERRE'; 
"{"                                 return 'LLAVE_APERTURA';     
"}"                                 return 'LLAVE_CIERRE';
//RESERVADAS DE JAVA
"true"                              return 'TRUE';
"false"                             return 'FALSE';
"class"                             return 'CLASS';
"import"                            return 'IMPORT';
"continue"                          return 'CONTINUE';
"void"                              return 'VOID';
"return"                            return 'RETURN';
"main"                              return 'MAIN';

"if"                                return 'IF';
"else"                              return 'ELSE';
"while"                             return 'WHILE';
"do"                                return 'DO';
"for"                               return 'FOR';
"switch"                            return 'SWITCH';
"case"				                return 'CASE';
"default"			                return 'DEFAULT';
"break"                             return 'BREAK';
"System.out.println"                return "IMPRIMIR";
"System.out.print"                  return "IMPRIMIR";

\"[^\"]*\"              { yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
\'[^\']*\'              { yytext = yytext.substr(1,yyleng-2); return 'CARACTER'; }
[0-9]+("."[0-9]+)?\b    return 'DECIMAL';
[0-9]+\b                return 'ENTERO';
([a-zA-Z_])[a-zA-Z0-9_]* return 'IDENTIFICADOR';

<<EOF>>                return 'EOF';
.                    { console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }
/lex
/*
*   ANALISIS SINTACTICO  
*/
%{
	const TIPO_OPERACION	= require('./instrucciones').TIPO_OPERACION;
	const TIPO_VALOR 		= require('./instrucciones').TIPO_VALOR;
	const TIPO_DATO			= require('./instrucciones').TIPO_DATO; //para jalar el tipo de dato
	const instruccionesAPI	= require('./instrucciones').instruccionesAPI;
%}
/* Asociación de operadores y precedencia */
%left 'AND' 'OR'
%left 'DOBLE_IGUAL' 'DIFERENTEA'
%left 'MENOR' 'MENOR_IGUAL' 'MAYOR' 'MAYOR_IGUAL'
%left 'SUMA' 'RESTA'
%left 'MULTIPLICACION' 'DIVISION'
%left 'POTENCIA' 'MODULO'
%left UMENOS
%right 'NOT'
%right 'INCREMENTO' 'DECREMENTO'
// TODO: CAMBIAR ACCESO PARA AFUERA, DENTRO DE CLASE, AHORITA NO ESTAN, ESTAMOS PROBANDO ARBOL

/* Asociación de operadores y precedencia */
%start ini

%% /* Definición de la gramática */

ini
	:InstruccionesFueraClase EOF{
		// cuado se haya reconocido la entrada completa retornamos el AST
		return $1;
	}
;
InstruccionesFueraClase
    : InstruccionesFueraClase Instruccion_OutsideClass { $1.push($2); $$ = $1; }
    | Instruccion_OutsideClass { $$ = [$1]; }
;
InstruccionesDentroClase
    : InstruccionesDentroClase Instruccion_InsideClass { $1.push($2); $$ = $1; }
    | Instruccion_InsideClass   { $$ = [$1]; }
;
InstruccionesMetodo_Funciones
    : InstruccionesMetodo_Funciones Instruccion_Functions { $1.push($2); $$ = $1; }
    | Instruccion_Functions { $$ = [$1]; }
;
/*
    INTRUCCIONES SEPARADAS 
*/
Instruccion_OutsideClass
    : Import Class
    | FuncionMetodo
    | Instruccion_Functions
    | error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
;
Instruccion_InsideClass
    : Declaracion
    | FuncionMetodo
    | Clase
    | error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
;
Instruccion_Functions
    : Declaracion	
    | Asignacion
    | If		
    | For
    | While	
    | Do
    | Switch
    | Imprimir
    | Class
    | BREAK PUNTO_COMA
    | CONTINUE PUNTO_COMA
    | Return
    | LlamarFuncion PUNTO_COMA
;
/*DECLARACIONES*/

Declaracion
    :Tipo_Dato Declaracion1 PUNTO_COMA {$$ = instruccionesAPI.newDeclaration($1,$2); }
;
Declaracion1
    : Declaracion1 COMA Declaracion2
    | Declaracion2
;
Declaracion2
    : IDENTIFICADOR IGUAL Expresion 
    | IDENTIFICADOR 
;
Asignacion 
	: IDENTIFICADOR IGUAL Expresion PUNTO_COMA {$$ = instruccionesAPI.newAsignament($1,$3); }
    | Aumento PUNTO_COMA
;
Aumento
    : IDENTIFICADOR INCREMENTO
    | IDENTIFICADOR DECREMENTO
;
Tipo_Dato
    :INT    
    |CHAR
    |DOUBLE
    |BOOLEAN
    |STRING
;
Expresion 
    : RESTA Expresion %prec UMENOS
    | NOT Expresion
    | Expresion SUMA Expresion {$$ = instruccionesAPI.newBinaryOperation($1, $3, TIPO_OPERACION.SUMA); }
    | Expresion RESTA Expresion {$$ = instruccionesAPI.newBinaryOperation($1, $3, TIPO_OPERACION.RESTA); }
    | Expresion MULTIPLICACION Expresion {$$ = instruccionesAPI.newBinaryOperation($1, $3, TIPO_OPERACION.MULTIPLICACION); }
    | Expresion DIVISION Expresion {$$ = instruccionesAPI.newBinaryOperation($1, $3, TIPO_OPERACION.DIVISION); }
    | Expresion MODULO Expresion
    | Expresion POTENCIA Expresion {$$ = instruccionesAPI.newBinaryOperation($1, $3, TIPO_OPERACION.POTENCIA); }
    | Expresion AND Expresion {$$ = instruccionesAPI.newBinaryOperation($1, $3, TIPO_OPERACION.AND); }
    | Expresion OR Expresion {$$ = instruccionesAPI.newBinaryOperation($1, $3, TIPO_OPERACION.OR); }
    | Expresion DOBLE_IGUAL Expresion {$$ = instruccionesAPI.newBinaryOperation($1, $3, TIPO_OPERACION.DOBLE_IGUAL); } 
    | Expresion DIFERENTEA Expresion {$$ = instruccionesAPI.newBinaryOperation($1, $3, TIPO_OPERACION.DIFERENTEA); }
    | Expresion MENOR_IGUAL Expresion {$$ = instruccionesAPI.newBinaryOperation($1, $3, TIPO_OPERACION.MENOR_IGUAL); }
    | Expresion MENOR Expresion {$$ = instruccionesAPI.newBinaryOperation($1, $3, TIPO_OPERACION.MENOR); }
    | Expresion MAYOR_IGUAL Expresion {$$ = instruccionesAPI.newBinaryOperation($1, $3, TIPO_OPERACION.MAYOR_IGUAL); }
    | Expresion MAYOR Expresion {$$ = instruccionesAPI.newBinaryOperation($1, $3, TIPO_OPERACION.MAYOR); }
    | DECIMAL { $$ = instruccionesAPI.newValue($1, TIPO_VALOR.NUMERO); }
    | NUMERO { $$ = instruccionesAPI.newValue(Number($1), TIPO_VALOR.NUMERO); }
    | TRUE   { $$ = instruccionesAPI.newValue($1, TIPO_VALOR.TRUE); }
    | FALSE { $$ = instruccionesAPI.newValue($1, TIPO_VALOR.FALSE); }
    | CADENA { $$ = instruccionesAPI.newValue($1, TIPO_VALOR.CADENA); }
    | CARACTER { $$ = instruccionesAPI.newValue($1, TIPO_VALOR.CARACTER); }
    | IDENTIFICADOR { $$ = instruccionesAPI.newValue($1, TIPO_VALOR.IDENTIFICADOR); }
    | LlamarFuncion  { $$ = instruccionesAPI.newValue($1, TIPO_VALOR.IDENTIFICADOR); }
    | PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE
;
If 
    :IF PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE LLAVE_APERTURA InstruccionesMetodo_Funciones LLAVE_CIERRE OptionalElse
;
OptionalElse
    : %empty /* empty */
    | ELSE LLAVE_APERTURA InstruccionesMetodo_Funciones LLAVE_CIERRE
    | ELSE IF PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE LLAVE_APERTURA InstruccionesMetodo_Funciones LLAVE_CIERRE OptionalElse
;
Switch
    : SWITCH PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE LLAVE_APERTURA Lista_Case LLAVE_CIERRE
;
Lista_Case
    : Lista_Case Case
    | Case
;
Case
    : CASE Expresion DOS_PUNTOS InstruccionesMetodo_Funciones BREAK PUNTO_COMA
    | DEFAULT DOS_PUNTOS InstruccionesMetodo_Funciones
;
Do
    : DO LLAVE_APERTURA InstruccionesMetodo_Funciones LLAVE_CIERRE WHILE PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE PUNTO_COMA
        { $$ = instruccionesAPI.newDo_While($7, $3); }
;
While
    :WHILE PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE LLAVE_APERTURA InstruccionesMetodo_Funciones LLAVE_CIERRE 
        { $$ = instruccionesAPI.newWhile($3, $6); }
;
FuncionMetodo
    : Tipo_Dato IDENTIFICADOR PARENTESIS_APERTURA FuncionPrima LLAVE_APERTURA InstruccionesMetodo_Funciones LLAVE_CIERRE 
        {$$ = instruccionesAPI.newFunction($1, $2, $6 ); }
    | VOID IDENTIFICADOR PARENTESIS_APERTURA FuncionPrima LLAVE_APERTURA InstruccionesMetodo_Funciones LLAVE_CIERRE 
        {$$ = instruccionesAPI.newFunction($1, $2, $6); }
    | VOID MAIN PARENTESIS_APERTURA PARENTESIS_CIERRE LLAVE_APERTURA InstruccionesMetodo_Funciones LLAVE_CIERRE 
        {$$ = instruccionesAPI.newFunction($1, $2, $6 ); }
;
FuncionPrima
    :Parametros PARENTESIS_CIERRE
    |PARENTESIS_CIERRE
;
Parametros
    :Parametros COMA Tipo_Dato IDENTIFICADOR
    | Tipo_Dato IDENTIFICADOR
;
Imprimir
    : IMPRIMIR PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE PUNTO_COMA
;
For
    :FOR PARENTESIS_APERTURA Declaracion Expresion PUNTO_COMA ListaAumentoFor PARENTESIS_CIERRE LLAVE_APERTURA InstruccionesMetodo_Funciones LLAVE_CIERRE
    |FOR PARENTESIS_APERTURA Declaracion1 PUNTO_COMA Expresion PUNTO_COMA ListaAumentoFor PARENTESIS_CIERRE LLAVE_APERTURA InstruccionesMetodo_Funciones LLAVE_CIERRE
;
ListaAumentoFor
    : ListaAumentoFor COMA Aumento
    | Aumento
;
Class
    : CLASS IDENTIFICADOR LLAVE_APERTURA InstruccionesDentroClase LLAVE_CIERRE { $$ = instruccionesAPI.newClass($2, $4); }
;
Import
    : Import IMPORT IDENTIFICADOR PUNTO_COMA { $$ = instruccionesAPI.newImport($3); }
    | IMPORT IDENTIFICADOR PUNTO_COMA { $$ = instruccionesAPI.newImport($2); }
;
LlamarFuncion
    : IDENTIFICADOR PARENTESIS_APERTURA Lista_Exp
;
Lista_Exp
    : Expresiones PARENTESIS_CIERRE
    | PARENTESIS_CIERRE
;
Expresiones
    : Expresiones COMA Expresion
    | Expresion
;
Return
    : RETURN Expresion PUNTO_COMA
    | RETURN PUNTO_COMA
;