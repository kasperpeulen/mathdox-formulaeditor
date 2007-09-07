$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/general.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");

$main(function(){

  /**
   * Defines a semantic tree node that represents a multiplication.
   */
  org.mathdox.formulaeditor.semantics.Times =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        onscreen : "*", // TODO : replace by ·
        openmath : "<OMS cd='arith1' name='times'/>",
        mathml   : "<mo>·</mo>"

      }

    })

  /**
   * Extend the OpenMathParser object with parsing code for arith1.times.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a Times object based on the OpenMath node.
       */
      handleArith1Times : function(node) {

        // parse the children of the OMA
        var children = node.getChildNodes();
        var operands = new Array(children.getLength()-1);
        for (var i=1; i<children.length; i++) {
          operands[i-1] = this.handle(children.item(i))
        }

        // construct a Times object
        var result = new org.mathdox.formulaeditor.semantics.Times();
        result.initialize.apply(result, operands);
        return result;

      }

    })

  /**
   * Extend the ExpressionParser object with parsing code for multiplication.
   */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression2 = times | super.expression2
        expression2 : function() {
          var parent = arguments.callee.parent;
          alternation(
            rule("times"),
            parent.expression2
          ).apply(this, arguments);
        },

        // times = expression2 "*" expression3
        times :
          transform(
            concatenation(
              rule("expression2"),
              literal("*"),
              rule("expression3")
            ),
            function(result) {
              return new Times(result[0], result[2]);
            }
          )

      })

  }}}

})