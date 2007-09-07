$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/presentation/Fraction.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/general.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");

$main(function(){

  /**
   * Defines a semantic tree node that represents a division.
   */
  org.mathdox.formulaeditor.semantics.Divide =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        openmath : "<OMS cd='arith1' name='divide'/>"

      },

      getPresentation : function() {

        with (org.mathdox.formulaeditor.presentation) {
          return new Row(new Fraction(
            this.operands[0].getPresentation(),
            this.operands[1].getPresentation()
          ));
        }

      },

      getMathML : function() {

        return
          "<mfrac>" +
          this.operands[0].getMathML() +
          this.operands[1].getMathML() +
          "</mfrac>";

      }

  });

  /**
  * Extend the OpenMathParser object with parsing code for arith1.divide.
  */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
      * Returns a Divide object based on the OpenMath node.
      */
      handleArith1Divide : function(node) {

        // parse the left and right operands
        var children = node.getChildNodes();
        var left  = this.handle(children.item(1));
        var right = this.handle(children.item(2));

        // construct a divide object
        return new org.mathdox.formulaeditor.semantics.Divide(left, right);

      }

  });

  /**
   * Extend the ExpressionParser object with parsing code for division.
   */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression2 = divide | super.expression2
        expression2 : function() {
          var parent = arguments.callee.parent;
          alternation(
            rule("divide"),
            parent.expression2
          ).apply(this, arguments);
        },

        // divide = never
        divide : never

    });

  }}}

})