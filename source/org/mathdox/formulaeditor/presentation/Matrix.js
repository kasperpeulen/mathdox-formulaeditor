$package("org.mathdox.formulaeditor.presentation");

$require("org/mathdox/formulaeditor/presentation/Bracket.js");
$require("org/mathdox/formulaeditor/presentation/Node.js");
$require("org/mathdox/formulaeditor/presentation/PArray.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");
$require("org/mathdox/formulaeditor/modules/linalg/matrixrow.js");

$main(function(){

  /**
   * Representation of a column of mathematical expressions in the presentation
   * tree.
   */
  org.mathdox.formulaeditor.presentation.Matrix =
    $extend(org.mathdox.formulaeditor.presentation.Node, {
      // array
      pArray : null,
      // left bracket
      leftBracket : null,
      // right bracket
      rightBracket : null,

      /**
       * Draws the matrix to the canvas.
       *
       * See also: org.mathdox.formulaeditor.presentation.Node.draw
       */
      draw : function(canvas, x, y, invisible) {

        var height;

        // invisible drawing of array to set dimensions
        
        this.pArray.draw(canvas, 0, 0, true)

        this.leftBracket.minimumHeight = 
          this.pArray.dimensions.height
        this.rightBracket.minimumHeight = 
          this.pArray.dimensions.height

        // invisible drawing of brackets to set dimensions
        this.leftBracket.draw(canvas, 0, 0, true)
        this.rightBracket.draw(canvas, 0, 0, true)

        height = Math.max(
            this.leftBracket.dimensions.height,
            this.pArray.dimensions.height,
            this.rightBracket.dimensions.height
          )

        var yAdjust = 0;
        var yAdjustBrackets = 0;
        
        if (height>this.pArray.dimensions.height) {
          yAdjust = (height - this.pArray.dimensions.height)/2;
        }

        if (height<this.pArray.dimensions.height) {
          yAdjustBrackets = (this.pArray.dimensions.height - height)/2;
        }

        this.dimensions = { 
          height : height,
          width : 
            this.leftBracket.dimensions.width +
            this.pArray.dimensions.width +
            this.rightBracket.dimensions.width,
          left : x,
          top : y + this.pArray.dimensions.top - yAdjust
        }
        
        this.leftBracket.minimumHeight = this.pArray.dimensions.height;
        this.leftBracket.draw(canvas, 
          x - this.leftBracket.dimensions.left, 
          this.dimensions.top + this.dimensions.height + yAdjustBrackets, 
          invisible);

        this.pArray.draw(canvas, 
          x + this.leftBracket.dimensions.width - this.pArray.dimensions.left, 
          y, invisible);
        this.rightBracket.minimumHeight = this.pArray.dimensions.height;
        this.rightBracket.draw(canvas, 
          x + this.rightBracket.dimensions.width + 
            this.pArray.dimensions.width - this.rightBracket.dimensions.left, 
          this.dimensions.top + this.dimensions.height + yAdjustBrackets, 
          invisible);
        
        return this.dimensions;
      },
      functionsFromRow : [ "getFirstCursorPosition",
        "getLastCursorPosition", "getLowerCursorPosition",
        "getHigherCursorPosition" ],
      getCursorPosition: function(x,y) {
        var dimensions;

        dimensions = this.leftBracket.dimensions;
        if (x < dimensions.left + dimensions.width) {
	  if (this.parent != null) {
	    return result = { row: this.parent, index: this.index };
	  } else {
	    return null;
	  }
          return this.getFollowingCursorPosition();
        }
        dimensions = this.pArray.dimensions;
        if (x < dimensions.left + dimensions.width) {
          return this.pArray.getCursorPosition(x,y);
        }
	if (this.parent != null) {
          return result = { row: this.parent, index: this.index+1 };
	} else {
          return this.getPrecedingCursorPosition();
	}
      },
      getFollowingCursorPosition : function(index, descend) {

        // default value for descend
        if (descend == null) {
          descend = true;
        }

        // when index is not specified, return the first position in the array
	if (index == null) {
	  return this.pArray.getFollowingCursorPosition();
	}
	
	var result = null;

	if (index == 0) {
	  if (descend) {
	    result = this.pArray.getFollowingCursorPosition();
	  }
	}

	if (result == null) {
	  // when we're at the end of the matrix, ask the parent of the matrix
	  // for the position following this matrix
	  if (this.parent != null) {
	    return this.parent.getFollowingCursorPosition(this.index, false);
	  }
	}
        
        return result;
      },
      getPrecedingCursorPosition : function(index, descend) {

        // default value for descend
        if (descend == null) {
          descend = true;
        }

        // when index is not specified, return the first position in the array
	if (index == null) {
	  return this.pArray.getPrecedingCursorPosition();
	}
	
	var result = null;

	if (index == 1) {
	  if (descend) {
	    result = this.pArray.getPrecedingCursorPosition();
	  }
	}

	if (result == null) {
	  // when we're at the beginning of the matrix, ask the parent of the
	  // matrix for the position before this matrix
	  if (this.parent != null) {
	    return this.parent.getPrecedingCursorPosition(this.index, false);
	  }
	}
        
        return result;
      },
      initialize : function () {
        with (org.mathdox.formulaeditor.presentation) {
          if (!this.leftBracket) {
            this.leftBracket = new Bracket('(');
          }
          if (!this.rightBracket) {
            this.rightBracket = new Bracket(')');
          }
          this.pArray = new PArray();
          this.pArray.initialize.apply(this.pArray,arguments);
          this.pArray.margin = 10.0;
          this.children = [ this.pArray ];
          this.updateChildren();

          /* copy the cursor/position functions from Row */

          var row = new Row(); // only an instance has the functions

          for (var i=this.functionsFromRow.length - 1; i>=0; i--) {
            if (! this[this.functionsFromRow[i]] ) {
              this[this.functionsFromRow[i]] = 
                row[ this.functionsFromRow[i] ];
            }
          }
        }
      },

      getSemantics : function() {
        var rows = this.pArray.entries;
        var semanticRows;
        var matrix;

        with (org.mathdox.formulaeditor.semantics) {
          semanticRows = new Array();
          for (var i=0;i<rows.length;i++) {
            var semanticRowEntries;
  
            semanticRowEntries= new Array();
            for (var j=0; j<rows[i].length;j++) {
              semanticRowEntries.push(rows[i][j].getSemantics().value);
            }
            var semanticRow = new Linalg2Matrixrow();
            semanticRow.initialize.apply(semanticRow, semanticRowEntries);
            semanticRows.push(semanticRow);
          }
          matrix = new Linalg2Matrix();
          matrix.initialize.apply(matrix, semanticRows);
        }
        return {
          value : matrix,
          rule  : "braces"
        }
      }

    })

})
