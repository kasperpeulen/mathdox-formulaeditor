$main(function(){

  /**
   * Define a semantic tree node that represents the least common multiple
   * function.
   */
  org.mathdox.formulaeditor.semantics.Lcm =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        onscreen : ["lcm(", ",", ")"],
        openmath : "<OMS cd='arith1' name='lcm'/>"

      },

      precedence : 6

    })

  /**
   * Extend the OpenMathParser object with parsing code for arith1.lcm.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns an Lcm object based on the OpenMath node.
       */
      handleArith1Lcm : function(node) {

        // parse the children of the OMA
        var children = node.getChildNodes();
        var operands = new Array(children.getLength()-1);
        for (var i=1; i<children.length; i++) {
          operands[i-1] = this.handle(children.item(i))
        }

        // construct an Lcm object
        var result = new org.mathdox.formulaeditor.semantics.Lcm();
        result.initialize.apply(result, operands);
        return result;

      }

    })

  /**
   * Extend the ExpressionParser object with parsing code for lcm operations.
   */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression6 = lcm | super.expression6
        expression6 : function() {
          var parent = arguments.callee.parent;
          alternation(
            rule("lcm"),
            parent.expression6
          ).apply(this, arguments);
        },

        // lcm = "lcm(" expression ("," expression)* ")"
        lcm :
          transform(
            concatenation(
              literal("lcm("),
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
              var lcm = new Lcm();
              lcm.initialize.apply(lcm, array);
              return lcm;
            }
          )

      })

  }}}


})