$identify("org/mathdox/formulaeditor/modules/logic1/and_system.js");

$require("org/mathdox/formulaeditor/Options.js");
$require("org/mathdox/formulaeditor/presentation/Boxed.js");
$require("org/mathdox/formulaeditor/presentation/Bracket.js");
$require("org/mathdox/formulaeditor/presentation/Bracketed.js");
$require("org/mathdox/formulaeditor/presentation/PseudoRow.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");
$require("org/mathdox/formulaeditor/presentation/Symbol.js");
$require("org/mathdox/formulaeditor/semantics/MultaryListOperation.js");

$main(function(){

  /**
   * Defines a semantic tree node that represents a system of equations.
   */
  org.mathdox.formulaeditor.semantics.Logic1And_system =
    $extend(org.mathdox.formulaeditor.semantics.MultaryListOperation, {

      /* display style is "system" */
      style: "system",

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

        var parray = new presentation.PArray(paContents);
        var prowContents = [];
        prowContents.push(parray);

        var left = new presentation.Bracket("{");
        var right = null; /* no right bracket */

        var prow = new presentation.PseudoRow();
        prow.initialize.apply(prow, prowContents);

        var bracketed = new presentation.Bracketed(left, prow, right);
        bracketed.separable = false;

        var row = new presentation.Row(bracketed);

        return new presentation.Boxed(semantics.LogicAnd_system, children, row);
      }

    });
});
