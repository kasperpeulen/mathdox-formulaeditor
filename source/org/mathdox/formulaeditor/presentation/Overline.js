$package("org.mathdox.formulaeditor.presentation");

$identify("org/mathdox/formulaeditor/presentation/Overline.js");

$require("org/mathdox/formulaeditor/presentation/Bracket.js");
$require("org/mathdox/formulaeditor/presentation/Bracketed.js");
$require("org/mathdox/formulaeditor/presentation/PArray.js");

$main(function(){

  /**
   * Representation of a column of mathematical expressions in the presentation
   * tree.
   */
  org.mathdox.formulaeditor.presentation.Overline =
    $extend(org.mathdox.formulaeditor.presentation.Bracketed, {
      // cannot be split like a simple bracket
      separable : false,

      // width of the line
      lineWidth : 1.0,

      // margin between the line and the row
      margin : 2.0,

      initialize : function () {
        var presentation = org.mathdox.formulaeditor.presentation;

        this.middle = new presentation.Row();
        this.middle.initialize.apply(this.middle, arguments);
        this.middle.margin = 10.0;

        arguments.callee.parent.initialize.call(this, leftBracket, 
          this.middle, rightBracket);
      },

      /**
       * Returns a copy of this presentation object, without index information
       * To be used for copy/paste or undo. See also presentation/Node.js
       */
      copy : function() {
        return this.clone.apply(this, this.copyArray(this.middle.children));
      },

      draw : function(canvas, context, x, y, invisible) {
        var middleHeight;
        this.middle.draw(canvas, context, 0, 0, true);
        
        middleheight = this.middle.dimensions.height + this.lineWidth + this.margin*2;

        var yAdjustMiddle = - (this.middle.dimensions.top+this.middle.dimensions.height) - this.margin;

        this.dimensions = { 
          height : middleheight,
          width : 
            this.middle.dimensions.width + this.margin,
          left : x,
          top : y - yAdjustMiddle
        };
     
        this.drawHighlight(canvas, invisible);

        this.middle.draw(canvas, context,
          x - this.middle.dimensions.left + this.margin , 
          y, invisible);

        if (!invisible) {
          // draw line
          var canvasContext = canvas.getContext();

          canvasContext.save();
          canvasContext.lineWidth = this.lineWidth;
          canvasContext.beginPath();
          canvasContext.moveTo(x - 1, this.dimensions.top + this.lineWidth);
          canvasContext.lineTo(x + this.dimensions.width, this.dimensions.top + this.lineWidth);
          canvasContext.stroke();
          canvasContext.closePath();
          canvasContext.restore();
        }

        if ((!invisible) &&this.drawBox) {
          canvas.drawBox(this.middle.dimensions);
          canvas.drawBoxWithBaseline(this.dimensions,y);
        }

        return this.dimensions;

      },

      getSemantics : function(context) {
        return {
          value : this.middle.getSemantics(context).value,
          rule  : "overline"
        };
      }
    });

});
