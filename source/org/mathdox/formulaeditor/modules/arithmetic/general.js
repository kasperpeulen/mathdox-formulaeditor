$require("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");

$main(function(){

  /**
   * Extend the ExpressionParser object with the basics of operator precedence
   * parsing.
   */
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression = expression1
        expression  : rule("expression1"),

        // expression1 = expression2
        expression1 : rule("expression2"), // plus, minus

        // expression2 = expression3
        expression2 : rule("expression3"), // times

        // expression3 = expression4
        expression3 : rule("expression4"), // power

        // expression4 = super.expression
        expression4 : function() {
          var parent = arguments.callee.parent;
          parent.expression.apply(this, arguments);
        }

    });

  }}

})