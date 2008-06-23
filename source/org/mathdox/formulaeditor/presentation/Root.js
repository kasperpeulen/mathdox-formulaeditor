$package("org.mathdox.formulaeditor.presentation");

$identify("org/mathdox/formulaeditor/presentation/Root.js");

$require("org/mathdox/formulaeditor/presentation/Bracket.js");
$require("org/mathdox/formulaeditor/presentation/Bracketed.js");
$require("org/mathdox/formulaeditor/presentation/Node.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");

$main(function(){

  /**
   * Representation of a column of mathematical expressions in the presentation
   * tree.
   */
  org.mathdox.formulaeditor.presentation.Root =
    $extend(org.mathdox.formulaeditor.presentation.Bracketed, {
      // width of the line
      lineWidth : 1.0,

      // margin between the line and the row
      margin : 2.0,

      // should we draw boxes ?
      drawBox : false,

      /**
       * Draws the root to the canvas.
       *
       * See also: org.mathdox.formulaeditor.presentation.Node.draw
       */
      draw : function(canvas, x, y, invisible) {
        var middleheight;
        var rootheight;
        var height;

        // invisible drawing of array to set dimensions
        
        this.middle.draw(canvas, 0, 0, true);

	middleheight = this.middle.dimensions.height + this.lineWidth + 
	  this.margin*2;

	// if the left and right symbols are brackets set the height
	// XXX check if they are brackets
        this.leftBracket.minimumHeight = middleheight;

        // invisible drawing of brackets to set dimensions
        this.leftBracket.draw(canvas, 0, 0, true);

	rootheight = this.leftBracket.dimensions.height;

        height = Math.max(
            rootheight,
            middleheight
        );

        var yAdjust = 0;
        var yAdjustBrackets = 0;
        
        // bracket is higher than the array
        if (height>middleheight) {
          yAdjust = (height - middleheight)/2;
        }

        // brackets are smaller than the array
        // assuming right bracket has the same size as the left bracket
        if (rootheight<height) {
          yAdjustBrackets = (height - rootheight)/2;
        }

        this.dimensions = { 
          height : height,
          width : 
            this.leftBracket.dimensions.width +
            this.middle.dimensions.width,
          left : x,
          top : y - this.leftBracket.dimensions.height + yAdjust/2 
        }
       
        this.leftBracket.draw(canvas, 
          x - this.leftBracket.dimensions.left, 
	  y - (this.leftBracket.dimensions.top +
	    this.leftBracket.dimensions.height) + yAdjust/2 , 
          invisible);
	/* XXX adjust vertically */
        this.middle.draw(canvas, 
          x + this.leftBracket.dimensions.width - this.middle.dimensions.left, 
          y - (this.middle.dimensions.top+this.middle.dimensions.height) 
	  - this.margin,
	  invisible);

	if (!invisible) {
	  // draw line
	  var context = canvas.getContext();

	  context.save();
	  context.lineWidth = this.lineWidth;
	  context.beginPath();
	  context.moveTo(x+this.leftBracket.dimensions.width - 1,
	    this.dimensions.top + this.lineWidth);
	  context.lineTo(x+this.dimensions.width, 
	    this.dimensions.top + this.lineWidth);
	  context.stroke();
	  context.closePath();
	  context.restore();
	}

	/* XXX adjust */
        if ((!invisible) &&this.drawBox) {
          canvas.drawBox(this.middle.dimensions);
          canvas.drawBox(this.leftBracket.dimensions);
          canvas.drawBox(this.dimensions,y);
        }

        return this.dimensions;
      },

      initialize : function () {
	if (arguments.length>0) {
	  this.leftBracket = 
	    new org.mathdox.formulaeditor.presentation.Bracket("v");
	  this.middle = arguments[0];
	  this.children = new Array();
	  this.children.push(this.middle);
	} else {
	  this.children = new Array();
	}

        with (org.mathdox.formulaeditor.presentation) {
          /* copy the cursor/position functions from Row */

          var row = new Row(); // only an instance has the functions

          for (var i=this.functionsFromRow.length - 1; i>=0; i--) {
            if (! this[this.functionsFromRow[i]] ) {
              this[this.functionsFromRow[i]] = 
                row[ this.functionsFromRow[i] ];
            }
          }
	  this.updateChildren();
        }
      }

    })

})
