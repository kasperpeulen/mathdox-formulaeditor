$main(function(){

  /**
   * Define a semantic tree node that represents the greatest common divisor
   * function.
   */
  org.mathdox.formulaeditor.semantics.Gcd =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        onscreen : ["gcd(", ",", ")"],
        openmath : "<OMS cd='arith1' name='gcd'/>"

      },

      precedence : 0

    })

  /**
   * Extend the OpenMathParser object with parsing code for arith1.gcd.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a Gcd object based on the OpenMath node.
       */
      handleArith1Gcd : function(node) {

        // parse the children of the OMA
        var children = node.getChildNodes();
        var operands = new Array(children.getLength()-1);
        for (var i=1; i<children.length; i++) {
          operands[i-1] = this.handle(children.item(i))
        }

        // construct a Gcd object
        var result = new org.mathdox.formulaeditor.semantics.Gcd();
        result.initialize.apply(result, operands);
        return result;

      }

    })

  /**
   * Extend the ExpressionParser object with parsing code for gcd operations.
   */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression6 = gcd | super.expression6
        expression6 : function() {
          var parent = arguments.callee.parent;
          alternation(
            rule("gcd"),
            parent.expression6
          ).apply(this, arguments);
        },

        // gcd = "gcd(" expression ("," expression)* ")"
        gcd :
          transform(
            concatenation(
              literal("gcd("),
              rule("expression"),
              repetition(
                concatenation(
                  literal(","),
                  rule("expression")
                )
              ),
              literal(")")
            ),
            function(result) {
              var array = new Array();
              for (var i=1; i+1<result.length; i=i+2) {
                array.push(result[i]);
              }
              var gcd = new Gcd();
              gcd.initialize.apply(gcd, array);
              return gcd;
            }
          )

      })

  }}}


})