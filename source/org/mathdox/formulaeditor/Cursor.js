$package("org.mathdox.formulaeditor");

$main(function(){

  /**
  * Represents the keyboard cursor.
  */
  org.mathdox.formulaeditor.Cursor = $extend(Object, {

    position : null,

    initialize : function(position) {
      this.position = position;
    },

    moveRight : function() {

      var row   = this.position.row;
      var index = this.position.index;

      var newPosition = row.getFollowingCursorPosition(index);
      if (newPosition != null) {
        this.position = newPosition;
      }

    },

    moveLeft : function() {

      var row   = this.position.row;
      var index = this.position.index;

      var newPosition = row.getPrecedingCursorPosition(index);
      if (newPosition != null) {
        this.position = newPosition;
      }

    },

    moveDown : function() {

      var row   = this.position.row;
      var index = this.position.index;

      var newPosition = row.getLowerCursorPosition(index, this.getX());
      if (newPosition != null) {
        this.position = newPosition;
      }

    },

    moveUp : function() {

      var row   = this.position.row;
      var index = this.position.index;

      var newPosition = row.getHigherCursorPosition(index, this.getX());
      if (newPosition != null) {
        this.position = newPosition;
      }

    },

    getX : function() {

      // TODO: use this in draw, rename
      var row   = this.position.row;
      var index = this.position.index;

      var dim0 = row.children[index-1] ? row.children[index - 1].dimensions : null;
      var dim1 = row.children[index]   ? row.children[index].dimensions     : null;

      if (dim0 == null && dim1 == null) {
        dim1 = row.dimensions;
      }
      if (dim0 == null && dim1 != null) {
        dim0 = { left: row.dimensions.left, top: dim1.top, width:0, height: dim1.height };
      }
      if (dim1 == null && dim0 != null) {
        dim1 = { left: dim0.left + dim0.width, top: dim0.top, width:0, height: dim0.height };
      }

      return Math.round(dim0.left + dim0.width + ((dim1.left - (dim0.left + dim0.width))/2));

    },

    draw : function(canvas) {

      var lineWidth = 2.0;
      var margin    = 2.0;
      var color     = "#99F";

      var row   = this.position.row;
      var index = this.position.index;

      var dim0 = row.children[index-1] ? row.children[index - 1].dimensions : null;
      var dim1 = row.children[index]   ? row.children[index].dimensions     : null;

      if (dim0 == null && dim1 == null) {
        dim1 = row.dimensions;
      }
      if (dim0 == null && dim1 != null) {
        dim0 = { left: row.dimensions.left, top: dim1.top, width:0, height: dim1.height };
      }
      if (dim1 == null && dim0 != null) {
        dim1 = { left: dim0.left + dim0.width, top: dim0.top, width:0, height: dim0.height };
      }

      var x      = Math.round(dim0.left + dim0.width + ((dim1.left - (dim0.left + dim0.width))/2));
      var top    = Math.round(Math.min(dim0.top, dim1.top) - margin);
      var bottom = Math.round(Math.max(dim0.top + dim0.height, dim1.top + dim1.height) + margin);

      var context = canvas.getContext();

      context.save();
      context.lineWidth = lineWidth;
      context.strokeStyle = color;
      context.beginPath();
      context.moveTo(x, top);
      context.lineTo(x, bottom);
      context.stroke();
      context.closePath();
      context.restore();

    }

  })

})
