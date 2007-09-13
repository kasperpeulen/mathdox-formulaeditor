$package("org.mathdox.formulaeditor.presentation");

$require("org/mathdox/formulaeditor/presentation/Node.js");

$main(function(){

  /**
   * Representation of a mathematical symbol (number, letter, operator) in the
   * presentation tree.
   */
  org.mathdox.formulaeditor.presentation.Symbol =
    $extend(org.mathdox.formulaeditor.presentation.Node, {

      /**
       * A string representation of the symbol.
       */
      value : null,

      /**
       * Initializes a Symbol node in the presentation tree using the specified
       * string representation of a symbol.
       */
      initialize : function(value) {

        this.value = value

      },

      /**
       * Draws the symbol to the canvas.
       *
       * See also: org.mathdox.formulaeditor.presentation.Node.draw
       */
      draw : function(canvas, x, y, invisible) {

        this.dimensions = canvas.drawSymbol(
          this.value, Math.round(x), Math.round(y), invisible
        );

        return this.dimensions;

      }

    })

})