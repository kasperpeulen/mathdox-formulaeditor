$package("org.mathdox.formulaeditor.modules.calculus1");

$identify("org/mathdox/formulaeditor/modules/calculus1/defint.js");

$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");
$require("org/mathdox/formulaeditor/presentation/Column.js");
$require("org/mathdox/formulaeditor/presentation/Symbol.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");
$require("org/mathdox/formulaeditor/modules/relation1/eq.js");
$require("org/mathdox/formulaeditor/modules/miscellaneous/interval.js");
$require("org/mathdox/formulaeditor/modules/miscellaneous/lambda.js");

$main(function(){

  /**
   * Defines a semantic tree node that represents a definite integration.
   */
  org.mathdox.formulaeditor.semantics.Defint =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      // operand 0 : interval
      // operand 1 : lambda expression
    
      getPresentation : function(context) {
      
        with(org.mathdox.formulaeditor.presentation) {
        
          return new Row(
            new Defint(
              new Row(this.operands[0].operands[0].getPresentation(context)),
              new Row(this.operands[0].operands[1].getPresentation(context))
            ),
            this.operands[1].operands[1].getPresentation(context),
            new Symbol("d"),
            this.operands[1].operands[0].getPresentation(context)
          );
        }        
      
      },
      
      getOpenMath : function() {
      
        return "<OMA>" +
          "<OMS cd='calculus1' name='defint'/>" +
          this.operands[0].getOpenMath() +
          this.operands[1].getOpenMath() +
        "</OMA>";
      
      }
    
    });

  /**
   * Defines an on-screen (definite) integral.
   */
  org.mathdox.formulaeditor.presentation.Defint =
    $extend(org.mathdox.formulaeditor.presentation.Column, {

      initialize : function(above, below) {

        var parent = arguments.callee.parent;
	// U+222B integral
	var defint  = new org.mathdox.formulaeditor.presentation.Symbol("∫");
        return parent.initialize.call(this, above, defint, below);

      },

      getSemantics : function() {

        with(org.mathdox.formulaeditor.semantics) {

          var above = this.children[0].getSemantics().value;
          var below = this.children[2].getSemantics().value;

          return {
            value : [above, below],
            rule  : "defint"
          }

        }

      }

  });

  /**
   * Extend the OpenMathParser object with parsing code for calculus1.defint.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a Sum object based on the OpenMath node.
       */
      handleCalculus1Defint : function(node) {

        var children = node.getChildNodes();
        var interval = this.handle(children.item(1));
        var lambda   = this.handle(children.item(2));

        return new org.mathdox.formulaeditor.semantics.Defint(interval, lambda);

      }

    });


  /**
   * Extend the ExpressionParser object with parsing code for definite integrals.
   */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression150 = defint expression 'd' variable | super.expression150
        expression150 : function() {
          var parent = arguments.callee.parent;
          alternation(
            transform(
              concatenation(
                rule("defint"),
                rule("expression"),
                literal("d"),
		rule("variable")
              ),
              function(result) {

                return new Defint(
                  new Interval(result[0][0], result[0][1]),
                  new Lambda(result[3], result[1])
                );

              }
            ),
            parent.expression150
          ).apply(this, arguments);
        },

        // defint = never
        defint : never

    });

  }}}


});
