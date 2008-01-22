$main(function(){

  /**
   * Define a semantic tree node that represents the linalg2.matrixrow
   */
  org.mathdox.formulaeditor.semantics.Linalg2Matrixrow =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        onscreen : ["[", "]"],
	openmath : "<OMS cd='linalg2' name='matrixrow'/>"

      },

      precedence : 0

    })

  org.mathdox.formulaeditor.semantics.Linalg2Matrix =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        onscreen : ["[", "]"],
	openmath : "<OMS cd='linalg2' name='matrix'/>"

      },

      precedence : 0

    })

  /**
   * Extend the OpenMathParser object with parsing code for linalg2.matrixrow
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a Linalg2Matrixrow object based on the OpenMath node.
       */
      handleLinalg2Matrix : function(node) {

        // parse the children of the OMA
        var children = node.getChildNodes();
        var operands = new Array(children.getLength()-1);
	for (var i=1; i<children.length; i++) {
          operands[i-1] = this.handle(children.item(i))
        }

        // construct a Linalg2Matrix object
        var result = new org.mathdox.formulaeditor.semantics.Linalg2Matrix()
        result.initialize.apply(result, operands)
        return result

      },

      /**
       * Returns a Linalg2Matrixrow object based on the OpenMath node.
       */
      handleLinalg2Matrixrow : function(node) {

        // parse the children of the OMA
        var children = node.getChildNodes();
        var operands = new Array(children.getLength()-1);
	for (var i=1; i<children.length; i++) {
          operands[i-1] = this.handle(children.item(i))
        }

        // construct a Linalg2Matrixrow object
        var result = new org.mathdox.formulaeditor.semantics.Linalg2Matrixrow()
        result.initialize.apply(result, operands)
        return result

      }

    })

  /**
   * Extend the ExpressionParser object with parsing code for Matrixrow.
   */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression160 = Linalg2Matrixlike | super.expression160
        expression160 : function() {
          var parent = arguments.callee.parent;
          alternation(
            rule("Linalg2Matrixlike"),
            parent.expression160
          ).apply(this, arguments);
        },

        // Linalg2Matrixrow = "[" expression ("," expression)* "]"
        Linalg2Matrixlike :
          transform(
            concatenation(
              literal("["),
              rule("expression"),
              repetition(
                concatenation(
                  literal(","),
                  rule("expression")
                )
              ),
              literal("]")
            ),
            function(result) {
              var array = new Array();
              for (var i=1; i+1<result.length; i=i+2) {
                array.push(result[i]);
              }
              var matrixLike;
	      if (array[0] instanceof Linalg2Matrixrow) {
	        matrixLike = new Linalg2Matrix();
		matrixLike.initialize.apply(matrixLike, array);
	      } else {
	        matrixLike = new Linalg2Matrixrow();
		matrixLike.initialize.apply(matrixLike, array);
	      }
              return matrixLike;
            }
          )

      })

  }}}


})
