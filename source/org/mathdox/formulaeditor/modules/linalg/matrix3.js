$identify("org/mathdox/formulaeditor/modules/linalg/matrix3.js");

$require("org/mathdox/formulaeditor/modules/linalg/matrix.js");
$require("org/mathdox/formulaeditor/modules/linalg/matrixrow.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionContextParser.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/parsing/ParserGenerator.js");

$main(function(){

  /**
   * Define a semantic tree node that represents the linalg3.matrixcolumn
   */
  org.mathdox.formulaeditor.semantics.Linalg3Matrixcolumn =
    $extend(org.mathdox.formulaeditor.semantics.Linalg2Matrixrow, {

      symbol : {

        mathml   : ["<mfenced open='(' close =')'><mtable><mtr><mtd>","</mtd></mtr><mtr><mtd>","</mtd></mtr></mtable></mfenced>"],
        onscreen : ["[", ",", "]"],
        openmath : "<OMS cd='linalg3' name='matrixcolumn'/>"

      },
    });

  /**
   * Define a semantic tree node that represents the linalg3.vector
   */
  org.mathdox.formulaeditor.semantics.Linalg3Vector =
    $extend(org.mathdox.formulaeditor.semantics.Linalg2Vector, {

      symbol : {

        mathml   : ["<mfenced open='(' close=')'><mtable><mtr><mtd>","</mtd></mtr><mtr><mtd>","</mtd></mtr></mtable></mfenced>"],
        onscreen : ["[", ",", "]"],
        openmath : "<OMS cd='linalg3' name='vector'/>"

      },

      precedence : 0,

      transpose : true,

      getPresentation : function(context) {
        var presentation = org.mathdox.formulaeditor.presentation;
        var entries = [];
        var vector = new presentation.Vector();

        // add inVector to a copy of the context
        var modifiedContext = {};
        for (var name in context) {
          modifiedContext[name] = context[name];
        }
        modifiedContext.inVector = true;

        for (var i=0; i<this.operands.length; i++) {
          entries.push(this.operands[i].getPresentation(modifiedContext));
        }
       
        vector.initialize.apply(vector, entries);
	vector.semanticVectorName = "Linalg3Vector";

        return vector;
      }

    });
  /**
   * Extend the OpenMathParser object with parsing code for linalg3
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a Linalg2Matrix object based on the OpenMath node.
       */
      handleLinalg3Matrix : function(node) {
        var i,j;

        // parse the children of the OMA
        var children = node.childNodes;
        var operands = [];
        for (i=1; i<children.length; i++) {
          operands.push(this.handle(children.item(i)));
        }
        var transposed = [];
        for (i=1; i<children.length; i++) {
          child = this.handle(children.item(i)); 
          
          for (j=0; j<child.operands.length; j++) {
            if (i==1) {
              transposed.push([]);
            }

            transposed[j].push(child.operands[j]);
          }
        }
        var newoperands = [];
        for (i=0; i<transposed.length; i++) {
          var row = new org.mathdox.formulaeditor.semantics.Linalg2Matrixrow();
	  row.initialize.apply(row, transposed[i]);
          newoperands.push(row);
        }

        // construct a Linalg2Matrix object
        var result = new org.mathdox.formulaeditor.semantics.Linalg2Matrix();
        result.initialize.apply(result,newoperands);

        return result;
      },

      /**
       * Returns a Linalg3Matrixcolumn object based on the OpenMath node.
       */
      handleLinalg3Matrixcolumn : function(node) {

        // parse the children of the OMA
        var children = node.childNodes;
        var operands = [];
        for (var i=1; i<children.length; i++) {
          operands.push(this.handle(children.item(i)));
        }

        // construct a Linalg3Matrixcolumn object
        var result = new org.mathdox.formulaeditor.semantics.Linalg3Matrixcolumn();
        result.initialize.apply(result,operands);
        return result;

      },

      /**
       * Returns a Linalg3Vector object based on the OpenMath node.
       */
      handleLinalg3Vector : function(node) {

        // parse the children of the OMA
        var children = node.childNodes;
        var operands = [];
        for (var i=1; i<children.length; i++) {
          operands.push(this.handle(children.item(i)));
        }

        // construct a Linalg3Vector object
        var result = new org.mathdox.formulaeditor.semantics.Linalg3Vector();
        result.initialize.apply(result, operands);
        return result;

      }

    });

});
