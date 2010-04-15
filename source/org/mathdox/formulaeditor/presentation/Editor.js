$package("org.mathdox.formulaeditor.presentation");

$identify("org/mathdox/formulaeditor/presentation/Editor.js");

$require("org/mathdox/formulaeditor/presentation/Node.js");

$main(function(){

  /**
   * Representation of the editor root element in the presentation tree.
   */
  org.mathdox.formulaeditor.presentation.Editor =
    $extend(org.mathdox.formulaeditor.presentation.Node, {
      /**
       * margin around the edges
       */
      margin : 4.0,

      /**
       * width of the palette enable/disable bar
       */
      barwidth: 10.0,

      /**
       * color of the bar, default 99F
       */
      barcolor: "#99F",

      /**
       * status of the bar, one of the following
       * "this": palette for this editor
       * "none": no palette at all
       * "other": palette for another editor
       */
      barstatus: null,

      /**
       * The arguments to the constructor are the children of this node.
       */
      initialize : function(pres) {
        var Row = org.mathdox.formulaeditor.presentation.Row;
        var row;

        this.children = [];
        if (pres) {
          row = new Row();
        } else {
          row = new Row(pres);
          row.flatten();
        }
        this.children.push(row);
        this.updateChildren();
      },
      
      /**
       * Draws the editor to the canvas.
       *
       * See also: org.mathdox.formulaeditor.presentation.Node.draw
       */
      draw : function(canvas, x, y, invisible) {
        var dimensions = this.children[0].draw(canvas, 0, 0, true);

        if (! invisible) {
          this.children[0].draw(canvas, x + this.margin - dimensions.left, y + this.margin);
        }

        /* draw bar */
        var boxdimensions = {
          left:   x + dimensions.width + 2 * this.margin,
          top:    y + dimensions.top, 
          height: dimensions.height + 2 * this.margin,
          width:  this.barwidth
        };
        /* draw the box */
        if (! invisible) {
          canvas.drawBox(boxdimensions, this.barcolor, this.barcolor);
        }

        this.dimensions = {
          left: x,
          top: boxdimensions.top,
          height: boxdimensions.height,
          width: dimensions.width + 2* this.margin + this.barwidth
        };

        return this.dimensions;
      },

      getCursorPosition : function(x, y) {
        if (x<this.dimensions.width - this.barwidth) {
          return this.children[0].getCursorPosition(x, y);
        } else {
	  return null;
	}
      },

      getFirstCursorPosition : function(index) {
        return this.children[0].getFollowingCursorPosition();
      },
      getFollowingCursorPosition : function(index, descend) {
        // default value for descend
        if (descend === null || descend === undefined) {
          descend = true;
        }

        if (!descend) {
          return null;
        }
        if (index === null || index === undefined) {
          return this.children[0].getFollowingCursorPosition();
        }
        return null;
      },
      getPrecedingCursorPosition : function(index, descend) {
        // default value for descend
        if (descend === null || descend === undefined) {
          descend = true;
        }

        if (!descend) {
          return null;
        }
        if (index === null || index === undefined) {
          return this.children[0].getPrecedingCursorPosition();
        }
        return null;
      },
      getLastCursorPosition : function(index) {
        return this.children[0].getPrecedingCursorPosition();
      },
      onmousedown : function(event, editor, x, y) {
        if (x>=this.dimensions.width - this.barwidth) {
	  /* toggle bar */
          editor.togglePalette();
	}
      }
      
    });

});
