$identify("org/mathdox/formulaeditor/modules/arithmetic/product.js");

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
   * Defines a semantic tree node that represents a product.
   */
  org.mathdox.formulaeditor.semantics.Product =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      // operand 0 : interval
      // operand 1 : lambda expression
    
      getPresentation : function(context) {
      
        with(org.mathdox.formulaeditor.presentation) {
        
          return new Row(
            new Product(
              new Row(this.operands[0].operands[1].getPresentation(context)),
              new Row(
                this.operands[1].operands[0].getPresentation(context),
                new Symbol("="),
                this.operands[0].operands[0].getPresentation(context)
              )
            ),
	    new Symbol("("),
            this.operands[1].operands[1].getPresentation(context),
	    new Symbol(")")
          );
        
        }        
      
      },
      
      getOpenMath : function() {
      
        return "<OMA>" +
          "<OMS cd='arith1' name='product'/>" +
          this.operands[0].getOpenMath() +
          this.operands[1].getOpenMath() +
        "</OMA>";
      
      }
    
    });

  /**
   * Defines an on-screen product.
   */
  org.mathdox.formulaeditor.presentation.Product =
    $extend(org.mathdox.formulaeditor.presentation.Column, {

      initialize : function(above, below) {

        var parent = arguments.callee.parent;
        // U+03A0 greek capital letter pi
	var pi  = new org.mathdox.formulaeditor.presentation.Symbol("Π");
        return parent.initialize.call(this, above, pi, below);

      },

      getSemantics : function() {

        with(org.mathdox.formulaeditor.semantics) {

          var above = this.children[0].getSemantics().value;
          var below = this.children[2].getSemantics().value;

          if (below instanceof Relation1Eq) {

            return {
              value : [below.operands[1], above, below.operands[0]],
              rule  : "product"
            }

          }
          else {

            return null;

          }

        }

      }

  });

  /**
   * Extend the OpenMathParser object with parsing code for arith1.product.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a Product object based on the OpenMath node.
       */
      handleArith1Product : function(node) {

        var children = node.getChildNodes();
        var interval = this.handle(children.item(1));
        var lambda   = this.handle(children.item(2));

        return new org.mathdox.formulaeditor.semantics.Product(interval, lambda);

      }

    });


  /**
   * Extend the ExpressionParser object with parsing code for products.
   */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression150 = product expression130 | super.expression150
        expression150 : function() {
          var parent = arguments.callee.parent;
          alternation(
            transform(
              concatenation(
                rule("product"),
                rule("expression130")
              ),
              function(result) {

                return new Product(
                  new Interval(result[0][0], result[0][1]),
                  new Lambda(result[0][2], result[1])
                );

              }
            ),
            parent.expression150
          ).apply(this, arguments);
        },

        // product = never
        product : never

    });

  }}}


});
