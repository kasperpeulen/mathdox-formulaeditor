$package("org.mathdox.formulaeditor.presentation");

$require("org/mathdox/formulaeditor/presentation/Bracket.js");
$require("org/mathdox/formulaeditor/presentation/Bracketed.js");
$require("org/mathdox/formulaeditor/presentation/PArray.js");

$main(function(){

  /**
   * Representation of a column of mathematical expressions in the presentation
   * tree.
   */
  org.mathdox.formulaeditor.presentation.Vector =
    $extend(org.mathdox.formulaeditor.presentation.Bracketed, {
      // variable to store the array to get the semantics
      entries : null,

      initialize : function () {
        with (org.mathdox.formulaeditor.presentation) {
          this.leftBracket = new Bracket('(');
          this.rightBracket = new Bracket(')');

          this.middle = new Column();
          this.middle.initialize.apply(this.middle,arguments);
          this.middle.margin = 10.0;

	  // XXX it is nicer to use the parent's initialize but there's a
	  // strange bug there
          //arguments.callee.parent.initialize(leftBracket, column,
          //  rightBracket);
	  
	  this.entries = Array.prototype.slice.call(arguments);
	  this.updateChildren();
        }
      },

      getSemantics : function() {
        var semanticEntries;
        var vector;

        with (org.mathdox.formulaeditor.semantics) {
          semanticEntries = new Array();
          for (var i=0;i<this.entries.length;i++) {
            semanticEntries.push(this.entries[i].getSemantics().value);
          }
          vector = new Linalg2Vector();
          vector.initialize.apply(vector, semanticEntries);
        }
        return {
          value : vector,
          rule  : "braces"
        }
      }

    })

})
