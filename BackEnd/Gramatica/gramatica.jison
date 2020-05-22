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

\"([^\\\"]|\\.)*\"      { yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
\'[^\']*\'              { yytext = yytext.substr(1,yyleng-2); return 'CARACTER'; }
[0-9]+("."[0-9]+)?\b    return 'DECIMAL';
[0-9]+\b                return 'ENTERO';
([a-zA-Z_])[a-zA-Z0-9_]* return 'IDENTIFICADOR';

<<EOF>>                return 'EOF';
.                    { console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); 
                       instruccionesAPI.pushError(instruccionesAPI.errorLexico(yytext,yylloc.first_line,yylloc.first_column));     }

/lex
/*
*   ANALISIS SINTACTICO  
*/


%{
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

/* Asociación de operadores y precedencia */
%start ini

%% /* Definición de la gramática */
/**/
ini
    : Imports ClassINIT  EOF{  return instruccionesAPI.instructionsINIT($1,$2) }
    | ClassINIT EOF{ return instruccionesAPI.instructionsINIT(undefined,$1) }
    | error EOF { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
;
/*
ClassINIT
    : ClassINIT Class  {$$ =  instruccionesAPI.instructionListClass($1,$2)}
    | Class
        { console.error('Este es un error sintáctico: ' + yy.parser.hash.token +  ', en la linea: ' + @1.first_line + ', en la columna: ' + @1.first_column + " se esperaba: " + yy.parser.hash.expected ); 
        instruccionesAPI.pushLista(instruccionesAPI.errorLS("Sintactico", yy.parser.hash.expected, yy.parser.hash.token, @1.first_line, @1.first_column)); }
;
Imports
    : Imports IMPORT IDENTIFICADOR PUNTO_COMA  { $1.push(instruccionesAPI.instructionImport($3)); $$ = $1 }
    | IMPORT IDENTIFICADOR PUNTO_COMA {$$ = [instruccionesAPI.instructionImport($2)]}
;
*/
ClassINIT
    : Class { $$ = [$1] }
    | ClassINIT Class  {  $1.push($2); $$ = $1 }
    | ClassINIT error 
        { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); 
          instruccionesAPI.pushError(instruccionesAPI.errorSintactico(yytext,yy.parser.hash.expected,this._$.first_line, this._$.first_column));  }
;
Class
    : CLASS IDENTIFICADOR LLAVE_APERTURA InstruccionesDentroClase LLAVE_CIERRE { $$ = instruccionesAPI.instructionClass($2,$4) }
    | CLASS IDENTIFICADOR LLAVE_APERTURA LLAVE_CIERRE { $$ = instruccionesAPI.instructionClass($2,undefined) }
;
InstruccionesDentroClase
    : InstruccionesDentroClase Instruccion_InsideClass {  $1.push($2); $$ = $1 }
    | Instruccion_InsideClass { $$ = [$1] }
;
BLOQUE_INS
    : LLAVE_APERTURA BLOQUE_INS_PRIMA LLAVE_CIERRE {$$ = $2}
    | LLAVE_APERTURA LLAVE_CIERRE
;   
BLOQUE_INS_PRIMA
    : BLOQUE_INS_PRIMA Instruccion_Functions {  $1.push($2); $$ = $1 }
    | Instruccion_Functions  { $$ = [$1] }
;
BloqueCASES //NO LLEVAN LLAVES OBLIGATORIAS
    : LLAVE_APERTURA BLOQUE_INS_PRIMA LLAVE_CIERRE
    | BLOQUE_INS_PRIMA
;  
/*
    INTRUCCIONES SEPARADAS 
*/

Instruccion_InsideClass
    : Declaracion
    | FuncionMetodo
    | Clase
    | error 
        { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); 
         instruccionesAPI.pushError(instruccionesAPI.errorSintactico(yytext,yy.parser.hash.expected,this._$.first_line, this._$.first_column));  }
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
    | BREAK PUNTO_COMA { $$ = instruccionesAPI.instructionBreak() }
    | CONTINUE PUNTO_COMA { $$ = instruccionesAPI.instructionContinue() }
    | Return 
    | LlamarFuncion PUNTO_COMA
    | error   
        { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); 
          instruccionesAPI.pushError(instruccionesAPI.errorSintactico(yytext,yy.parser.hash.expected,this._$.first_line, this._$.first_column));  }
;
/*DECLARACIONES*/
/*
ListELSEIF //viene por lo menos un else if
    : ListELSEIF  Elseif {  $1.push($2); $$ = $1 }
    | Elseif  { $$ = [$1] }
;
*/
Declaracion
    :Tipo_Dato Declaracion1 PUNTO_COMA { $$ = instruccionesAPI.declaration0($1,$2) }
;
Declaracion1
    : Declaracion1 COMA Declaracion2 {$1.push($3); $$ = $1 }
    | Declaracion2 {$$ = [$1]}
;
Declaracion2
    : IDENTIFICADOR IGUAL Expresion { $$ = instruccionesAPI.instructionDeclaration($1,$2,$3) }
    | IDENTIFICADOR { $$ = instruccionesAPI.instructionDeclaration($1,undefined,undefined) }
;
Asignacion 
	: IDENTIFICADOR IGUAL Expresion PUNTO_COMA {$$ = instruccionesAPI.instructionAsign($1,$2)}
    | Aumento PUNTO_COMA
