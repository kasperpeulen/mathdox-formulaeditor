$identify("org/mathdox/formulaeditor/modules/arithmetic/power.js");

$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/presentation/Superscript.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
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

      precedence : 150,

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

    });

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

    });

  /**
   * Extend the ExpressionParser object with parsing code for power operations.
   */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression150 = power | super.expression150
        expression150 : function() {
          var parent = arguments.callee.parent;
          alternation(
            rule("power"),
            parent.expression150
          ).apply(this, arguments);
        },

        // power = expression160 superscript
        power :
          transform(
            concatenation(
              rule("expression160"),
              rule("superscript")
            ),
            function(result) {
              return new Power(result[0], result[1]);
            }
          ),

        // superscript = 0
        superscript : never

      });

  }}}

  /**
   * Add a key handler for the '^' key.
   */
  org.mathdox.formulaeditor.presentation.Row =
    $extend(org.mathdox.formulaeditor.presentation.Row, {

      /**
       * Override the onkeypress method to handle the '^' key.
       */
      onkeypress : function(event, editor) {

        // only handle keypresses where alt and ctrl are not held
        if (!event.altKey && !event.ctrlKey) {

          // check whether the '^' key has been pressed
          if (String.fromCharCode(event.charCode) == "^") {

            var Superscript =
              org.mathdox.formulaeditor.presentation.Superscript;

            var index  = editor.cursor.position.index;
            var length = this.children.length;

            // search for an expression of precedence level 130 to the right of
            // the cursor
            var parsed = this.getSemantics(index, length, "expression130");

            // create the operand of the superscript operation
            var operand = this.remove(index, parsed.index);

            // insert the fraction into the row
            this.insert(index, new Superscript(operand));
            editor.cursor.position = operand.getFollowingCursorPosition();

            // update the editor state
            editor.redraw();
            editor.save();
            return false;

          }

        }

        // call the overridden method
        return arguments.callee.parent.onkeypress.call(this, event, editor);

      }

    });

});
