

$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/presentation/Superscript.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionContextParser.js");

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

      getPresentation : function(context) {

        var presentation = org.mathdox.formulaeditor.presentation;
        // add braces to base, if necessary
        var base = this.operands[0].getPresentation(context);
        if (base instanceof presentation.Row && base.children.length > 1) {
          base = new presentation.Row(new presentation.Symbol("("), base, 
            new presentation.Symbol(")"));
        }
        return new presentation.Row(
          base,
          new presentation.Superscript(
            this.operands[1].getPresentation(context))
        );
      },

      getMathML : function() {

        return "<msup>" +
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
   * Add the parsing code for power operations.
   */
  var semantics = org.mathdox.formulaeditor.semantics;
  var pG = new org.mathdox.parsing.ParserGenerator();

  org.mathdox.formulaeditor.parsing.expression.ExpressionContextParser.addFunction( 
    function(context) { 
      var func_powCheck = function(oper) {
        return false;
      };

      var func_powUpdate = function(oper) {
        return oper;
      };

      if (context.optionArith1PowerPrefix === "true") {
        func_powCheck = function(operInput) {
         
          var oper;

          oper = operInput;
          // oper should be a function application
          if (! (oper instanceof semantics.FunctionApplication) ) {
            return false;
          }

          // symbol should exist
          if (oper.symbol === undefined || oper.symbol === null) {
            return false;
          } 

	  oper = oper.symbol;

          if (! (oper instanceof semantics.Power) ) {
            return false;
          }
          
	  if ((oper.operands[0] instanceof semantics.Keyword) && oper.operands[1].cd == "transc1") {
            return true;
          }

	  if ((oper.operands[1] instanceof semantics.Variable) ) {
            return true;
          }

	  if ((oper.operands[1] instanceof semantics.Integer) && oper.operands[1].value > 0 ) {
            return true;
          }

          return false;
        };
        func_powUpdate = function(oper) {
          if (func_powCheck(oper)) {
            var symbol = oper.symbol.operands[0];

            var base = new semantics.FunctionApplication(symbol, oper.operands);

	    var exponent = oper.symbol.operands[1]; 

            return new semantics.Power(base, exponent);
          } else {
            return oper;
          }
        };
      } 

      return {

      // expression150 = power | super.expression150
      expression150 : function() {
        var parent = arguments.callee.parent;
        pG.alternation(
          pG.rule("power"),
          parent.expression150).apply(this, arguments);
      },

      // power = expression160 superscript
      power :
        pG.transform(
          pG.concatenation(
            pG.rule("expression160"),
            pG.rule("superscript")
          ),
          function(result) {
            return new semantics.Power(result[0], result[1]);
          }
        ),
      // note copy from ExpressionParser
      func_Update: function(oper) {
        var parent = arguments.callee.parent;
        return parent.func_Update( func_powUpdate(oper) );
      },

      func_symbol: function() {
        var parent = arguments.callee.parent;
        pG.alternation(
          pG.rule("power"),
          parent.func_symbol).apply(this, arguments);
      },

      // useful for invisible multiplication (should not start with a number)
      // restrictedpower = restrictedexpression160 superscript
      restrictedpower :
        pG.transform(
          pG.concatenation(
            pG.rule("restrictedexpression160"),
            pG.rule("superscript")
          ),
          function(result) {
            return new semantics.Power(result[0], result[1]);
          }
        ),

      // superscript = 0
      superscript : pG.never
      };
    });

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
            var parsed = this.getSemantics(editor.getExpressionParsingContext(), index, length, "expression130");

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
