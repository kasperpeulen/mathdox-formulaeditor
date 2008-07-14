$identify("org/mathdox/formulaeditor/modules/arithmetic/minus.js");

$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");


$main(function(){

  /**
   * Define a semantic tree node that represents a minus operation.
   */
  org.mathdox.formulaeditor.semantics.Minus =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        onscreen : "-",
        openmath : "<OMS cd='arith1' name='minus'/>",
        mathml   : "<mo>-</mo>"

      },

      precedence : 120

    });

  /**
  * Extend the OpenMathParser object with parsing code for arith1.minus.
  */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
      * Returns a Minus object based on the OpenMath node.
      */
      handleArith1Minus : function(node) {

        // parse the children of the OMA
        var children = node.getChildNodes();
        var left  = this.handle(children.item(1));
        var right = this.handle(children.item(2));

        // construct a Minus object
        return new org.mathdox.formulaeditor.semantics.Minus(left, right);

      }

    });

  /**
  * Extend the ExpressionParser object with parsing code for minus operations.
  */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression120 = minus | super.expression120
        expression120 : function() {
          var parent = arguments.callee.parent;
          alternation(
            rule("minus"),
            parent.expression120
          ).apply(this, arguments);
        },

        // minus = expression120 "+" expression130
        minus :
          transform(
            concatenation(
              rule("expression120"),
              literal("-"),
              rule("expression130")
            ),
            function(result) {
              return new Minus(result[0], result[2]);
            }
          )

      });

  }}}

});
