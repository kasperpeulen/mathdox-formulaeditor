$package("org.mathdox.formulaeditor.presentation");

$identify("org/mathdox/formulaeditor/presentation/Node.js");

$main(function(){

  /**
   * Representation of a node in the presentation tree.
   */
  org.mathdox.formulaeditor.presentation.Node = $extend(Object, {

    /**
     * The parent node of this node.
     */
    parent : null,

    /**
     * The amount of siblings preceding this node.
     */
    index : null,

    /**
     * The child nodes of this node.
     */
    children : [],

    /**
     * The position and dimensions of the node when it was last rendered to a
     * canvas.
     */
    dimensions : null,

    /**
     * The arguments to the constructor are the children of this node.
     */
    initialize : function() {

      this.children = Array.prototype.slice.call(arguments);
      this.updateChildren();

    },

    /**
     * Draws the node on the specified canvas context. This is an abstract
     * method, so it is expected that subclasses will override this method.
     *
     * Parameter context: The 2d context of the canvas upon which this node is
     *   expected to draw itself
     * Parameters x,y: The (x,y) coordinate indicates where the left of the
     *   baseline of the node will appear.
     * Parameter invisible: This is an optional boolean parameter that indicates
     *   whether or not the node should be drawn to the canvas. It defaults to
     *  'false'. Setting this parameter to 'true' can be used to obtain
     *   information about the dimensions of the node, without actually
     *   drawing on the canvas.
     * Result : an object containing the values { left, top, width, height }
     *   that indicate the position and dimensions of the bounding rectangle
     *   of the node.
     */
    draw : function(context, x, y, invisible) {

      throw new Error("abstract method called")

    },

    /**
     * Method which is called whenever this node changes. Calls the parent's
     * onchange method by default.
     */
    onchange : function(node) {

      if (this.parent != null) {
        this.parent.onchange(this);
      }

    },

    /**
     * Called whenever a keypress has been detected when the cursor was at the
     * specified index. Does nothing by default, should be overridden to do
     * something usefull.
     */
    onkeypress : function(index, event) {

      // skip

    },

    /**
     * Flattens the tree, meaning that all rows inside rows will be moved into
     * one row.
     */
    flatten : function() {

      // flatten the child nodes
      for (var i=0; i<this.children.length; i++) {
        this.children[i].flatten();
      }

    },

    /**
     * Re-calculates each child's index value, and sets each child's parent
     * value. This method should be called after a change in the tree. When the
     * 'begin' argument is specified, only the children at index >= begin will
     * be updated.
     */
    updateChildren : function(begin) {

      if (begin == null) {
        begin = 0;
      }
      for (var i=begin; i<this.children.length; i++) {
        this.children[i].parent = this;
        this.children[i].index = i;
      }

    },

    /**
     * Returns a keyboard cursor position closest to the specified screen
     * coordinates.
     */
    getCursorPosition : function(x, y) {

      if (this.parent != null) {
        if (x < this.dimensions.left + this.dimensions.width / 2) {
          return this.parent.getPrecedingCursorPosition(this.index+1,false);
        }
        else {
          return this.parent.getFollowingCursorPosition(this.index,false);
        }
      }
      else {
        return null;
      }

    },

    getFirstCursorPosition : function(index) {
      if (this.parent != null) {
        return this.parent.getFirstCursorPosition();
      }
      else {
        return null;
      }
    },

    getLastCursorPosition : function(index) {
      if (this.parent != null) {
        return this.parent.getLastCursorPosition();
      }
      else {
        return null;
      }
    },

    /**
     * Returns the cursor position following the cursor position at the
     * specified index. When no cursor position can be provided, null is
     * returned. By default this method always returns null, override it to do
     * something useful.
     */
    getFollowingCursorPosition : function(index) {

      return null;

    },

    getPrecedingCursorPosition : function(index) {

      return null;

    },

    getLowerCursorPosition : function(index, x) {

      with(org.mathdox.formulaeditor.presentation) {

        if (this.parent != null) {
          if (index == null && this.parent instanceof Row) {
            return { row: this.parent, index: this.index };
          }
          else {
            return this.parent.getLowerCursorPosition(this.index, x);
          }
        }
        else {
          return null;
        }

      }

    },

    getHigherCursorPosition : function(index, x) {

      with(org.mathdox.formulaeditor.presentation) {

        if (this.parent != null) {
          if (index == null && this.parent instanceof Row) {
            return { row: this.parent, index: this.index };
          }
          else {
            return this.parent.getHigherCursorPosition(this.index, x);
          }
        }
        else {
          return null;
        }

      }

    },
    toString : function() {
      if (this.value) {
	return this.value;
      } else if (this.children) {
	var str = "[ ";
	for (var i=0; i<this.children.length; i++) {
	  str+=this.children[i];
	  if (i<this.children.length-1) {
	    str +=", ";
	  }
	}
	str+=" ]";
	return str;
      }
    }

  })

});
