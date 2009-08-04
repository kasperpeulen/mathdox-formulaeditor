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
    $extend(org.mathdox.formulaeditor.semantics.Node, {

      // operand : lambda expression
      lambda: null,
    
      getPresentation : function(context) {
      
        var presentation = org.mathdox.formulaeditor.presentation;
        var result = new presentation.Row();
        var row;

        row = [
          // U+222B integral
          new presentation.Symbol('∫'),
          this.lambda.expression.getPresentation(context),
          // U+2146 differential D
          new presentation.Symbol("ⅆ"),
          this.lambda.variables[0].getPresentation(context)
        ];

        result.initialize.apply(result, row);
        
        return result;
      },
      
      getOpenMath : function() {
      
        return "<OMA>" +
          "<OMS cd='calculus1' name='int'/>" +
          this.lambda.getOpenMath() +
        "</OMA>";
      },

      getMathML : function() {
        // U+222B integral
        return "<mrow><mo>∫</mo>"+
          this.lambda.expression.getMathML() +
          // U+2146 differential D
          "<mo>ⅆ</mo>"+
          this.lambda.variables[0].getMathML()+
          "</mrow>";
      },

      initialize : function() {
        this.lambda = arguments[0];
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
            pG.literal("ⅆ"),
            pG.rule("variable")
          ),
          function(result) {
            var integration;

            integration =  new semantics.Integration(
              new semantics.Lambda(result[3], result[1])
            );

            return integration;
          }
        )
  });


});
