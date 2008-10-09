$package("org.mathdox.formulaeditor.parsing.expression");

$identify("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");

$require("org/mathdox/parsing/Parser.js");
$require("org/mathdox/parsing/ParserGenerator.js");
$require("org/mathdox/formulaeditor/parsing/expression/KeywordList.js");
$require("org/mathdox/formulaeditor/semantics/FunctionApplication.js");
$require("org/mathdox/formulaeditor/semantics/Integer.js");
$require("org/mathdox/formulaeditor/semantics/SemanticFloat.js");
$require("org/mathdox/formulaeditor/semantics/Variable.js");

$main(function(){

  with(org.mathdox.formulaeditor.semantics) {
  with(new org.mathdox.parsing.ParserGenerator()) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.parsing.Parser, {
        // TODO make this list alphabetical

        // start = expression
        start : rule("expression"),

        // expression = expression70
        expression  : rule("expression70"), 

        // expression70 = expression80
        expression70 : rule("expression80"), // equivalence, ...

        // expression80 = expression90
        expression80 : rule("expression90"), // implies, ...

        // expression90 = expression100
        expression90 : rule("expression100"), // or, ...

        // expression100 = expression110
        expression100 : rule("expression110"), // and, ...

        // expression110 = expression120
        expression110 : rule("expression120"), // equals, lessthan, morethan, ...

        // expression120 = expression130
        expression120 : rule("expression130"), // plus, minus

        // expression130 = expression140
        expression130 : rule("expression140"), // times

        // expression140 = expression150
        expression140 : rule("expression150"), // unary minus

        // expression150 = expression160
        expression150 : rule("expression160"), // power

        // expression160 = braces | integer | variable
        expression160 :
          alternation(
            rule("braces"),
            rule("parseNumber"),
            rule("func"),
            rule("variable"),
            rule("omSymbol")
          ),

        // restrictedexpression160 = braces | variable | func
	// no number allowed, for silent multiplication
        restrictedexpression160 :
          alternation(
            rule("braces"),
            rule("func"),
            rule("variable"),
            rule("omSymbol")
          ),

        // integer = [0..9]+
        integer :
          transform(
            repetitionplus(
              range('0','9')
            ),
            function(result) {
              return new Integer(Number(result.join("")));
            }
          ),

        // float = [0..9]+ ++ '.' ++ [0-9]*
        parseFloat :
          transform(
            concatenation( 
              repetitionplus(
                range('0','9')
              ),
              literal('.'),
              repetition(
                range('0','9')
              )
            ),
            function(result) {
              return new SemanticFloat(Number(result.join("")));
            }
          ),

        // number: float | integer
        parseNumber :
          alternation(
            rule("parseFloat"),
            rule("integer")
          ),

        // variable = ([a..z]|[A..Z])+
        variable :
          transform(
            repetitionplus(
              alternation(
                range('a','z'),
                range('A','Z')
              )
            ),
            function(result) {
              // store result.join(""); in a variable since it is used twice
              var result_joined=result.join("");

              if (org.mathdox.formulaeditor.parsing.expression.KeywordList[
                      result_joined]==null) {
                // not in the list of variables that are symbols
                return new Variable(result_joined);
              } else {
                // in the list of symbols, return the corresponding object
                // instead
                // TODO: check if we need to update the presentation tree
                return org.mathdox.formulaeditor.parsing.expression.KeywordList[result_joined];
              }
            }
          ),

        // omSymbol = ([a..z]|[A..Z]) ([a..z]|[A..Z]|[0..9]|'_')* '.' ([a..z]|[A..Z])([a..z]|[A..Z]|[0..9]|_)*
	omSymbol:
	  transform(
	    concatenation(
              alternation(
                range('a','z'),
                range('A','Z')
              ),
	      repetition(
		alternation(
		  range('a','z'),
		  range('A','Z'),
		  range('0','9'),
		  literal('_')
		)
	      ),
	      literal('.'),
              alternation(
                range('a','z'),
                range('A','Z')
              ),
	      repetition(
		alternation(
		  range('a','z'),
		  range('A','Z'),
		  range('0','9'),
		  literal('_')
		)
	      )
	    ),

	    /* 
	     * XXX: hard to check whether something is a constant or a function
	     */
	    function(result) {
	      var symbolinfo = result.join("").split('.');
	      var cd=symbolinfo[0];
	      var name=symbolinfo[1];

	      var symbol = {
		onscreen: null,
		openmath: null,
		mathml: "&lt;mi&gt;"+cd+"."+name+"&lt;/mi&gt;"
	      }
	      return new Keyword(cd,name,symbol,"constant");
	    }
	  ),

        // braces = '(' expression ')'
        braces :
          transform(
            concatenation(
              literal('('),
              rule("expression"),
              literal(')')
            ),
            function(result) {
              return result[1];
            }
          ),

        // function = variable '(' expr ( ',' expr ) * ')'
        func :
          transform(
            concatenation(
	      alternation(
		rule("variable"),
		rule("omSymbol")
	      ),
              literal('('),
              rule("expression"),
              repetition(
                concatenation(
                  literal(","),
                  rule("expression")
                )
              ),
              literal(')')
            ),
            function(result) {
              var array = new Array();

              for (var i=2; i+1<result.length; i=i+2) {
                array.push(result[i]);
              }

              var oper = new 
                org.mathdox.formulaeditor.semantics.FunctionApplication(result[0], array);

              return oper;
            }
          )
        
      })

  }}

});
