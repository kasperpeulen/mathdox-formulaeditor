$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/presentation/Superscript.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/general.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");

$main(function(){

  /**
   * Defines a semantic tree node that represents a power function.
   */
  org.mathdox.formulaeditor.semantics.Power =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        openmath : "<OMS cd='arith1' name='power'/>"

      },

      getPresentation : function() {

        with (org.mathdox.formulaeditor.presentation) {
          // add braces to base, if necessary
          var base = this.operands[0].getPresentation();
          if (base instanceof Row && base.children.length > 1) {
            base = new Row(new Symbol("("), base, new Symbol(")"));
          }
          return new Row(
            base,
            new Superscript(this.operands[1].getPresentation())
          );
        }

      },

      getMathML : function() {

        return
          "<msup>" +
          this.operands[0].getMathML() +
          this.operands[1].getMathML() +
          "</msup>";

      }

    })

  /**
   * Extend the OpenMathParser object with parsing code for arith1.power.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
      * Returns a Power object based on the OpenMath node.
      */
      handleArith1Power : function(node) {

        // parse the base and exponent
        var children = node.getChildNodes();
        var base     = this.handle(children.item(1));
        var exponent = this.handle(children.item(2));

        // construct a Power object
        return new org.mathdox.formulaeditor.semantics.Power(base, exponent);

      }

    })

  /**
   * Extend the ExpressionParser object with parsing code for power operations.
   */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression3 = power | super.expression3
        expression3 : function() {
          var parent = arguments.callee.parent;
          alternation(
            rule("power"),
            parent.expression3
          ).apply(this, arguments);
        },

        // power = expression4 superscript
        power :
          transform(
            concatenation(
              rule("expression4"),
              rule("superscript")
            ),
            function(result) {
              return new Power(result[0], result[1]);
            }
          ),

        // superscript = 0
        superscript : never

      })

  }}}

})