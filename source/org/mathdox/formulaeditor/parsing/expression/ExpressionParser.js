$package("org.mathdox.formulaeditor.parsing.expression");

$require("org/mathdox/parsing/Parser.js");
$require("org/mathdox/parsing/ParserGenerator.js");
$require("org/mathdox/formulaeditor/semantics/Integer.js");
$require("org/mathdox/formulaeditor/semantics/Variable.js");

$main(function(){

  with(org.mathdox.formulaeditor.semantics) {
  with(new org.mathdox.parsing.ParserGenerator()) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.parsing.Parser, {

        // start = expression
        start : rule("expression"),

        // expression = braces | integer | variable
        expression :
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
              return new Variable(result.join(""));
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