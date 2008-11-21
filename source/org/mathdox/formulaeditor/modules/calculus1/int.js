$package("org.mathdox.formulaeditor.modules.calculus1");

$identify("org/mathdox/formulaeditor/modules/calculus1/int.js");

$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");
$require("org/mathdox/formulaeditor/presentation/Column.js");
$require("org/mathdox/formulaeditor/presentation/Symbol.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");
$require("org/mathdox/formulaeditor/modules/fns1/lambda.js");

$main(function(){

  /**
   * Defines a semantic tree node that represents an integration.
   */
  org.mathdox.formulaeditor.semantics.Integration =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      // operand 0 : lambda expression
    
      getPresentation : function(context) {
      
        var presentation = org.mathdox.formulaeditor.presentation;
        
        return new presentation.Row(
          // U+222B integral
          new presentation.Symbol('∫'),
          this.operands[0].expression.getPresentation(context),
          new presentation.Symbol("d"),
          this.operands[0].variables[0].getPresentation(context)
        );
        
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

	if (lambda === null || lambda.variables.length === 0) {
	  alert("calculus1.int needs a nonempty OMBVAR");
	  return null;
	}

        return new org.mathdox.formulaeditor.semantics.Integration(lambda);

      }

    });


  /**
   * Extend the ExpressionParser object with parsing code for integrals.
   */
  var semantics = org.mathdox.formulaeditor.semantics;
  var pG = new org.mathdox.parsing.ParserGenerator();

  org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
    $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

      // expression150 = calculus1int | super.expression150
      expression150 : function() {
        var parent = arguments.callee.parent;
        pG.alternation(
          pG.rule("calculus1int"),
          parent.expression150).apply(this, arguments);
      },
      // U+222B integral
      // calculus1int '∫' expression 'd' variable 
      calculus1int: 
        pG.transform(
          pG.concatenation(
            // U+222B integral
            pG.literal("∫"),
            pG.rule("expression"),
            pG.literal("d"),
            pG.rule("variable")
          ),
          function(result) {
            return new semantics.Integration(
              new semantics.Lambda(result[3], result[1])
            );
          }
        )
  });


});
