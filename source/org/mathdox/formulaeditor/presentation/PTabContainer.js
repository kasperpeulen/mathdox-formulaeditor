$package("org.mathdox.formulaeditor.presentation");

$identify("org/mathdox/formulaeditor/presentation/PTabContainer.js");

$require("org/mathdox/formulaeditor/presentation/Node.js");
$require("org/mathdox/formulaeditor/presentation/PArray.js");

$main(function(){

  /**
   * Representation of several tabs, [including a method to switch between
   * them]
   */
  org.mathdox.formulaeditor.presentation.PTabContainer =
    $extend(org.mathdox.formulaeditor.presentation.Node, {
    /*
     * index of the current tab
     */
    currenttab: null,

    tabBarSize : 20,

    /**
     * Draws the current tab to the canvas.
     *
     * See also: org.mathdox.formulaeditor.presentation.Node.draw
     */
    draw : function(canvas, x, y, invisible) {

      if (this.current === null) {
        this.dimensions = { top:y, left:x, width:0, height:0 };
        return this.dimensions;
      }

      if ((this.children[this.current] === undefined) || (this.children[this.current] === null)) {
        this.dimensions = { top:y, left:x, width:0, height:0 };
        return this.dimensions;
      }

      /* calculate maximum dimensions */
      var dimArray = [];
      var maxDim;
      var boxDim;
      var tabBoxDim;
      var i;

      if (this.showTabBar()) {
        for (i=0; i< this.children.length; i++) {
          dimArray.push(this.children[i].draw(canvas,x,y+this.tabBarSize,true));
        }
        maxDim = this.maxDimensions(x,y+this.tabBarSize,dimArray);

        boxDim = { 
          top: maxDim.top - this.tabBarSize, 
          left: maxDim.left, 
          width: maxDim.width, 
          height: this.tabBarSize
        };


        for (i=0; i< this.children.length; i++) {
          tabBoxDim = {
            top: boxDim.top,
            left: boxDim.left + (i/this.children.length)*boxDim.width,
            width: boxDim.width/this.children.length,
            height: boxDim.height,
          }
          if (i == this.current) {
            canvas.drawBox(tabBoxDim, "#00F", "#AAF");
          } else {
            canvas.drawBox(tabBoxDim, "#00F", "#DDF");
          }
        }
        
	canvas.drawBox(boxDim, "#00F");
  
        this.children[this.current].draw(canvas, x, y + this.tabBarSize, 
          invisible
        );
    
        this.dimensions = {
          top: maxDim.top - this.tabBarSize,
          left: maxDim.left, 
          width: maxDim.width, 
          height: maxDim.height+this.tabBarSize
        };
      } else { /* only 1 child, don't draw a bar */
        this.dimensions = this.children[0].draw(canvas, x, y, invisible);
      }

      return this.dimensions;
    },

    handleMouseClick : function (x,y,redraw) {
      var palcoords ;
      var index;

      if (this.showTabBar()) {
        if (y < this.dimensions.top + this.tabBarSize) {
          /* inside tabbar, insert nothing */
          index = Math.floor((x - this.dimensions.left) / 
            (this.dimensions.width) * this.children.length
          );
          
          this.current = index;

          redraw();

          return null;
        }
      }

      palcoords = this.children[this.current].getCoordinatesFromPosition(x,y);

      return {
        tab: this.current,
        row: palcoords.row,
        col: palcoords.col
      };
    },

    initialize : function() {
      if (arguments.length >0) {
        this.children = Array.prototype.slice.call(arguments);
        this.current = 0;
      }
      this.updateChildren();
    },

    showTabBar : function() {
      return (this.children.length>1);
    }
  });
});
