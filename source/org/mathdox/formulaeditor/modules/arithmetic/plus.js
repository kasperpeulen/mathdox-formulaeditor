$identify("org/mathdox/formulaeditor/modules/arithmetic/plus.js");

$require("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");
$require("org/mathdox/formulaeditor/parsing/openmath/KeywordList.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/semantics/Keyword.js");
$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");

$main(function(){
  var symbol = {
    onscreen : "+",
    openmath : null,
    mathml   : "<mo>+</mo>"
  };

  /**
   * Define a semantic tree node that represents a plus operation.
   */
  org.mathdox.formulaeditor.semantics.Plus =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        onscreen : symbol.onscreen,
        openmath : "<OMS cd='arith1' name='plus'/>",
        mathml   : symbol.mathml

      },

      precedence : 120

    });

  /**
   * Extend the OpenMathParser object with parsing code for arith1.plus.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a Plus object based on the OpenMath node.
       */
      handleArith1Plus : function(node, style) {

        // parse the children of the OMA
        var children = node.getChildNodes();
        var operands = [];
        for (var i=1; i<children.length; i++) {
          operands.push(this.handle(children.item(i)));
        }

        // construct a Plus object
        var result = new org.mathdox.formulaeditor.semantics.Plus();
        result.initialize.apply(result, operands);
        if (style == "invisible") {
          result.style = style;
        }
        return result;

      }

    });

  /**
   * Extend the ExpressionParser object with parsing code for plus operations.
   */
  var semantics = org.mathdox.formulaeditor.semantics ;
  var pG = new org.mathdox.parsing.ParserGenerator();

  org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
    $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

      // expression120 = plus | super.expression120
      expression120 : function() {
        var parent = arguments.callee.parent;
        pG.alternation(
          pG.rule("plus"),
          parent.expression120).apply(this, arguments);
      },

      // plus = expression120 "+" expression130
      plus :
        pG.transform(
          pG.concatenation(
            pG.rule("expression120"),
            pG.literal("+"),
            pG.rule("expression130")
          ),
          function(result) {
            return new semantics.Plus(result[0], result[2]);
          }
        )

    });

  org.mathdox.formulaeditor.parsing.openmath.KeywordList["arith1__plus"] = new org.mathdox.formulaeditor.semantics.Keyword("arith1", "plus", symbol, "infix");

});
