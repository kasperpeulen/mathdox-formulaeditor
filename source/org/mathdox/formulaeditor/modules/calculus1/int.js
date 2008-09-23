$package("org.mathdox.formulaeditor.modules.calculus1");

$identify("org/mathdox/formulaeditor/modules/calculus1/int.js");

$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");
$require("org/mathdox/formulaeditor/presentation/Column.js");
$require("org/mathdox/formulaeditor/presentation/Symbol.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");
$require("org/mathdox/formulaeditor/modules/miscellaneous/lambda.js");

$main(function(){

  /**
   * Defines a semantic tree node that represents an integration.
   */
  org.mathdox.formulaeditor.semantics.Integration =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      // operand 0 : lambda expression
    
      getPresentation : function(context) {
      
        with(org.mathdox.formulaeditor.presentation) {
        
          return new Row(
            // U+222B integral
            new Symbol('∫'),
            this.operands[0].operands[0].getPresentation(context),
            new Symbol("d"),
            this.operands[0].operands[1].getPresentation(context)
          );
        
        }        
      
      },
      
      getOpenMath : function() {
      
        return "<OMA>" +
          "<OMS cd='calculus1' name='int'/>" +
          this.operands[0].getOpenMath() +
        "</OMA>";
      
      }
    
    });

  /**
   * Extend the OpenMathParser object with parsing code for calculus1.int.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a Integration object based on the OpenMath node.
       */
      handleCalculus1Int : function(node) {

        var children = node.getChildNodes();
        var lambda   = this.handle(children.item(1));

        return new org.mathdox.formulaeditor.semantics.Integration(lambda);

      }

    });


  /**
   * Extend the ExpressionParser object with parsing code for integrals.
   */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression150 = calculus1int | super.expression150
        expression150 : function() {
          var parent = arguments.callee.parent;
          alternation(
	    rule("calculus1int"),
            parent.expression150
          ).apply(this, arguments);
        },
        // U+222B integral
	// calculus1int '∫' expression 'd' variable 
        calculus1int: 
	  transform(
            concatenation(
              // U+222B integral
              literal("∫"),
              rule("expression"),
              literal("d"),
              rule("variable")
            ),
            function(result) {
              return new Integration(
                new Lambda(result[3], result[1])
              );
            }
          )
    });

  }}}


});
