$package("org.mathdox.formulaeditor.presentation");

$identify("org/mathdox/formulaeditor/presentation/PTabContainer.js");

$require("org/mathdox/formulaeditor/presentation/Node.js");
$require("org/mathdox/formulaeditor/presentation/PArray.js");

$main(function(){

  /**
   * Representation of several tabs, [including a method to switch between
   * them]
   */
  org.mathdox.formulaeditor.presentation.PTabContainer =
    $extend(org.mathdox.formulaeditor.presentation.Node, {
    /*
     * index of the current tab
     */
    currenttab: null,

    /**
     * Draws the current tab to the canvas.
     *
     * See also: org.mathdox.formulaeditor.presentation.Node.draw
     */
    draw : function(canvas, x, y, invisible) {

      if (this.current === null) {
        this.dimensions = { top:y, left:x, width:0, height:0 };
	return this.dimensions;
      }

      if ((this.children[this.current] === undefined) || (this.children[this.current] === null)) {
        this.dimensions = { top:y, left:x, width:0, height:0 };
	return this.dimensions;
      }

      return this.children[this.current].draw(canvas, x, y, invisible);
    },

    getCoordinatesFromPosition : function (x,y) {
        // NOTE: x and y might need adjusting if palette switching elements are also shown
        var palcoords = this.children[this.current].getCoordinatesFromPosition(x,y);
        return {
            tab: this.current,
            row: palcoords.row,
            col: palcoords.col
        };
    },

    initialize : function() {
      if (arguments.length >0) {
        this.children = Array.prototype.slice.call(arguments);
        this.current = 0;
      }
      this.updateChildren();
    }
  });
});
