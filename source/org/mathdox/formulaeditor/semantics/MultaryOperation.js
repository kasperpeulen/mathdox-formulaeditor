$package("org.mathdox.formulaeditor.semantics");

$identify("org/mathdox/formulaeditor/semantics/MultaryOperation.js");

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

      getSymbolOnscreen : function(context) {
        return this.symbol.onscreen;
      },



      /**
       * The precedence level of the operator.
       */
      precedence : 0,
 
      /**
       * Is the operator associative
       *
       * if false: put brackets around the second argument also if it has an
       * operator with the same precedence. Example: a-(b-c)
       */
      associative : true,

      /**
       * style if any (like "invisible")
       */ 
      style:null,

      /**
       * Initializes the operation using the specified arguments as operands.
       */
      initialize : function() {
        this.operands = arguments;
      },

      /**
       * See org.mathdox.formulaeditor.semantics.Node.getPresentation(context)
       */
      getPresentation : function(context) {

        var presentation = org.mathdox.formulaeditor.presentation;

        // construct an array of the presentation of operand nodes interleaved
        // with operator symbols
        var array = [];
        var i;
        var symbolOnscreen = this.getSymbolOnscreen(context);
        if (this.style != "invisible" && symbolOnscreen instanceof Array) {
          if (symbolOnscreen[0]!=="") {
            array.push(new presentation.Row(symbolOnscreen[0]));
          }
        }
        for (i=0; i<this.operands.length; i++) {
          var operand = this.operands[i];
          if (i>0 && this.style != "invisible" ) {
            if (symbolOnscreen instanceof Array) {
              if (symbolOnscreen[1]!=="") {
                array.push(new presentation.Row(symbolOnscreen[1]));
              }
            }
            else {
              array.push(new presentation.Row(symbolOnscreen));
            }
          }
          //if (operand.precedence && ((operand.precedence < this.precedence) || ((this.associative==false) && i>0 && operand.precedence <= this.precedence))) {
          if (operand.precedence && ((operand.precedence < this.precedence) || 
	     (operand.precedence == this.precedence && 
	         (i>0 || (this.associative==true && this.symbol.openmath == operand.symbol.openmath))))) {
            array.push(new presentation.Symbol("("));
            array.push(operand.getPresentation(context));
            array.push(new presentation.Symbol(")"));
          }
          else {
            array.push(operand.getPresentation(context));
          }
        }
        if (this.style != "invisible" && symbolOnscreen instanceof Array) {
          if (symbolOnscreen[2]!=="") {
            array.push(new presentation.Row(symbolOnscreen[2]));
          }
        }

        // create and return new presentation row using the constructed array
        var result = new presentation.Row();
        result.initialize.apply(result, array);
        return result;

      },

      /**
       * See org.mathdox.formulaeditor.semantics.Node.getOpenMath()
       */
      getOpenMath : function() {

        var result = "<OMA";

        // add style (like invisible) if present
        if (this.style) {
          result = result + " style='" + this.style + "'";
        }

        result = result + ">" + this.symbol.openmath;
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

        var result = "<mrow>";

        if (this.symbol.mathml instanceof Array) {
          result = result + this.symbol.mathml[0];
        }

        for (var i=0; i<this.operands.length; i++) {
          var operand = this.operands[i];
          if (i>0) {
            if (this.symbol.mathml instanceof Array) {
              result = result + this.symbol.mathml[1];
            } else {
              result = result + this.symbol.mathml;
            }
          }
          if (operand.precedence && ((operand.precedence < this.precedence) || ((this.associative==false) && i>0 && operand.precedence <= this.precedence))) {
            result = result + "<mo>(</mo>";
            result = result + this.operands[i].getMathML();
            result = result + "<mo>)</mo>";
          }
          else {
            result = result + this.operands[i].getMathML();
          }
        }

        if (this.symbol.mathml instanceof Array) {
          result = result + this.symbol.mathml[2];
        }

        result = result + "</mrow>";
        return result;

      }

    });

});
