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
    : InstruccionesFueraClase Instruccion_OutsideClass 
    | Instruccion_OutsideClass 
;
InstruccionesDentroClase
    : InstruccionesDentroClase Instruccion_InsideClass
    | Instruccion_InsideClass
;

BLOQUE_INS
    : LLAVE_APERTURA BLOQUE_INS_PRIMA LLAVE_CIERRE
    | LLAVE_APERTURA LLAVE_CIERRE
;   
BLOQUE_INS_PRIMA
    : BLOQUE_INS_PRIMA Instruccion_Functions
    | Instruccion_Functions
;
/*
    INTRUCCIONES SEPARADAS 
*/
Instruccion_OutsideClass
    : Import Class
    | Class
    | error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
   // | error TokEnd{ console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
;
Instruccion_InsideClass
    : Declaracion
    | FuncionMetodo
    | Clase
    | error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
 //   | error TokEnd{ console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
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
    | error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
;
/*DECLARACIONES*/

Declaracion
    :Tipo_Dato Declaracion1 PUNTO_COMA { $$ = instruccionesAPI.declaration0($1,$2) }
;
Declaracion1
    : Declaracion1 COMA Declaracion2 { $$ = instruccionesAPI.declaration1($1,$3,$2) }
    | Declaracion2 { $$ = instruccionesAPI.declaration1($1, undefined, undefined) }
;
Declaracion2
    : IDENTIFICADOR IGUAL Expresion { $$ = instruccionesAPI.instructionDeclaration($1,$2,$3) }
    | IDENTIFICADOR { $$ = instruccionesAPI.instructionDeclaration($1,undefined,undefined) }
;
Asignacion 
	: IDENTIFICADOR IGUAL Expresion PUNTO_COMA 
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
    | NOT Expresion  {$$ = instruccionesAPI.OperacionBinaria($2,undefined,"!")}
    | Expresion SUMA Expresion {$$ = instruccionesAPI.OperacionBinaria($1,$3,"+")}
    | Expresion RESTA Expresion {$$ = instruccionesAPI.OperacionBinaria($1,$3,"-")} 
    | Expresion MULTIPLICACION Expresion {$$ = instruccionesAPI.OperacionBinaria($1,$3,"*")} 
    | Expresion DIVISION Expresion {$$ = instruccionesAPI.OperacionBinaria($1,$3,"/")} 
    | Expresion MODULO Expresion {$$ = instruccionesAPI.OperacionBinaria($1,$3,"%")}
    | Expresion POTENCIA Expresion {$$ = instruccionesAPI.OperacionBinaria($1,$3,"^")}
    | Expresion AND Expresion {$$ = instruccionesAPI.OperacionBinaria($1,$3,"&&")}
    | Expresion OR Expresion {$$ = instruccionesAPI.OperacionBinaria($1,$3,"||")}
    | Expresion DOBLE_IGUAL Expresion {$$ = instruccionesAPI.OperacionBinaria($1,$3,"==")}
    | Expresion DIFERENTEA Expresion {$$ = instruccionesAPI.OperacionBinaria($1,$3,"!=")}
    | Expresion MENOR_IGUAL Expresion {$$ = instruccionesAPI.OperacionBinaria($1,$3,"<=")}
    | Expresion MENOR Expresion {$$ = instruccionesAPI.OperacionBinaria($1,$3,"<")}
    | Expresion MAYOR_IGUAL Expresion {$$ = instruccionesAPI.OperacionBinaria($1,$3,">=")}
    | Expresion MAYOR Expresion {$$ = instruccionesAPI.OperacionBinaria($1,$3,">")} 
    | DECIMAL {$$ = {NUMERO_DEC:$1}}
    | NUMERO {$$ = {NUMERO:$1}}
    | TRUE   {$$ = {LOGICO:$1}}
    | FALSE {$$ = {LOGICO:$1}}
    | CADENA {$$ = {CADENA:$1}}
    | CARACTER {$$ = {CARACTER:$1}}
    | IDENTIFICADOR {$$ = {ID:$1}} 
    | LlamarFuncion  
    | PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE
;
If 
    :IF PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE BLOQUE_INS OptionalElse
;
OptionalElse
    : %empty /* empty */
    | ELSE BLOQUE_INS
    | ELSE IF PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE BLOQUE_INS OptionalElse
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
    : DO BLOQUE_INS WHILE PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE PUNTO_COMA
;
While
    :WHILE PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE BLOQUE_INS 
;
FuncionMetodo
    : Tipo_Dato IDENTIFICADOR PARENTESIS_APERTURA FuncionPrima BLOQUE_INS 
    | VOID IDENTIFICADOR PARENTESIS_APERTURA FuncionPrima BLOQUE_INS 
    | VOID MAIN PARENTESIS_APERTURA PARENTESIS_CIERRE BLOQUE_INS 

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
    : IMPRIMIR PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE PUNTO_COMA { $$ = instruccionesAPI.instructionPrint($3) }
;
For
    :FOR PARENTESIS_APERTURA Declaracion Expresion PUNTO_COMA ListaAumentoFor PARENTESIS_CIERRE BLOQUE_INS
    |FOR PARENTESIS_APERTURA Declaracion1 PUNTO_COMA Expresion PUNTO_COMA ListaAumentoFor PARENTESIS_CIERRE BLOQUE_INS
;
ListaAumentoFor
    : ListaAumentoFor COMA Aumento
    | Aumento
;
Class
    : CLASS IDENTIFICADOR LLAVE_APERTURA InstruccionesDentroClase LLAVE_CIERRE { $$ = instruccionesAPI.instructionsClass($2,$4) }
    | CLASS IDENTIFICADOR LLAVE_APERTURA LLAVE_CIERRE { $$ = instruccionesAPI.instructionsClass($2,undefined) }
;
Import
    : Import IMPORT IDENTIFICADOR PUNTO_COMA { $$ = instruccionesAPI.init_Import($1,$3)}
    | IMPORT IDENTIFICADOR PUNTO_COMA { $$ = instruccionesAPI.instructionImport($2) }
;
LlamarFuncion
    : IDENTIFICADOR PARENTESIS_APERTURA Expresiones PARENTESIS_CIERRE { $$ = instruccionesAPI.instructionCallFunction($1,$3) }
    | IDENTIFICADOR PARENTESIS_APERTURA PARENTESIS_CIERRE { $$ = instruccionesAPI.instructionCallFunction($1, undefined) }   
;
Expresiones
    : Expresiones COMA Expresion
    | Expresion
;
Return
    : RETURN Expresion PUNTO_COMA
    | RETURN PUNTO_COMA
;