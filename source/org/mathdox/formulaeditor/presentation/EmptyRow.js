
$package("org.mathdox.formulaeditor.presentation");

$require("org/mathdox/formulaeditor/presentation/Node.js");

$main(function(){
  /**
   * Representation of an empty row of mathematical expressions in the
   * presentation tree.
   */
  org.mathdox.formulaeditor.presentation.EmptyRow =
    $extend(org.mathdox.formulaeditor.presentation.Row, {
    isEmpty : function() {
      return (this.children.length == 0);
    },
    insert: function(index, node) {
      //arguments.callee.parent.insert(index, node);
      this.children.splice(index, 0, node);
      this.updateChildren(index);
      if (this.parent != null) {
	this.parent.flatten();
      }
    }
  });

});

