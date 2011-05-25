$identify("org/mathdox/formulaeditor/modules/complex1/complex_cartesian.js");

$require("org/mathdox/formulaeditor/parsing/expression/ExpressionContextParser.js");
$require("org/mathdox/formulaeditor/parsing/openmath/KeywordList.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/semantics/Keyword.js");
$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/modules/arith1/plus.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/times.js");

$main(function(){
  /**
   * Extend the OpenMathParser object with parsing code for arith1.times.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a Times object based on the OpenMath node.
       */
      handleComplex1Complex_cartesian : function(node, style) {

        var semantics = org.mathdox.formulaeditor.semantics;
        // parse the children of the OMA
        var children = node.getChildNodes();

        var realpart = this.handle(children.item(1));

        var complexI = org.mathdox.formulaeditor.parsing.openmath.KeywordList["nums1__i"];

        var complexpart = new semantics.Times(this.handle(children.item(2), complexI);

        // construct a Times object
        var result = new semantics.Arith1Plus(realpart, complexpart);

        return result;
      }

    });

  /**
   * Add the parsing code for multiplication.
   */
  var semantics = org.mathdox.formulaeditor.semantics;
  var pG = new org.mathdox.parsing.ParserGenerator();

  org.mathdox.formulaeditor.parsing.expression.ExpressionContextParser.addFunction( 
    function(context) { return {

      // expression130 = times | super.expression130
      expression130 : function() {
        var parent = arguments.callee.parent;
        pG.alternation(
          pG.rule("times"),
          parent.expression130).apply(this, arguments);
      },

      // expression150 = times | super.expression150
      expression150 : function() {
        var parent = arguments.callee.parent;
        pG.alternation(
          pG.rule("invisibletimes"),
          parent.expression150).apply(this, arguments);
      },

      // invisibletimes = number variable
      invisibletimes:
        pG.transform(
          pG.concatenation(
            pG.rule("parseNumber"),
            pG.alternation(
              pG.rule("restrictedexpression160"),
              pG.rule("restrictedpower")
            )
          ),
          function(result) {
            var times = new semantics.Times(result[0], result[1]);
            times.style = "invisible";
            return times;
          }
        ),

      // times = expression130 "·" expression140
      times :
        pG.transform(
          pG.concatenation(
            pG.rule("expression130"),
            pG.literal(context.symbolArith1Times),
            pG.rule("expression140")
          ),
          function(result) {
            return new semantics.Times(result[0], result[2]);
          }
        )
      };
    });

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
            newEvent.charCode = editor.getPresentationContext().symbolArith1Times.charCodeAt(0);
            event = newEvent;

          }

        }

        // call the overridden method
        return arguments.callee.parent.onkeypress.call(this, event, editor);

      }

    });
  
  org.mathdox.formulaeditor.parsing.openmath.KeywordList["arith1__times"] = new org.mathdox.formulaeditor.semantics.KeywordTimes("arith1", "times", symbol, "infix");

});
