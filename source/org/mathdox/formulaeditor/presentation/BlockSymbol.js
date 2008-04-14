$package("org.mathdox.formulaeditor.presentation");

$require("org/mathdox/formulaeditor/presentation/Symbol.js");

$main(function(){
  /**
   * Representation of an empty space in a row in the presentation tree.
   */
  org.mathdox.formulaeditor.presentation.BlockSymbol =
    $extend(org.mathdox.formulaeditor.presentation.Symbol, {

    initialize : function() {
      this.value = null;
      this.onscreen = "f";
    },

    draw : function(canvas, x, y, invisible) {
      this.dimensions = canvas.drawFBox(
	Math.round(x), Math.round(y), invisible, this.onscreen
      );

      return this.dimensions;
    }
  })

})

