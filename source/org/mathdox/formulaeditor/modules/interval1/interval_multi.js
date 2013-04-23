$identify("org/mathdox/formulaeditor/modules/interval1/interval_multi.js");

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
   * Defines a semantic tree node that represents an interval.
   */
  org.mathdox.formulaeditor.semantics.Interval1Interval_multi =
    $extend(org.mathdox.formulaeditor.semantics.MultaryListOperation, {

      /* to be filled in by extending classes */
      symbol : null,
      leftOpen: null,
      rightOpen: null,
      className: null,

      getPresentation: function (context) {
        var presentation = org.mathdox.formulaeditor.presentation;
        var semantics = org.mathdox.formulaeditor.semantics;

	var result = [];
	var children = [];
	var child;
        /* TODO: configure open brackets */
	var option = context.optionInterval1Brackets;

	var bracket;

	if (this.leftOpen) {
	  bracket = option.lo;
	} else {
	  bracket = option.lc;
	}

	var left = new presentation.Bracket(bracket);

	child = new presentation.Row(this.operands[0].getPresentation(context));
	children.push(child);
	result.push(child);

	/* TODO: configure seperator */
	result.push(new presentation.Symbol(","));

	child=new presentation.Row(this.operands[1].getPresentation(context));
	children.push(child);
	result.push(child);

	if (this.rightOpen) {
	  bracket = option.ro;
	} else {
	  bracket = option.rc;
	}

        var right = new presentation.Bracket(bracket);
	var brow = new presentation.PseudoRow();
	brow.initialize.apply(brow, result);

	var row = new presentation.Row(new presentation.Bracketed(left, brow, right));

	return new presentation.Boxed(semantics[this.className], children, row);
      }

    });
});
