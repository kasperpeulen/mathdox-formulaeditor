$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/presentation/Fraction.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");

$main(function(){

  /**
   * Defines a semantic tree node that represents a division.
   */
  org.mathdox.formulaeditor.semantics.Divide =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        openmath : "<OMS cd='arith1' name='divide'/>"

      },

      precedence : 5,

      getPresentation : function() {

        with (org.mathdox.formulaeditor.presentation) {
          return new Row(new Fraction(
            this.operands[0].getPresentation(),
            this.operands[1].getPresentation()
          ));
        }

      },

      getMathML : function() {

        return
          "<mfrac>" +
          this.operands[0].getMathML() +
          this.operands[1].getMathML() +
          "</mfrac>";

      }

  });

  /**
  * Extend the OpenMathParser object with parsing code for arith1.divide.
  */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
      * Returns a Divide object based on the OpenMath node.
      */
      handleArith1Divide : function(node) {

        // parse the left and right operands
        var children = node.getChildNodes();
        var left  = this.handle(children.item(1));
        var right = this.handle(children.item(2));

        // construct a divide object
        return new org.mathdox.formulaeditor.semantics.Divide(left, right);

      }

  });

  /**
   * Extend the ExpressionParser object with parsing code for division.
   */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression3 = divide | super.expression3
        expression3 : function() {
          var parent = arguments.callee.parent;
          alternation(
            rule("divide"),
            parent.expression3
          ).apply(this, arguments);
        },

        // divide = never
        divide : never

    });

  }}}

  /**
   * Add a key handler for the '/' key.
   */
  org.mathdox.formulaeditor.presentation.Row =
    $extend(org.mathdox.formulaeditor.presentation.Row, {

      /**
       * Override the onkeypress method to handle the '/' key.
       */
      onkeypress : function(event, editor) {

        // only handle keypresses where alt and ctrl are not held
        if (!event.altKey && !event.ctrlKey) {

          // check whether the '/' key has been pressed
          if (String.fromCharCode(event.charCode) == "/") {

            var Fraction = org.mathdox.formulaeditor.presentation.Fraction;
            var index    = editor.cursor.position.index;
            var length   = this.children.length;

            // search for an expression of precedence level 3 to the left of the
            // cursor, and of level 5 to the right of the cursor
            var parsedleft  = this.getSemantics(0, index, "expression3", true);
            var parsedright = this.getSemantics(index, length, "expression5");

            // create the left and right operands of the fraction
            var right = this.remove(index, parsedright.index);
            var left  = this.remove(parsedleft.index,  index);

            // insert the fraction into the row
            this.insert(parsedleft.index, new Fraction(left, right));
            editor.cursor.position = right.getFollowingCursorPosition();

            // update the editor state
            editor.redraw();
            editor.save();
            return false;

          }

        }

        // call the overridden method
        return arguments.callee.parent.onkeypress.call(this, event, editor);

      }

    })

})