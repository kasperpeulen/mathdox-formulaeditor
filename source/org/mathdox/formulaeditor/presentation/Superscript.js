$package("org.mathdox.formulaeditor.presentation");

$require("org/mathdox/formulaeditor/presentation/Node.js");

$main(function(){

  /**
   * Represents a superscripted expression.
   * TODO: generalize
   */
  org.mathdox.formulaeditor.presentation.Superscript =
    $extend(org.mathdox.formulaeditor.presentation.Node, {

      draw : function(context, x, y, invisible) {

        var superscript = this.children[0];

        var dim0;
        with(org.mathdox.formulaeditor.presentation) {
          if (this.parent instanceof Row && this.index > 0) {
            dim0 = this.parent.children[this.index - 1].dimensions;
          }
          else {
            dim0 = new Symbol("x").draw(context,x,y,true);
            dim0.left = x - dim0.width;
          }
        }

        var tmp = superscript.draw(context,0,0,true);

        var dim1 = superscript.draw(
          context,
          dim0.left + dim0.width,
          dim0.top - (tmp.height + tmp.top),
          invisible
        );

        var left   = dim1.left;
        var top    = Math.min(dim0.top,  dim1.top );
        var right  = dim1.left + dim1.width;
        var bottom = Math.max(dim0.top  + dim0.height, dim1.top  + dim1.height);

        return {
          left   : left,
          top    : top,
          width  : right - left,
          height : bottom - top
        };

        //return dim1;
      },

      getFollowingCursorPosition : function(index) {
        if (index == null) {
          return this.children[0].getFollowingCursorPosition();
        }
        else {
          if (this.parent != null) {
            return { row : this.parent, index: this.index + 1 };
          }
          else {
            return null;
          }
        }
      },

      getPrecedingCursorPosition : function(index) {
        if (index == null) {
          return this.children[0].getPrecedingCursorPosition();
        }
        else {
          if (this.parent != null) {
            return { row : this.parent, index: this.index };
          }
          else {
            return null;
          }
        }
      },

      // TODO: getLowerCursorPosition & getHigherCursorPosition (not sure whether this is nice)
  /*
      getLowerCursorPosition : function(index, x) {
        if (index == null) {
          return this.children[0].getLowerCursorPosition();
        }
        else {
          if (this.parent != null) {
            return { row: this.parent, index: this.index };
          }
          else {
            return null;
          }
        }
      },
  */

      getSemantics : function() {
        return {
          value : this.children[0].getSemantics().value,
          rule  : "superscript"
        }
      }

    })

})