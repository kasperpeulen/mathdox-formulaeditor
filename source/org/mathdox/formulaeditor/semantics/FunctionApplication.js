$package("org.mathdox.formulaeditor.semantics");

$require("org/mathdox/formulaeditor/semantics/Node.js");
$require("org/mathdox/formulaeditor/semantics/Variable.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");
$require("org/mathdox/formulaeditor/presentation/Symbol.js");

$main(function(){

  /**
   * Representation of an n-ary function application.
   */
  org.mathdox.formulaeditor.semantics.FunctionApplication =
    $extend(org.mathdox.formulaeditor.semantics.Node, {

      /**
       * The operands of the operation.
       */
      operands: null,

      /**
       * Information about the symbol that is used to represent this operation.
       */
      symbol: null,

      /**
       * Initializes the operation using the specified arguments as operands.
       */
      initialize : function(symbol, operands) {
	this.symbol = symbol;
        this.operands = operands;
      },

      /**
       * See org.mathdox.formulaeditor.semantics.Node.getPresentation()
       */
      getPresentation : function() {

        with(org.mathdox.formulaeditor.presentation) {

          // construct an array of the presentation of operand nodes interleaved
          // with operator symbols
          var array = new Array();

          array.push(this.symbol.getPresentation());
	  array.push(new Symbol("("));
          for (var i=0; i<this.operands.length; i++) {
            var operand = this.operands[i];
            if (i>0) {
              array.push(new Symbol(","));
            }
            
            array.push(operand.getPresentation());
	
          }
          
	  array.push(new Symbol(")"));

          // create and return new presentation row using the constructed array
          var result = new Row();
          result.initialize.apply(result, array);

          return result;

        }

      },

      /**
       * See org.mathdox.formulaeditor.semantics.Node.getOpenMath()
       */
      getOpenMath : function() {

        var result = "<OMA>" + this.symbol.getOpenMath();
        for (var i=0; i<this.operands.length; i++) {
          result = result + this.operands[i].getOpenMath();
        }
        result = result + "</OMA>";
        return result;

      },

      /**
       * See org.mathdox.formulaeditor.semantics.Node.getMathML()
       */
      getMathML : function() {

        var result = "<mrow>"
        for (var i=0; i<this.operands.length; i++) {
          if (i>0) {
            result = result + this.symbol.getMathML();
          }
          result = result + this.operands[i].getOpenMath();
        }
        result = result + "</mrow>";
        return result;

      }

    })

})
