$package("org.mathdox.formulaeditor.presentation");

$require("org/mathdox/formulaeditor/presentation/Node.js");

$main(function(){

  org.mathdox.formulaeditor.presentation.Invisible =
    $extend(org.mathdox.formulaeditor.presentation.Node, {

      draw : function(context, x, y, invisible) {
        return this.children[0].draw(context, x, y, true);
      }

    })

})