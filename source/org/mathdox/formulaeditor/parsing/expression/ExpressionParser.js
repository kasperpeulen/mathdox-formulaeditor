$package("org.mathdox.formulaeditor.parsing.expression");

$require("org/mathdox/parsing/Parser.js");
$require("org/mathdox/parsing/ParserGenerator.js");
$require("org/mathdox/formulaeditor/parsing/expression/KeywordList.js");
$require("org/mathdox/formulaeditor/semantics/Integer.js");
$require("org/mathdox/formulaeditor/semantics/Variable.js");

$main(function(){

  with(org.mathdox.formulaeditor.semantics) {
  with(new org.mathdox.parsing.ParserGenerator()) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.parsing.Parser, {

        // start = expression
        start : rule("expression"),

        // expression = expression1
        expression  : rule("expression1"), 

        // expression1 = expression2
        expression1 : rule("expression2"), // equals, lessthan, morethan, ...

        // expression2 = expression3
        expression2 : rule("expression3"), // plus, minus

        // expression3 = expression4
        expression3 : rule("expression4"), // times

        // expression4 = expression5
        expression4 : rule("expression5"), // unary minus

        // expression5 = expression6
        expression5 : rule("expression6"), // power

        // expression6 = braces | integer | variable
        expression6 :
          alternation(
            rule("braces"),
            rule("integer"),
            rule("variable")
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
	      // TODO: use a variable for result.join 
	      if (org.mathdox.formulaeditor.parsing.expression.KeywordList[
		      result.join("")]==null) {
	        // not in the list of variables that are symbols
		return new Variable(result.join(""));
	      } else {
		// in the list of symbols, return the corresponding object
		// instead
		return org.mathdox.formulaeditor.parsing.expression.KeywordList[result.join("")];
	      }
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
          )

      })

  }}

})
