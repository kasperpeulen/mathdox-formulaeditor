$identify("org/mathdox/formulaeditor/modules/arithmetic/plus.js");

$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");

$main(function(){

  /**
   * Define a semantic tree node that represents a plus operation.
   */
  org.mathdox.formulaeditor.semantics.Plus =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        onscreen : "+",
        openmath : "<OMS cd='arith1' name='plus'/>",
        mathml   : "<mo>+</mo>"

      },

      precedence : 120

    });

  /**
   * Extend the OpenMathParser object with parsing code for arith1.plus.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a Plus object based on the OpenMath node.
       */
      handleArith1Plus : function(node) {

        // parse the children of the OMA
        var children = node.getChildNodes();
        var operands = new Array(children.getLength()-1);
        for (var i=1; i<children.length; i++) {
          operands[i-1] = this.handle(children.item(i))
        }

        // construct a Plus object
        var result = new org.mathdox.formulaeditor.semantics.Plus();
        result.initialize.apply(result, operands);
        return result;

      }

    });

  /**
   * Extend the ExpressionParser object with parsing code for plus operations.
   */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression120 = plus | super.expression120
        expression120 : function() {
          var parent = arguments.callee.parent;
          alternation(
            rule("plus"),
            parent.expression120
          ).apply(this, arguments);
        },

        // plus = expression120 "+" expression130
        plus :
          transform(
            concatenation(
              rule("expression120"),
              literal("+"),
              rule("expression130")
            ),
            function(result) {
              return new Plus(result[0], result[2]);
            }
          )

      });

  }}}

});
