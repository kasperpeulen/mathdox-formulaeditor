$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");

$main(function(){

  /**
   * Defines a semantic tree node that represents a multiplication.
   */
  org.mathdox.formulaeditor.semantics.Times =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        onscreen : "·",
        openmath : "<OMS cd='arith1' name='times'/>",
        mathml   : "<mo>·</mo>"

      },

      precedence : 3

    })

  /**
   * Extend the OpenMathParser object with parsing code for arith1.times.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a Times object based on the OpenMath node.
       */
      handleArith1Times : function(node) {

        // parse the children of the OMA
        var children = node.getChildNodes();
        var operands = new Array(children.getLength()-1);
        for (var i=1; i<children.length; i++) {
          operands[i-1] = this.handle(children.item(i))
        }

        // construct a Times object
        var result = new org.mathdox.formulaeditor.semantics.Times();
        result.initialize.apply(result, operands);
        return result;

      }

    })

  /**
   * Extend the ExpressionParser object with parsing code for multiplication.
   */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression3 = times | super.expression3
        expression3 : function() {
          var parent = arguments.callee.parent;
          alternation(
            rule("times"),
            parent.expression3
          ).apply(this, arguments);
        },

        // times = expression3 "·" expression4
        times :
          transform(
            concatenation(
              rule("expression3"),
              literal("·"),
              rule("expression4")
            ),
            function(result) {
              return new Times(result[0], result[2]);
            }
          )

      })

  }}}

  /**
   * Add a key handler for the '*' key.
   */
  org.mathdox.formulaeditor.presentation.Row =
    $extend(org.mathdox.formulaeditor.presentation.Row, {

      /**
       * Override the onkeypress method to handle the '*' key.
       */
      onkeypress : function(event, editor) {

        // only handle keypresses where alt and ctrl are not held
        if (!event.altKey && !event.ctrlKey) {

          // check whether the '*' key has been pressed
          if (String.fromCharCode(event.charCode) == "*") {

            // substitute the charCode of "·" for "*".
            var newEvent = {};
            for (var x in event) {
              newEvent[x] = event[x];
            }
            newEvent.charCode = "·".charCodeAt(0);
            event = newEvent;

          }

        }

        // call the overridden method
        return arguments.callee.parent.onkeypress.call(this, event, editor);

      }

    })

})