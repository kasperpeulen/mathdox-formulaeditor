$package("org.mathdox.formulaeditor.presentation");

$identify("org/mathdox/formulaeditor/presentation/Boxed.js");

$require("org/mathdox/formulaeditor/presentation/Node.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");

$main(function(){
  org.mathdox.formulaeditor.presentation.Boxed =
    $extend(org.mathdox.formulaeditor.presentation.Node, {

    semanticClass : null,

    children : null,

    margin : 5,
    
    initialize : function(semanticClass, children, presentation) {
      this.semanticClass = semanticClass;
      this.children = children;
      this.presentation = presentation;
      this.updateChildren();
    },

    draw : function(canvas, context, x, y, invisible) { 
      var dim = this.presentation.draw(canvas, context, 0, 0, true);

      var height = this.presentation.dimensions.height;
      var width = this.presentation.dimensions.width;

      this.dimensions = {
        height : height + 2*this.margin,
        width : width + 2* this.margin,
        left : dim.left + x,
        top : dim.top + y - this.margin 
      }

      if (!invisible) {
        canvas.drawBox(this.dimensions);
        this.presentation.draw(canvas, context, x + this.margin, y, false);
      }

      return this.dimensions;
    },

    getFirstCursorPosition : function(index) {
      return this.getFollowingCursorPosition();
    },
    
    getLastCursorPosition : function(index) {
      return this.getPrecedingCursorPosition();
    },

    getFollowingCursorPosition : function(index) {
      var result = null;

      if (index === null||index === undefined ) {
	result = this.children[0].getFirstCursorPosition();
      } else if (index + 1 < this.children.length) {
	result = this.children[index+1].getFollowingCursorPosition();
      }

      if (((result === null)|| (result === undefined)) && (this.parent !== null)) {
        result = this.parent.getFollowingCursorPosition(this.index, false);
      }

      return result;
    },

    getPrecedingCursorPosition : function(index) {
      var result = null;

      if (index === null||index === undefined ) {
	result = this.children[this.children.length -1].getLastCursorPosition();
      } else if (index - 1 >= 0) {
	result = this.children[index-1].getPrecedingCursorPosition();
      }

      if (((result === null)|| (result === undefined)) && (this.parent !== null)) {
        return { row: this.parent, index: this.index };
      }

      return result;
    },

    getSemantics : function(context) {
      var values = [];
      var i;
      for (i=0; i<this.children.length; i++) {
        values.push(this.children[i].getSemantics(context).value);
      }

      var value = null;

      if (this.semanticClass !== null) {
	value = new this.semanticClass();
	value.initialize.apply(value, values);
      }

      return {
        value : value,
        rule : "braces"
      }

    }
  });

});
