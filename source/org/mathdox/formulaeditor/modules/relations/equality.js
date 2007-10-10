$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");

$main(function(){

  /**
   * Define a semantic tree node that represents an equality.
   */
  org.mathdox.formulaeditor.semantics.Equals =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        onscreen : "=",
        openmath : "<OMS cd='relation1' name='eq'/>",
        mathml   : "<mo>=</mo>"

      },

      precedence : 1

    })
  
  /**
   * Extend the OpenMathParser object with parsing code for relation1.eq.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns an equality object based on the OpenMath node.
       */
      handleRelation1Eq : function(node) {

        // parse the children of the OMA
        var children = node.getChildNodes();
        var operands = new Array(children.getLength()-1);
        for (var i=1; i<children.length; i++) {
          operands[i-1] = this.handle(children.item(i))
        }

        // construct an equality object
        var result = new org.mathdox.formulaeditor.semantics.Equals();
        result.initialize.apply(result, operands);
        return result;

      }

    })

  /**
   * Extend the ExpressionParser object with parsing code for the equality sign.
   */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression1 = equals | super.expression1
        expression1 : function() {
          var parent = arguments.callee.parent;
          alternation(
            rule("equals"),
            parent.expression1
          ).apply(this, arguments);
        },

        // equals = expression1 "=" expression2
        equals :
          transform(
            concatenation(
              rule("expression1"),
              literal("="),
              rule("expression2")
            ),
            function(result) {
              return new Equals(result[0], result[2]);
            }
          )

      })

  }}}


})