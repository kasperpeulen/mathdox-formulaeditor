$package("org.mathdox.formulaeditor.presentation");

$require("org/mathdox/formulaeditor/presentation/Bracket.js");
$require("org/mathdox/formulaeditor/presentation/Node.js");
$require("org/mathdox/formulaeditor/presentation/PArray.js");

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

	var yAdjust = (height - this.pArray.dimensions.height)/2

        this.dimensions = { 
          height : height,
          width : 
            this.leftBracket.dimensions.width +
            this.pArray.dimensions.width +
            this.rightBracket.dimensions.width,
          left : x,
          top : y - height + yAdjust
        }
        
	this.leftBracket.minimumHeight = this.pArray.dimensions.height;
        this.leftBracket.draw(canvas, 
          x - this.leftBracket.dimensions.left, 
          y - this.leftBracket.dimensions.top - this.dimensions.height + 
	    yAdjust +
            (this.dimensions.height - this.leftBracket.dimensions.height)/2, 
	  invisible);

        this.pArray.draw(canvas, 
          x + this.leftBracket.dimensions.width - this.pArray.dimensions.left, 
          y - this.pArray.dimensions.top - this.dimensions.height +
	    yAdjust +
            (this.dimensions.height - this.pArray.dimensions.height)/2, 
          invisible);
	this.rightBracket.minimumHeight = this.pArray.dimensions.height;
        this.rightBracket.draw(canvas, 
          x + this.leftBracket.dimensions.width + 
            this.pArray.dimensions.width - this.rightBracket.dimensions.left, 
          y - this.rightBracket.dimensions.top - this.dimensions.height +
	    yAdjust +
            (this.dimensions.height - this.rightBracket.dimensions.height)/2, 
          invisible);
        
        return this.dimensions;
      },

      //XXX todo
      getCursorPosition : function(x, y) {
        var row,col;

        // find the row
        row = 0
        /*
         * Here rowHeight   = this.rowInfo[row].height and 
         *      entryHeight = this.entries[row][0].dimensions.height
         *
         * this.entries[row][0].dimensions.top is the top of the entry
         * subtract (rowHeight-entryHeight)/2 to get the top of the row
         * add rowHeight to get the bottom of the row
         *
         * if the coordinate is below the bottom, increase the row number
         */
        while ((row<this.rows-1) && (y>this.entries[row][0].dimensions.top - (this.rowInfo[row].height - this.entries[row][0].dimensions.height)/2 + this.rowInfo[row].height)) {
          // not in row "row"
          row++
        }

        // find the column
        col = 0
               /*
         * Here colWidth   = this.colInfo[row].width and 
         *      entryWidth = this.entries[row][col].dimensions.width
         *
         * this.entries[row][col].dimensions.left is the left of the entry
         * subtract (colWidth - entryWidth)/2 to get the left of the column
         * add colWidth to get the right of the column
         *
         * if the coordinate is past the right, increase the column number
         */
        while ((col<this.columns-1) && (x>this.entries[row][col].dimensions.left + (this.colInfo[row].width - this.entries[row][col].dimensions.width)/2 + this.colInfo[col].width)) {
          // not in column "col"
          col++
        }

        return this.entries[row][col].getCursorPosition(x,y)
      },

      /**
       * See also Node.getFollowingCursorPosition(index).
       */
      //XXX todo
      getFollowingCursorPosition : function(index) {
        
        if (index == null) {
          var row = null;
          var middle = Math.floor(this.rows / 2);
          var row    = middle;
          while(result==null && 0<=row && row < this.rows) {
            result = this.entries[row][0].getFollowingCursorPosition();
            if (row>=middle) {
              row = 2*middle - row - 1;
            }
            else {
              row = 2*middle - row;
            }
          }
          return result;
        }

        if (index<this.children.length) {
          var row = Math.floor(index / this.columns)
          var col = index % this.columns
          var result 
          if (col+1<this.columns) {
            result = this.entries[row][col+1].getFirstCursorPosition();
          } 
          if ((result == null) && (this.parent != null)) {
            result = this.parent.getFollowingCursorPosition(this.index, false)
          }
          return result;
        }

        return null;

      },

      //XXX todo
      getPrecedingCursorPosition : function(index) {

        if (index == null) {
          var row = null;
          var middle = Math.floor(this.rows / 2);
          var row    = middle;
          while(result==null && 0<=row && row < this.rows) {
            result = this.entries[row][0].getFollowingCursorPosition();
            if (row>=middle) {
              row = 2*middle - row - 1;
            }
            else {
              row = 2*middle - row;
            }
          }
          return result;
        }

        if (index>0) {
          var row = Math.floor(index / this.columns);
          var col = index % this.columns;
          var result ;
          if (col>0) {
            result = this.entries[row][col-1].getLastCursorPosition();
          } 
          if ((result == null) && (this.parent != null)) {
            result = this.parent.getPrecedingCursorPosition(this.index, false);
          }
          return result;
        }

        return null;

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
          this.pArray.initialize.apply(this.pArray,arguments)
        }
      }

    })

})
