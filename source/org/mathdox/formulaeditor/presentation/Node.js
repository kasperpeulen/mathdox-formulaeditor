$package("org.mathdox.formulaeditor.presentation");

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
    children : null,

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

      var savedDrawFunction = this.draw;
      this.draw = function(context, x, y, invisible) {
        var result = savedDrawFunction.call(this, context, x, y, invisible);
        this.dimensions = result;
        return result;
      }

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

    getFollowingCursorPosition : function(index) {
      if (this.parent != null) {
        return { row : this.parent, index : this.index + 1 };
      }
      else {
        return null;
      }
    },

    getPrecedingCursorPosition : function(index) {
      if (this.parent != null) {
        return { row: this.parent, index: this.index };
      }
      else {
        return null;
      }
    },

    getLowerCursorPosition : function(index, x) {

      if (this.parent != null) {
        if (index == null) {
          return { row: this.parent, index: this.index };
        }
        else {
          return this.parent.getLowerCursorPosition(this.index, x);
        }
      }
      else {
        return null;
      }

    },

    getHigherCursorPosition : function(index, x) {

      if (this.parent != null) {
        if (index == null) {
          return { row: this.parent, index: this.index };
        }
        else {
          return this.parent.getHigherCursorPosition(this.index, x);
        }
      }
      else {
        return null;
      }

    },

    updateChildren : function(index) {
      if (index == null) {
        index = 0;
      }
      for (var i=index; i<this.children.length; i++) {
        this.children[i].parent = this;
        this.children[i].index = i;
      }
    }

  })

})