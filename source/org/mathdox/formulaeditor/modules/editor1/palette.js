$identify("org/mathdox/formulaeditor/modules/editor1/palette.js");

$package("org.mathdox.formulaeditor.semantics");

$require("org/mathdox/formulaeditor/presentation/PArray.js");

$main(function(){
  /**
   * Define a semantic tree node that represents the editor1.palette
   */
  org.mathdox.formulaeditor.semantics.Editor1Palette =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {
  
    symbol : {
      mathml   : ["<mtable>","","</mtable>"],
      onscreen : ["[", ",", "]"],
      openmath : "<OMS cd='editor1' name='palette'/>"
    },
    
    precedence : 0,

    getPresentation : function(context) {
      var modifiedContext = {};
      for (var name in context) {
        modifiedContext[name] = context[name];
      }
      modifiedContext.inPalette = true;

      var rows = [];
      var row; // counter
      var col; // counter
      for (row=0;row<this.operands.length;row++) {
        var cols = [];
        for (col=0;col<this.operands[row].operands.length;col++) {
	  // semantic version of the entry
          var semanticEntry = this.operands[row].operands[col];
          
	  // presentation for the palette
	  var entry = semanticEntry.getPresentation(modifiedContext);
	  entry.semanticEntry = semanticEntry;
	  // add presentation to insert
	  entry.insertablePresentation = function() { 
	    return this.semanticEntry.getPresentation(context);
	  };
	  // add function to insert, XXX possibly add library function to
	  // presentation node ?
          entry.insertCopy = function(position) {

            if (this.insertablePresentation === null || 
	        this.insertablePresentation === undefined ) {
              return; // nothing to insert
            }

	    var toInsert = this.insertablePresentation();

            for (var i=0;i<toInsert.children.length;i++) {
	      //alert("inserting: "+i+" : "+toInsert.children[i]);

              var moveright = position.row.insert(position.index, 
		toInsert.children[i], (i === 0));
              if (moveright) {
                position.index++;
	      }
            }
          };

          cols.push(entry);
        }
        rows.push(cols);  
      }
      var numcols = rows[0].length;
      for (row=1;row<rows.length;row++) {
        if (rows[row].length!=numcols) {
          alert("ERROR: palette has rows of different length: first row has length "+numcols+" while row "+(1+row)+" has length "+rows[row].length+".");
          throw("ERROR: palette has rows of different length: first row has length "+numcols+" while row "+(1+row)+" has length "+rows[row].length+".");
        }
      }
      
      var pArray = new org.mathdox.formulaeditor.presentation.PArray();
      pArray.margin = 10.0;
      pArray.initialize.apply(pArray,rows);

      return pArray;
    }
  });

  org.mathdox.formulaeditor.semantics.Editor1Palette_row =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {
    
    symbol : {
      mathml   : ["<mtr><mtd>","</mtd><mtd>","</mtd></mtr>"],
      onscreen : ["[", ",", "]"],
      openmath : "<OMS cd='editor1' name='palette_row'/>"
    },
    
    precedence : 0

  });

  // XXX todo parse parsing palette/palette_row in OM
  /**
   * Extend the OpenMathParser object with parsing code for editor1.palette
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

    /**
     * Returns a Editor1Palette object based on the OpenMath node.
     */
    handleEditor1Palette : function(node) {

      // parse the operands of the OMA
      var children = node.getChildNodes();
      var operands = [];
      for (var i=1; i<children.length; i++) {
        child = this.handle(children.item(i));
        if (child !== null) {
          // not a comment
          operands.push(child);
        }
      }

      // construct a Editor1Palette object
      var result = new org.mathdox.formulaeditor.semantics.Editor1Palette();
      result.initialize.apply(result,operands);

      return result;
    },

    /**
     * Returns a Editor1Palette_row object based on the OpenMath node.
     */
    handleEditor1Palette_row : function(node) {

      // parse the children of the OMA
      var children = node.getChildNodes();
      var operands = [];
      for (var i=1; i<children.length; i++) {
        operands.push(this.handle(children.item(i)));
      }

      // construct a Editor1Palette_row object
      var result = new org.mathdox.formulaeditor.semantics.Editor1Palette_row();
      result.initialize.apply(result,operands);
      return result;

    }

  });
});
