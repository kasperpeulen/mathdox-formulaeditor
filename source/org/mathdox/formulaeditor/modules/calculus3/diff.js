$identify("org/mathdox/formulaeditor/modules/calculus3/diff.js");

$require("org/mathdox/formulaeditor/Options.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionContextParser.js");
$require("org/mathdox/formulaeditor/parsing/mathml/MathMLParser.js");
$require("org/mathdox/formulaeditor/presentation/Boxed.js");
$require("org/mathdox/formulaeditor/presentation/Fraction.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");
$require("org/mathdox/formulaeditor/presentation/Symbol.js");
$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");

$main(function(){

  /**
   * Defines a presentation node that represents an interval.
   */
  org.mathdox.formulaeditor.presentation.Calculus3Diff =
    $extend(org.mathdox.formulaeditor.presentation.Boxed, {

      rule : "box_calculus3_diff",

      /**
       * Initialize with presentation children.
       * Should each be a row with equations
       */
      initialize: function(operand) {
        var parent = arguments.callee.parent;

        var children = [];

        var presentation = org.mathdox.formulaeditor.presentation;
        var semantics = org.mathdox.formulaeditor.semantics;
        
        if (operand === null || operand === undefined) {
          return;
        }

	// enumerator
	// U+2146 differential D
	var enumerator = new presentation.Row("ⅆ");

	var denominator = new presentation.Row(new presentation.Symbol("ⅆ"), operand);
	var fraction = new presentation.Fraction(enumerator, denominator);

        children.push(operand);

        return parent.initialize.call(this, semantics.Calculus3Diff, children, new presentation.Row(fraction));
      },

      getSemantics: function(context) {
	var value = this.children[0].getSemantics(context).value;

	return {
	  value : value,
	  rule : this.rule
	};
      }
  });

  /**
   * Defines a semantic tree node that represents an interval.
   */
  org.mathdox.formulaeditor.semantics.Calculus3Diff =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {
      getMathML: function(context) {
	// d/dx expr (with fraction and differential d)
	var result="<mrow>";

	// fraction
	result = result + "<mfrac>";
	// U+2146 differential D
	result = result + "<mo>ⅆ</mo>";

	// denominator
	result = result + "<mrow>";
	result = result + "<mo>ⅆ</mo>";
	// variable
	result = result + this.operands[0].getMathML();
	result = result + "</mrow>";
	result = result + "</mfrac>";

	// U+2061 function application
	result = result + "<mo>⁡⁡</mo>";

	// expr
        result = result + this.operands[1].getMathML();

	result = result + "</mrow>";

	return result;
      },

      getOpenMath: function() {
	// case 1: expand  d/dx expr becomes apply(calculus1.diff(lambda(x, expr)), x)
	// todo: add style to load again

	var operVar = this.operands[0].getOpenMath();
	var operExpr = this.operands[1].getOpenMath();

	var result = "<OMA"

        result = result + this.getOpenMathCommonAttributes();

	result = result +">";
	// lambda: expression converted to lambda function
	var lambda = "<OMBIND><OMS cd='fns1' name='lambda'/><OMBVAR>";
	lambda = lambda + operVar;
	lambda = lambda +"</OMBVAR>";
	lambda = lambda + operExpr;
	lambda = lambda + "</OMBIND>";

	// diff: derivative of lambda function
	var diff = "<OMA><OMS cd='calculus1' name='diff'/>";
	diff = diff + lambda;
	diff = diff + "</OMA>";

	result = result + diff; // function
	result = result + operVar; //var
	result = result + "</OMA>";

	return result;
      },

      getPresentation: function(context) {
	// row: box(d/dx), expr
        var presentation = org.mathdox.formulaeditor.presentation;

	var left = new presentation.Calculus3Diff(this.operands[0].getPresentation(context));
	var right = this.operands[1].getPresentation(context);

	return new presentation.Row(left, right);
      }

    });

  // TODO MathML parsing
  /**
   * Extend the MathML object with parsing code for mfenced intervals
  org.mathdox.formulaeditor.parsing.mathml.MathMLParser =
    $extend(org.mathdox.formulaeditor.parsing.mathml.MathMLParser, {
    });
   */

  // TODO also parse split
  /**
   * Extend the OpenMathParser object with parsing code for arith1.unary_minus.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {
      /**
       * Returns a unary object based on the OpenMath node.
       */
      handleCalculus3Diff : function(node) {
        var operVar = this.handle(node.childNodes.item(1));
        var operExpr = this.handle(node.childNodes.item(2));

        return new org.mathdox.formulaeditor.semantics.Calculus3Diff(operVar, operExpr);
      }
    });

  /**
   * Extend the expression parser 
   */
  var pG = new org.mathdox.parsing.ParserGenerator();
  var semantics = org.mathdox.formulaeditor.semantics;

  org.mathdox.formulaeditor.parsing.expression.ExpressionContextParser.addFunction(
    function(context) { return {
	// add calculus3diff as expression130
        expression130 : function() {
	  var parent = arguments.callee.parent;
	  pG.alternation(
	    pG.rule("calculus3diff"),
	    parent.expression130).apply(this, arguments);
	},

	// add rule for calculus3diff
	calculus3diff : 
          pG.transform(
	    pG.concatenation(
	      pG.rule("box_calculus3_diff"),
	      pG.rule("expression130")
	    ),
	    function(result) {
	      return new semantics.Calculus3Diff(result[0], result[1]);
	    }
	  ),
	// box_calculus3_diff = never
	box_calculus3_diff: pG.never
      };
    });
});
