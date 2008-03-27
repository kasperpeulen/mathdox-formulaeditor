$package("org.mathdox.formulaeditor.presentation");

$require("org/mathdox/formulaeditor/presentation/Node.js");

$main(function(){

  /**
   * Representation of a column of mathematical expressions in the presentation
   * tree.
   */
  org.mathdox.formulaeditor.presentation.PArray =
    $extend(org.mathdox.formulaeditor.presentation.Node, {
      /* 
       * number of rows 
       */
      rows : 0,
      /*
       * number of columsn
       */
      columns: 0,

      /*
       * the heights of the rows
       */
      rowInfo : [],
      /*
       * the widths of the columns
       */
      colInfo : [],

      /*
       * the margin between the entries
       */
      margin : 2.0,

      /*
       * Determine the maximum height of a row
       * usage getMaxHeight(row) : max height of a row
       */
      getMaxHeight : function(row) {
        var maxHeight = 0;
        for (var col=0; col<this.columns; col++) {
          maxHeight = Math.max(maxHeight, this.entries[row][col].dimensions.height)
        }
        return maxHeight
      },

      /*
       * Determine the width of a column
       * usage getMaxWidth(column) : max width of a column
       */
      getMaxWidth : function(col) {
        var maxWidth = 0
        for (var row=0; row<this.rows; row++) {
          maxWidth = Math.max(maxWidth, this.entries[row][col].dimensions.width)
        }
        return maxWidth
      },

      /**
       * Draws the matrix to the canvas.
       *
       * See also: org.mathdox.formulaeditor.presentation.Node.draw
       */
      draw : function(canvas, x, y, invisible) {

        // total height
        var totalHeight = 0;
        
        // fake drawing of children to set sizes
        
        for (var row = 0; row < this.rows; row++) {
          for (var col = 0; col < this.columns; col++) {
            this.entries[row][col].draw(canvas, 0, 0, true);
          }
        }
 
        for (var row = 0; row < this.rows; row++) {
          var rowHeight = this.getMaxHeight(row);
          var rowCenter;
          if (row == 0 ) {
            rowCenter = rowHeight/2+this.margin/2;
            totalHeight += rowHeight ;
          } else {
            rowCenter = this.rowInfo[row-1].center + this.rowInfo[row-1].height/2 + this.margin + rowHeight/2;
            totalHeight += rowHeight + this.margin;
          };
          this.rowInfo[row] = {
            height : rowHeight,
            center : rowCenter
          };
        }

        // adjust rows for total height
        for (var row = 0; row < this.rows; row++) {
          this.rowInfo[row].center -= totalHeight/2;
        }

        // the widths of the columns
        var columnwidth = [];
        // total width
        var totalWidth = 0;

        for (var col = 0; col < this.columns; col++) {
          var colWidth = this.getMaxWidth(col);
          if (col ==0 ) {
            colCenter = colWidth/2;
            totalWidth += colWidth;
          } else {
            colCenter = this.colInfo[col-1].center +this.colInfo[col-1].width/2+ this.margin + colWidth/2;
            totalWidth += colWidth + this.margin;
          };
          this.colInfo[col] = {
            width  : colWidth,
            center : colCenter
          };
        }

        // adjust columns for total width
        for (var col = 0; col < this.columns; col++) {
          //this.colInfo[col].center += width/2
        }

        // draw all entries
        if (! invisible) {
          for (var row=0; row<this.rows; row++) {
            for (var col=0; col<this.columns; col++) {
              var entry       = this.entries[row][col]
              var entryWidth  = entry.dimensions.width
              var entryHeight = entry.dimensions.height
              var entryTop    = entry.dimensions.top
              entry.draw(
                canvas,
                x + this.colInfo[col].center - (entryWidth/2), 
                      // horizontally centered in column
                y + this.rowInfo[row].center,
                      // vertically centered in row
                invisible
              )
            }
          }
        }
        return this.dimensions = {
          top    : this.rowInfo[0].center-this.rowInfo[0].height,
          left   : x,
          width  : totalWidth,
          height : totalHeight
        }
      },

      getCursorPosition : function(x, y) {
        var row,col

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
      getFollowingCursorPosition : function(index) {
        var result = null;
	var row, col;

        if (index == null) {
          middle = Math.floor(this.rows / 2);
          row    = middle;
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

        row = Math.floor(index / this.columns);
        col = index % this.columns;
        if (col+1<this.columns) {
          result = this.entries[row][col+1].getFirstCursorPosition();
        }

        if ((result == null) && (this.parent != null)) {
          result = this.parent.getFollowingCursorPosition(this.index, false);
        }
        return result;

      },

      getPrecedingCursorPosition : function(index) {
        var result=null;

        if (index == null) {
          var row = null;
          var middle = Math.floor(this.rows / 2);
          var row    = middle;
          while(result==null && 0<=row && row < this.rows) {
            col = this.entries[row].length - 1;
            result = this.entries[row][col].getPrecedingCursorPosition();
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
          if (col>0) {
            result = this.entries[row][col-1].getLastCursorPosition();
          } 
        }

        if ((result == null) && (this.parent != null)) {
          result = this.parent.getPrecedingCursorPosition(this.index, false)
        }
        return result
      },

      getLowerCursorPosition : function(index, x) {
        
        if (index == null) {
          return this.entries[0][0].getLowerCursorPosition(null, x)
        }

        if (index<this.children.length) {
          var row = Math.floor(index / this.columns)
          var col = index % this.columns
          var result 
          if (row+1<this.rows) {
            result = this.entries[row+1][col].getLowerCursorPosition(null, x);
          } 
          if ((result == null) && (this.parent != null)) {
            result = this.parent.getFollowingCursorPosition(index, x)
          }
          return result
        }

        return null
      },

      getHigherCursorPosition : function(index, x) {
        
        if (index == null) {
          return this.entries[0][0].getLowerCursorPosition(null, x)
        }

        if (index<this.children.length) {
          var row = Math.floor(index / this.columns)
          var col = index % this.columns
          var result 
          if (row>0) {
            result = this.entries[row-1][col].getLowerCursorPosition(null, x);
          } 
          if ((result == null) && (this.parent != null)) {
            result = this.parent.getFollowingCursorPosition(index, x)
          }
          return result
        }

        return null
      },
      initialize : function () {
        if (arguments.length >0) {
          this.entries = Array.prototype.slice.call(arguments)
          this.rows = this.entries.length
          this.columns = this.entries[0].length
        }
        this.children = new Array()

        for (var row = 0; row < this.rows; row++) {
          for (var col = 0; col < this.columns; col++) {
            this.children.push(this.entries[row][col])
          }
        }
        this.updateChildren()
      }

    })

})
