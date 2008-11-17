$package("org.mathdox.formulaeditor.semantics");

$identify("org/mathdox/formulaeditor/semantics/FunctionApplication.js");

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
       * See org.mathdox.formulaeditor.semantics.Node.getPresentation(context)
       */
      getPresentation : function(context) {

        var presentation = org.mathdox.formulaeditor.presentation;

        // construct an array of the presentation of operand nodes interleaved
        // with operator symbols
        var array = [];

        array.push(this.symbol.getPresentation(context));
        array.push(new presentation.Symbol("("));
        for (var i=0; i<this.operands.length; i++) {
          var operand = this.operands[i];
          if (i>0) {
            array.push(new presentation.Symbol(","));
          }
          
          if (!operand) {
            alert("symbol: "+this.symbol.symbol.onscreen);
            alert("operands.length: "+this.operands.length);
            alert("operands[0]: "+this.operands[0]);
            alert("operands[1]: "+this.operands[1]);
          }
          array.push(operand.getPresentation(context));
      
        }
        
        array.push(new presentation.Symbol(")"));

        // create and return new presentation row using the constructed array
        var result = new presentation.Row();
        result.initialize.apply(result, array);

        return result;

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

        var result = "<mrow>" + this.symbol.getMathML() + "<mo>(</mo>";

        for (var i=0; i<this.operands.length; i++) {
          result = result + this.operands[i].getMathML();
        }
        result = result + "<mo>)</mo>" + "</mrow>";

        return result;

      }

    });

});
