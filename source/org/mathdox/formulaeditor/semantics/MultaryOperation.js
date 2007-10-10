$package("org.mathdox.formulaeditor.semantics");

$require("org/mathdox/formulaeditor/semantics/Node.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");
$require("org/mathdox/formulaeditor/presentation/Symbol.js");

$main(function(){

  /**
   * Representation of an n-ary infix operation.
   */
  org.mathdox.formulaeditor.semantics.MultaryOperation =
    $extend(org.mathdox.formulaeditor.semantics.Node, {

      /**
       * The operands of the operation.
       */
      operands: null,

      /**
       * Information about the symbol that is used to represent this operation.
       */
      symbol : {

        /**
         * The symbol that is used for rendering the operation to the screen.
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

      // The precedence level of the operator.
      precedence : null,

      /**
       * Initializes the operation using the specified arguments as operands.
       */
      initialize : function() {
        this.operands = arguments
      },

      /**
       * See org.mathdox.formulaeditor.semantics.Node.getPresentation()
       */
      getPresentation : function() {

        with(org.mathdox.formulaeditor.presentation) {

          // construct an array of the presentation of operand nodes interleaved
          // with operator symbols.
          var array = new Array();
          for (var i=0; i<this.operands.length; i++) {
            var operand = this.operands[i];
            if (i>0) {
              array.push(new Symbol(this.symbol.onscreen));
            }
            if (operand.precedence && operand.precedence < this.precedence) {
              array.push(new Symbol("("));
              array.push(operand.getPresentation());
              array.push(new Symbol(")"));
            }
            else {
              array.push(operand.getPresentation());
            }
          }

          // create and return a new presentation row using the constructed array
          var result = new Row();
          result.initialize.apply(result, array);
          return result;

        }

      },

      /**
       * See org.mathdox.formulaeditor.semantics.Node.getOpenMath()
       */
      getOpenMath : function() {

        var result = "<OMA>" + this.symbol.openmath
        for (var i=0; i<this.operands.length; i++) {
          result = result + this.operands[i].getOpenMath()
        }
        result = result + "</OMA>"
        return result

      },

      /**
       * See org.mathdox.formulaeditor.semantics.Node.getMathML()
       */
      getMathML : function() {

        var result = "<mrow>"
        for (var i=0; i<this.operands.length; i++) {
          if (i>0) {
            result = result + this.symbol.mathml
          }
          result = result + this.operands[i].getOpenMath()
        }
        result = result + "</mrow>"
        return result

      }

    })

})