;
Aumento
    : IDENTIFICADOR INCREMENTO { $$ = instruccionesAPI.instructionPlusMenus1($1,$2) } 
    | IDENTIFICADOR DECREMENTO { $$ = instruccionesAPI.instructionPlusMenus1($1,$2) }
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
/*
HAY TRES CASOS DE IF: 
    1. SOLO IF
    2. ELSE IF
    3. SOLO ELSE
*/
If 
    :IF PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE BLOQUE_INS //SOLO IF
        { $$ = instruccionesAPI.newIf( $3, undefined, undefined) } 
    |IF PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE BLOQUE_INS Else//IF-ELSE
        { $$ = instruccionesAPI.newIf($3,undefined,$6) } 
    |IF PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE BLOQUE_INS ListELSEIF //con else if pero sin else
        { $$ = instruccionesAPI.newIf($3,$6, undefined) }
    |IF PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE BLOQUE_INS ListELSEIF Else // if mas completo
        { $$ = instruccionesAPI.newIf($3,$6,$8) } 
;
Else
    : ELSE BLOQUE_INS { $$ = instruccionesAPI.newElse($2) }
;
ListELSEIF //viene por lo menos un else if
    : ListELSEIF  Elseif {  $1.push($2); $$ = $1 }
    | Elseif  { $$ = [$1] }
;
Elseif
    : ELSE IF PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE BLOQUE_INS 
        { $$ = instruccionesAPI.newElseIf($4,$6) }
;
Switch
    : SWITCH PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE LLAVE_APERTURA Lista_Case LLAVE_CIERRE
        { $$ =  instruccionesAPI.newSwitch($3, $6) }
;
Lista_Case
    : Lista_Case Case {  $1.push($2); $$ = $1 }
    | Case { $$ = [$1] }
;
Case
    : CASE Expresion DOS_PUNTOS BloqueCASES { $$ = instruccionesAPI.newCase($2,$4) }
    | DEFAULT DOS_PUNTOS BloqueCASES { $$ = instruccionesAPI.newCase("default",$4) }
;
Do
    : DO BLOQUE_INS WHILE PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE PUNTO_COMA  
        { $$ = instruccionesAPI.newDo_While($5,$2) }
;
While
    :WHILE PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE BLOQUE_INS 
        { $$ = instruccionesAPI.newWhile($3,$5) }
;
FuncionMetodo
    : Tipo_Dato IDENTIFICADOR PARENTESIS_APERTURA Parametros PARENTESIS_CIERRE BLOQUE_INS { $$ = instruccionesAPI.newFunction($1,$2,$4,$6) }
    | Tipo_Dato IDENTIFICADOR PARENTESIS_APERTURA PARENTESIS_CIERRE BLOQUE_INS { $$ = instruccionesAPI.newFunction($1,$2,undefined,$5) }
    | VOID IDENTIFICADOR PARENTESIS_APERTURA Parametros PARENTESIS_CIERRE BLOQUE_INS { $$ = instruccionesAPI.newFunction($1,$2,$4,$6) }
    | VOID IDENTIFICADOR PARENTESIS_APERTURA PARENTESIS_CIERRE BLOQUE_INS { $$ = instruccionesAPI.newFunction($1,$2,undefined,$5) }
    | VOID MAIN PARENTESIS_APERTURA PARENTESIS_CIERRE BLOQUE_INS { $$ = instruccionesAPI.newFunction($1,$2,undefined,$5) }
;
Parametros
    : Parametros COMA Tipo_Dato IDENTIFICADOR { $1.push(instruccionesAPI.newParam($3,$4)); $$ = $1 }
    | Tipo_Dato IDENTIFICADOR { $$ = [instruccionesAPI.newParam($1,$2)] }
;
Imprimir
    : IMPRIMIR PARENTESIS_APERTURA Expresion PARENTESIS_CIERRE PUNTO_COMA 
        { $$ = instruccionesAPI.instructionPrint($1,$3) }
;
For
    :FOR PARENTESIS_APERTURA Declaracion Expresion PUNTO_COMA ListaAumentoFor PARENTESIS_CIERRE BLOQUE_INS
        { instruccionesAPI.newFor($3,$4,$6,$8) }
    |FOR PARENTESIS_APERTURA Declaracion1 PUNTO_COMA Expresion PUNTO_COMA ListaAumentoFor PARENTESIS_CIERRE BLOQUE_INS
        { instruccionesAPI.newFor($3,$5,$7,$9) }
;
ListaAumentoFor
    : ListaAumentoFor COMA Aumento  {  $1.push($3); $$ = $1 }
    | Aumento { $$ = [$1] }
;
Imports
    : Imports IMPORT IDENTIFICADOR PUNTO_COMA  { $1.push(instruccionesAPI.instructionImport($3)); $$ = $1 }
    | IMPORT IDENTIFICADOR PUNTO_COMA {$$ = [instruccionesAPI.instructionImport($2)]}
;
LlamarFuncion
    : IDENTIFICADOR PARENTESIS_APERTURA Expresiones PARENTESIS_CIERRE { $$ = instruccionesAPI.instructionCallFunction($1,$3) }
    | IDENTIFICADOR PARENTESIS_APERTURA PARENTESIS_CIERRE { $$ = instruccionesAPI.instructionCallFunction($1, undefined) }   
;
Expresiones
    : Expresiones COMA Expresion  {  $1.push($2); $$ = $1 }
    | Expresion  { $$ = [$1] }
;
Return
    : RETURN Expresion PUNTO_COMA { $$ = instruccionesAPI.instructionReturn($2) }
    | RETURN PUNTO_COMA { $$ = instruccionesAPI.instructionReturn(undefined) }
;