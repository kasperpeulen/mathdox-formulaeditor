$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/presentation/Superscript.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");

$main(function(){

  /**
   * Defines a semantic tree node that represents a unary minus.
   */
  org.mathdox.formulaeditor.semantics.UnaryMinus =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        onscreen : ["-","",""],
        openmath : "<OMS cd='arith1' name='unary_minus'/>"

      },

      precedence : 140

    })

  /**
   * Extend the OpenMathParser object with parsing code for arith1.unary_minus.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
      * Returns a unary minus object based on the OpenMath node.
      */
      handleArith1Unary_minus : function(node) {

        var operand = this.handle(node.getChildNodes().item(1));
        return new org.mathdox.formulaeditor.semantics.UnaryMinus(operand);

      }

    })

  /**
   * Extend the ExpressionParser object with parsing code for unary minus.
   */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression140 = unaryminus | super.expression140
        expression140 : function() {
          var parent = arguments.callee.parent;
          alternation(
            rule("unaryminus"),
            parent.expression140
          ).apply(this, arguments);
        },

        // unaryminus = "-" expression150
        unaryminus :
          transform(
            concatenation(
              literal("-"),
              rule("expression150")
            ),
            function(result) {
              return new UnaryMinus(result[1]);
            }
          )

      })

  }}}

})
