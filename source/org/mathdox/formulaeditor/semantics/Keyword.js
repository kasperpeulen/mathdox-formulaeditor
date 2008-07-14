$package("org.mathdox.formulaeditor.semantics");

$identify("org/mathdox/formulaeditor/semantics/Keyword.js");

$require("org/mathdox/formulaeditor/semantics/Node.js");
$require("org/mathdox/formulaeditor/presentation/Symbol.js");

$main(function(){

  /**
   * Representation of a keyword.
   */
  org.mathdox.formulaeditor.semantics.Keyword =
    $extend(org.mathdox.formulaeditor.semantics.Node, {

      /**
       * The operands of the operation.
       */
      operands: null,

      /**
       * Information about the symbol that is used to represent this keyword.
       */
      symbol : {

        /**
         * The symbol(s) that is/are used for rendering the keyword to the
         * screen.
         */
        onscreen : null,

        /**
         * The OpenMath symbol that is associated with this operation.
         */
        openmath : null,

        /**
         * The MathML representation of this operation.
         */
        mathml   : null

      },

      /**
       * Initializes the keyword using the specified arguments as operands.
       */
      initialize : function(cd,name,symbol) {
        this.cd = cd;
        this.name = name;
	if (symbol) {
	  this.symbol = new Object();
	  if (symbol.onscreen) {
	    this.symbol.onscreen = symbol.onscreen;
	  }
	  if (symbol.openmath) {
	    this.symbol.openmath = symbol.openmath;
	  }
	  if (symbol.mathml) {
	    this.symbol.mathml = symbol.mathml;
	  }
	}
      },

      /**
       * See org.mathdox.formulaeditor.semantics.Node.getPresentation()
       */

      getPresentation : function() {
        with (org.mathdox.formulaeditor.presentation) {
          var string;

          if (this.symbol.onscreen != null) {
            string = this.symbol.onscreen.toString();
          } else {
            string = (this.cd + "." + this.name).toString();
          }
  
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
       * See org.mathdox.formulaeditor.semantics.Node.getOpenMath()
       */
      getOpenMath : function() {
        var result;
	
	if (this.symbol.openmath!=null) {
	  result = this.symbol.openmath;
	} else {
	  result = "<OMS cd='" + this.cd + "' name='" + this.name + "'/>"
	}
        return result
      },

      /**
       * See org.mathdox.formulaeditor.semantics.Node.getMathML()
       */
      getMathML : function() {
        var result;
	
	if (this.symbol.mathml!=null) {
	  result = this.symbol.mathml;
	} else if (this.symbol.onscreen!=null) {
	  result = "<mi>" + this.symbol.onscreen + "</mi>"
	} else {
	  result = "<mi>" + this.cd + "." + this.name + "</mi>"
	}

        return result
      }

    })

});
