$package("org.mathdox.formulaeditor.presentation");

$identify("org/mathdox/formulaeditor/presentation/Column.js");

$require("org/mathdox/formulaeditor/presentation/Node.js");

$main(function(){

  /**
   * Representation of a column of mathematical expressions in the presentation
   * tree.
   */
  org.mathdox.formulaeditor.presentation.Column =
    $extend(org.mathdox.formulaeditor.presentation.Node, {
      /*
       * the margin between the entries
       */
      margin: 2.0,

      /**
       * should we draw a box around the column and all entries ?
       */
      drawBox : false,

      /**
       * Draws the column to the canvas.
       *
       * vertical align on middle column: Math.floor((this.children.length)/2)
       *
       * See also: org.mathdox.formulaeditor.presentation.Node.draw
       */
      draw : function(canvas, x, y, invisible) {

        // the amount of space between the column elements
        var margin = this.margin;
        var rowInfo = new Array();

        // determine the dimensions of the children, and the maximum width
        var maxWidth = 0;
        var totalHeight = 0;

        for (var i=0; i<this.children.length; i++) {
          var height;
          var top;
          var baseline;
          var dimensions = this.children[i].draw(canvas, 0, 0, true);

          maxWidth = Math.max(maxWidth, dimensions.width);
          height = dimensions.height;
          if (i == 0) {
            baseline = 0;
            top = baseline + dimensions.top;
            totalHeight += height;
          } else {
            top = rowInfo[i-1].top + rowInfo[i-1].height + margin;
            baseline = top - dimensions.top;
            totalHeight += height + margin;
          }

          rowInfo[i] = {
            height: height,
            top: top,
            baseline: baseline
          };
        }

        // determine the baseline of the column (vertical aligned on middle
        // row, rounded down)
        
        var usedBaseline = rowInfo[Math.floor(this.children.length/2)].baseline;

        for (var row = 0; row < this.children.length; row++) {
          rowInfo[row].top -= usedBaseline;
          rowInfo[row].baseline -= usedBaseline;
        }

        // center of the column
        var center = x + maxWidth/2;

        for (var row = 0; row < this.children.length; row++) {
          var childLeft = center - this.children[row].dimensions.width/2;
          this.children[row].draw(canvas, childLeft, y + rowInfo[row].baseline, 
            invisible
          );
        }

        this.dimensions = {
          top: y + rowInfo[0].top,
          left: x,
          width: maxWidth,
          height: totalHeight
        };


	if ((!invisible) && this.drawBox) {
	  canvas.drawBox(this.dimensions,y);
	}

        return this.dimensions;

      },

      getCursorPosition : function(x, y) {

        for (var i=0; i<this.children.length - 1; i++) {
          if (y < this.children[i+1].dimensions.top) {
            return this.children[i].getCursorPosition(x,y);
          }
        }
        return this.children[this.children.length - 1].getCursorPosition(x,y);

      },

      /**
       * See also Node.getFollowingCursorPosition(index).
       */
      getFollowingCursorPosition : function(index) {

        if (index == null) {
          var result = null;
          var middle = Math.floor(this.children.length / 2);
          var i      = middle;
          while(result==null && 0<=i && i<this.children.length) {
            result = this.children[i].getFollowingCursorPosition();
            if (i>=middle) {
              i = 2*middle - i - 1;
            }
            else {
              i = 2*middle - i;
            }
          }
          return result;
        }

        if (this.parent != null) {
          return this.parent.getFollowingCursorPosition(this.index, false);
        }

        return null;

      },

      getPrecedingCursorPosition : function(index) {

        if (index == null) {
          var result = null;
          var middle = Math.floor(this.children.length / 2);
          var i      = middle;
          while(result==null && 0<=i && i<this.children.length) {
            result = this.children[i].getPrecedingCursorPosition();
            if (i>=middle) {
              i = 2*middle - i - 1;
            }
            else {
              i = 2*middle - i;
            }
          }
          return result;
        }

        if (this.parent != null) {
          return this.parent.getPrecedingCursorPosition(this.index+1, false);
        }

        return null;

      },

      getLowerCursorPosition : function(index, x) {
        var last = this.children.length - 1;
        if (index == null) {
          return this.children[0].getLowerCursorPosition(null, x);
        }
        else {
          if (index < last) {
            return this.children[index + 1].getLowerCursorPosition(null, x);
          }
          else {
            arguments.callee.parent.getLowerCursorPosition(this, index, x);
          }
        }
      },

      getHigherCursorPosition : function(index, x) {
        var last = this.children.length - 1;
        if (index == null) {
          return this.children[last].getHigherCursorPosition(null, x);
        }
        else {
          if (index > 0) {
            return this.children[index - 1].getHigherCursorPosition(null, x);
          }
          else {
            arguments.callee.parent.getHigherCursorPosition(this, index, x);
          }
        }
      }

    })

})
