$identify("org/mathdox/formulaeditor/modules/logic1/and_system.js");

$require("org/mathdox/formulaeditor/Options.js");
$require("org/mathdox/formulaeditor/modules/logic1/and.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionContextParser.js");
$require("org/mathdox/formulaeditor/parsing/expression/KeywordList.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/presentation/Boxed.js");
$require("org/mathdox/formulaeditor/presentation/Bracket.js");
$require("org/mathdox/formulaeditor/presentation/Bracketed.js");
$require("org/mathdox/formulaeditor/presentation/PseudoRow.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");
$require("org/mathdox/formulaeditor/semantics/MultaryListOperation.js");
$require("org/mathdox/parsing/ParserGenerator.js");

$main(function(){

  /**
   * Defines a semantic tree node that represents a system of equations.
   */
  org.mathdox.formulaeditor.semantics.Logic1And_system =
    $extend(org.mathdox.formulaeditor.semantics.MultaryListOperation, {

      /* display style is "system" */
      style: "system",

      symbol: {
        openmath: "<OMS cd='logic1' name='and'/>"
      },

      getMathML: function() {
        var result = "<mfenced open=\"{\" close=\"\"><mtable>";
        var i;

        for (i=0; i<this.operands.length; i++) {
          /* for each operand create row with a single entry */
          /* do not use mrow inside table */
          result = result + "<mtr><mtd>" + this.operands[i].getMathML(false) + "</mtd></mtd>";
        }

        result = result + "</mtable></mfenced>";
      },

      getPresentation: function (context) {
        var presentation = org.mathdox.formulaeditor.presentation;
        var semantics = org.mathdox.formulaeditor.semantics;

        var paContents = [];
        var children = [];
        var focusEntries;
        var child;
        var row;

        var i;
        for (i = 0; i<this.operands.length; i++) {
          child = new presentation.Row(this.operands[i].getPresentation(context));
          children.push(child);
          row = [];
          row.push(child);
          paContents.push(row);
        }

        var parray = new presentation.PArray();
	parray.initialize.apply(parray, paContents);
	focusEntries = paContents;

        var prowContents = [];
        prowContents.push(parray);

        var left = new presentation.Bracket("{");
        var right = null; /* no right bracket */

        var prow = new presentation.PseudoRow();
        prow.initialize.apply(prow, prowContents);

        var bracketed = new presentation.Bracketed(left, parray, right);
        bracketed.separable = false;

        var row = new presentation.Row(bracketed);

        return new presentation.Boxed(semantics.Logic1And_system, children, row, focusEntries);
      }

    });

  /**
   * Extend the OpenMathParser object with parsing code for logic1.and with style system
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a Logic1And object based on the style 
       */
      handleLogic1And : function(node, style) {

        // construct an And object
	if (style == "system") {
	  // parse the children of the OMA
          var children = node.childNodes;
          var operands = [];

          for (var i=1; i<children.length; i++) {
            operands.push(this.handle(children.item(i)));
          }

          var result = new org.mathdox.formulaeditor.semantics.Logic1And_system();
          result.initialize.apply(result, operands);

          return result;
        } else {
	  /* use parent method */
	  return arguments.callee.parent.handleLogic1And.call(this, node, style);
	}
      }

    });

    org.mathdox.formulaeditor.parsing.expression.KeywordList.andsystem = {
      parseResultFun : function(oper, array) {
        var semantics = org.mathdox.formulaeditor.semantics;
        var oper = new semantics.Logic1And_System();
        oper.initialize.apply(oper, array);

        return oper;
      }
    };

});
