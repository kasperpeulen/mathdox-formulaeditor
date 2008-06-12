$package("org.mathdox.formulaeditor.semantics");

$identify("org/mathdox/formulaeditor/semantics/Variable.js");

$require("org/mathdox/formulaeditor/presentation/Symbol.js");
$require("org/mathdox/formulaeditor/semantics/Node.js");

$main(function(){

  /**
   * Representation of a variable in the semantic tree.
   */
  org.mathdox.formulaeditor.semantics.Variable =
    $extend(org.mathdox.formulaeditor.semantics.Node, {

      /**
       * The variable name.
       */
      name : null,

      /**
       * Initializes a semantic tree node to represent the variable with the
       * specified name.
       */
      initialize : function(name) {
        this.name = name
      },

      /**
       * See org.mathdox.formulaeditor.semantics.Node.getPresentation
       */
      getPresentation : function() {
        with (org.mathdox.formulaeditor.presentation) {

          var string = this.name.toString();
          var symbols = [];

          for (var i=0; i<string.length; i++) {
            symbols[i] = new Symbol(string.charAt(i));
          }

          var result = new Row();
          result.initialize.apply(result, symbols);
          return result;

        }
      },

      /**
       * See org.mathdox.formulaeditor.semantics.Node.getOpenMath
       */
      getOpenMath : function() {
        return "<OMV name='" + this.name + "'/>"
      },

      /**
       * See org.mathdox.formulaeditor.semantics.Node.getMathML
       */
      getMathML : function() {
        return "<mi>" + this.name + "</mi>"
      }

    })

})
