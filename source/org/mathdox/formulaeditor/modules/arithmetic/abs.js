$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/presentation/Superscript.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");

$main(function(){

  /**
   * Defines a semantic tree node that represents an absolute value.
   */
  org.mathdox.formulaeditor.semantics.Abs =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        mathml   : ["<mo>|</mo>","","<mo>|</mo>"],
        onscreen : ["|","","|"],
        openmath : "<OMS cd='arith1' name='abs'/>"

      },

      precedence : 0

    })

  /**
   * Extend the OpenMathParser object with parsing code for arith1.abs.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
      * Returns an absolute value object based on the OpenMath node.
      */
      handleArith1Abs : function(node) {

        var operand = this.handle(node.getChildNodes().item(1));
        return new org.mathdox.formulaeditor.semantics.Abs(operand);

      }

    })

  /**
   * Extend the ExpressionParser object with parsing code for absolute values.
   */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression160 = abs | super.expression160
        expression160 : function() {
          var parent = arguments.callee.parent;
          alternation(
            rule("abs"),
            parent.expression160
          ).apply(this, arguments);
        },

        // abs = "|" expression "|"
        abs :
          transform(
            concatenation(
              literal("|"),
              rule("expression"),
              literal("|")
            ),
            function(result) {
              return new Abs(result[1]);
            }
          )

      })

  }}}

})
