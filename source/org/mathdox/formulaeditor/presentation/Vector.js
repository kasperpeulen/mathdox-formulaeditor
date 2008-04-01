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
      column: null,

      initialize : function () {
        with (org.mathdox.formulaeditor.presentation) {
          var leftBracket = new Bracket('(');
          var rightBracket = new Bracket(')');
	  var column;

          column = new Column();
          column.initialize.apply(column,arguments);
          column.margin = 10.0;

          arguments.callee.parent.initialize(leftBracket, column,
            rightBracket);
	  
	  this.entries = arguments;
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
          value : matrix,
          rule  : "braces"
        }
      }

    })

})
