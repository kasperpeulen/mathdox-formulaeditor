$package("org.mathdox.formulaeditor.presentation");

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
       * Draws the column to the canvas.
       *
       * See also: org.mathdox.formulaeditor.presentation.Node.draw
       */
      draw : function(canvas, x, y, invisible) {

        // the amount of space between the column elements
        var margin = this.margin;

        // determine the dimensions of the children, and the maximum width
        var maxWidth = 0;
        for (var i=0; i<this.children.length; i++) {
          this.children[i].draw(canvas, 0, 0, true);
          maxWidth = Math.max(maxWidth, this.children[i].dimensions.width);
        }

        // determine the horizontal center of the column
        var center = x + (maxWidth / 2);

        // determine whether there is a middle element or not
        if (this.children.length % 2 == 0) {

          // draw all children above the baseline
          var top = y - margin / 2;
          for (var i = this.children.length / 2 - 1; i >= 0; i--) {
            var child       = this.children[i];
            var childWidth  = child.dimensions.width;
            var childHeight = child.dimensions.height;
            var childLeft   = child.dimensions.left;
            var childBottom = child.dimensions.top + child.dimensions.height;
            child.draw(
              canvas,
              center - (childWidth / 2) - childLeft, // horizontally centered
              top - childBottom,                     // above previous child
              invisible
            );
            top = top - childHeight - margin;
          }

          // draw all children below the baseline
          var bottom = y + margin / 2;
          for (var i = this.children.length/2; i < this.children.length; i++) {
            var child       = this.children[i];
            var childWidth  = child.dimensions.width;
            var childHeight = child.dimensions.height;
            var childLeft   = child.dimensions.left;
            var childTop    = child.dimensions.top;
            child.draw(
              canvas,
              center - (childWidth / 2) - childLeft, // horizontally centered
              bottom - childTop,                     // below previous child
              invisible
            );
            bottom = bottom + childHeight + margin;
          }

          // return the dimensions of the column
          return this.dimensions = {
            top    : top,
            left   : x,
            width  : maxWidth,
            height : bottom - top
          };

        }
        else {

          // draw the middle child
          var middle            = Math.floor(this.children.length / 2);
          var middleChild       = this.children[middle];
          var middleChildTop    = middleChild.dimensions.top;
          var middleChildWidth  = middleChild.dimensions.width;
          var middleChildHeight = middleChild.dimensions.height;
          var middleChildLeft   = middleChild.dimensions.left;
          middleChild.draw(
            canvas,
            center - (middleChildWidth / 2) - middleChildLeft, 
                                              // horizontally centered
            y,
            invisible
          );
          
          // draw all children above the middle child
          var top = y + middleChildTop - margin;
          for (var i = middle - 1; i >= 0; i--) {
            var child       = this.children[i];
            var childWidth  = child.dimensions.width;
            var childHeight = child.dimensions.height;
            var childLeft   = child.dimensions.left;
            var childBottom = child.dimensions.top + child.dimensions.height;
            child.draw(
              canvas,
              center - (childWidth / 2) - childLeft, // horizontally centered
              top - childBottom,                     // above previous child
              invisible
            );
            top = top - childHeight - margin;
          }

          // draw all children below the middle child
          var bottom = y + middleChildTop + middleChildHeight + margin;
          for (var i = middle + 1; i < this.children.length; i++) {
            var child       = this.children[i];
            var childWidth  = child.dimensions.width;
            var childHeight = child.dimensions.height;
            var childLeft   = child.dimensions.left;
            var childTop    = child.dimensions.top;
            child.draw(
              canvas,
              center - (childWidth / 2) - childLeft, // horizontally centered
              bottom - childTop,                     // below previous child
              invisible
            );
            bottom = bottom + childHeight + margin;
          }

          // return the dimensions of the column
          return this.dimensions = {
            top    : top,
            left   : x,
            width  : maxWidth,
            height : bottom - top
          };
          
        }

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
