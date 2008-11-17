$identify("org/mathdox/formulaeditor/modules/miscellaneous/lambda.js");

$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");

$main(function(){

  /**
   * Defines a semantic tree node that represents a lambda expression.
   */
  org.mathdox.formulaeditor.semantics.Lambda =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      // operand 0 is the bound variable
      // operand 1 is the expression

      symbol : {

        onscreen : ["λ",".",""]

      },

      getOpenMath : function() {

        return "<OMBIND>" +
          "<OMS cd='fns1' name='lambda'/>" +
          "<OMBVAR>" +
            this.operands[0].getOpenMath() +
          "</OMBVAR>" +
          this.operands[1].getOpenMath() +
        "</OMBIND>";

      }

    });

  /**
   * Extend the OpenMathParser object with parsing code for fns1.lambda.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a lambda object based on the OpenMath node.
       */
      handleFns1Lambda : function(node) {

        var children   = node.getChildNodes();
        var variable   = this.handle(children.item(1));
        var expression = this.handle(children.item(2));

        semantics = org.mathdox.formulaeditor.semantics;
        return new semantics.Lambda(variable, expression);

      }

    });
  

});
