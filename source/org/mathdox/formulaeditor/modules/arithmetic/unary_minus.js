$identify("org/mathdox/formulaeditor/modules/arithmetic/unary_minus.js");

$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/presentation/Superscript.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionContextParser.js");

$main(function(){

  /**
   * Defines a semantic tree node that represents a unary minus.
   */
  org.mathdox.formulaeditor.semantics.Arith1Unary_minus =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {
      

      symbol : {

        onscreen : ["-","",""],
        openmath : "<OMS cd='arith1' name='unary_minus'/>",
        mathml   : [ "<mo>-</mo>", "", ""]

      },

      precedence : 140,

      getPrecedence: function(context) {
	var precedence;

        if (context.optionArith1UnaryMinusBrackets === 'true') {
          precedence = 120;
        } else {
          precedence = 140;
        }

	return precedence;
      },
      getInnerPrecedence: function(context) {
	var precedence;

        if (context.optionArith1UnaryMinusBrackets === 'true') {
          precedence = 130;
        } else {
          precedence = 130;
        }

	return precedence;
      }

    });

  /**
   * Extend the OpenMathParser object with parsing code for arith1.unary_minus.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
      * Returns a unary minus object based on the OpenMath node.
      */
      handleArith1Unary_minus : function(node) {

        var operand = this.handle(node.childNodes.item(1));
	var result = new org.mathdox.formulaeditor.semantics.Arith1Unary_minus(operand);

        return result;

      }

    });

  /**
   * Add the parsing code for unary symbol.
   */
  var semantics = org.mathdox.formulaeditor.semantics;
  var pG = new org.mathdox.parsing.ParserGenerator();

    // only one expression, same on screen
    org.mathdox.formulaeditor.parsing.expression.ExpressionContextParser.addFunction( 
      function(context) { 
	var precedence;

        if (context.optionArith1UnaryMinusBrackets === 'true') {
          precedence = 120;
        } else {
          precedence = 140;
        }

        var rulesEnter = [];
        var positionEnter = 0;
    
        rulesEnter.push(pG.literal("-"));
        positionEnter++;
        rulesEnter.push(pG.rule("expression140"));
        var result = { arith1unary_minus :
          pG.transform(
            pG.concatenation.apply(pG, rulesEnter),
            function(result) {
              return new semantics.Arith1Unary_minus(result[positionEnter]);
            }
          )
        };

        if (precedence == 120) {
          result.expression120 = function() {
            var parent = arguments.callee.parent;
            pG.alternation(
              pG.rule("arith1unary_minus"),
              parent.expression120).apply(this, arguments);
          };
        } else {
          result.expression140 = function() {
            var parent = arguments.callee.parent;
            pG.alternation(
              pG.rule("arith1unary_minus"),
              parent.expression140).apply(this, arguments);
          };
        }
      
      return result;
  });

});
