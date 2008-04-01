$package("org.mathdox.formulaeditor.presentation");

$require("org/mathdox/formulaeditor/presentation/Bracket.js");
$require("org/mathdox/formulaeditor/presentation/Bracketed.js");
$require("org/mathdox/formulaeditor/presentation/PArray.js");
$require("org/mathdox/formulaeditor/modules/linalg/matrixrow.js");

$main(function(){

  /**
   * Representation of a column of mathematical expressions in the presentation
   * tree.
   */
  org.mathdox.formulaeditor.presentation.Matrix =
    $extend(org.mathdox.formulaeditor.presentation.Bracketed, {
      // variable to store the array to get the semantics
      pArray : null,

      initialize : function () {
        with (org.mathdox.formulaeditor.presentation) {
          var leftBracket = new Bracket('(');
          var rightBracket = new Bracket(')');

          this.pArray = new PArray();
          
          this.pArray.initialize.apply(this.pArray,arguments);
          this.pArray.margin = 10.0;

          arguments.callee.parent.initialize.call(this, leftBracket,
            this.pArray, rightBracket);
        }
      },

      getSemantics : function() {
        var rows = this.pArray.entries; // this.middle is the pArray
        var semanticRows;
        var matrix;

        with (org.mathdox.formulaeditor.semantics) {
          semanticRows = new Array();
          for (var i=0;i<rows.length;i++) {
            var semanticRowEntries;
  
            semanticRowEntries= new Array();
            for (var j=0; j<rows[i].length;j++) {
              semanticRowEntries.push(rows[i][j].getSemantics().value);
            }
            var semanticRow = new Linalg2Matrixrow();
            semanticRow.initialize.apply(semanticRow, semanticRowEntries);
            semanticRows.push(semanticRow);
          }
          matrix = new Linalg2Matrix();
          matrix.initialize.apply(matrix, semanticRows);
        }
        return {
          value : matrix,
          rule  : "braces"
        }
      }

    })

})
