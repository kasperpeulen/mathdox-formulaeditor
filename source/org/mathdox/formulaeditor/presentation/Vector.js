$package("org.mathdox.formulaeditor.presentation");

$identify("org/mathdox/formulaeditor/presentation/Vector.js");

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
          var leftBracket = new Bracket('(');
          var rightBracket = new Bracket(')');

          this.middle = new Column();
          this.middle.initialize.apply(this.middle,arguments);
          this.middle.margin = 10.0;

          arguments.callee.parent.initialize.call(this, leftBracket, 
            this.middle, rightBracket);
        }
      },

      getSemantics : function() {
        var semanticEntries;
        var vector;

        with (org.mathdox.formulaeditor.semantics) {
          semanticEntries = new Array();
          for (var i=0;i<this.middle.children.length;i++) {
            semanticEntries.push(this.middle.children[i].getSemantics().value);
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

});
