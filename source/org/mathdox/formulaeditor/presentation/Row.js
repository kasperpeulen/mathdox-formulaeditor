$package("org.mathdox.formulaeditor.presentation");

$require("org/mathdox/formulaeditor/presentation/Node.js");

$main(function(){

  /**
   * Representation of a row of mathematical expressions in the presentation tree.
   */
  org.mathdox.formulaeditor.presentation.Row =
    $extend(org.mathdox.formulaeditor.presentation.Node, {

      initialize : function() {

        with(org.mathdox.formulaeditor.presentation) {

          arguments.callee.parent.initialize.apply(this, arguments);
          var flattened = this.children.slice();
          for (var i=0; i<flattened.length; i++) {
            if (flattened[i] instanceof Row) {
              var row = flattened[i];
              flattened.splice.apply(flattened,[i,1].concat(row.children));
            }
          }
          arguments.callee.parent.initialize.apply(this, flattened);

        }

      },

      /**
       * Draws the row to the canvas.
       *
       * See also: org.mathdox.formulaeditor.presentation.Node.draw
       */
      draw : function(canvas, x, y, invisible) {

        if (this.children.length > 0) {

          // use the following variables to maintain track of the bounding rectangle
          var left   = x
          var top    = y
          var right  = x
          var bottom = y

          // go through all child nodes in the row
          for (var i=0; i<this.children.length; i++) {

            var child = this.children[i]

            // draw the current child node
            var dimensions = child.draw(canvas, right, y, invisible)

            // update the dimensions of the bounding rectangle
            left   = Math.min(left, dimensions.left)
            top    = Math.min(top, dimensions.top)
            right  = Math.max(right, dimensions.left + dimensions.width)
            bottom = Math.max(bottom, dimensions.top + dimensions.height)

          }

          // return information about the bounding rectangle
          return {
            left:   left,
            top:    top,
            width:  right - left,
            height: bottom - top
          }

        }
        else {

          with(org.mathdox.formulaeditor.presentation) {
            return new Symbol("f").draw(canvas,x,y,true);
          }

        }

      },

      getFollowingCursorPosition : function(index) {
        if (index == null) {
          return { row : this, index : 0 };
        }
        else {
          if (index < this.children.length) {
            return this.children[index].getFollowingCursorPosition();
          }
          else {
            if (this.parent != null) {
              return this.parent.getFollowingCursorPosition(this.index + 1);
            }
            else {
              return null;
            }
          }
        }
      },

      getPrecedingCursorPosition : function(index) {
        if (index == null) {
          return { row : this, index : this.children.length };
        }
        else {
          if (index > 0) {
            return this.children[index - 1].getPrecedingCursorPosition();
          }
          else {
            if (this.parent != null) {
              return this.parent.getPrecedingCursorPosition(this.index);
            }
            else {
              return null;
            }
          }
        }
      },

      getLowerCursorPosition : function(index, x) {
        if (index == null) {
          var minimumDistance = null;
          var bestIndex = 0;
          for (var i=0; i<=this.children.length; i++) {
            var left;
            if (i<this.children.length) {
              left = this.children[i].dimensions.left;
            }
            else {
              if (this.children.length > 0) {
                var dimensions = this.children[this.children.length-1].dimensions;
                left = dimensions.left + dimensions.width;
              }
              else {
                left = this.dimensions.left;
              }
            }
            var distance = Math.abs(left-x);
            if (minimumDistance == null || distance < minimumDistance) {
              minimumDistance = distance;
              bestIndex = i;
            }
          }
          if (this.children[bestIndex] != null) {
            return this.children[bestIndex].getLowerCursorPosition(null, x);
          }
          else {
            return { row: this, index : bestIndex };
          }
        }
        else {
          return arguments.callee.parent.getLowerCursorPosition.call(this, index, x);
        }
      },

      getHigherCursorPosition : function(index, x) {
        if (index == null) {
          var minimumDistance = null;
          var bestIndex = 0;
          for (var i=0; i<=this.children.length; i++) {
            var left;
            if (i<this.children.length) {
              left = this.children[i].dimensions.left;
            }
            else {
              if (this.children.length > 0) {
                var dimensions = this.children[this.children.length-1].dimensions;
                left = dimensions.left + dimensions.width;
              }
              else {
                left = this.dimensions.left;
              }
            }
            var distance = Math.abs(left-x);
            if (minimumDistance == null || distance < minimumDistance) {
              minimumDistance = distance;
              bestIndex = i;
            }
          }
          if (this.children[bestIndex] != null) {
            return this.children[bestIndex].getHigherCursorPosition(null, x);
          }
          else {
            return { row: this, index : bestIndex };
          }
        }
        else {
          return arguments.callee.parent.getHigherCursorPosition.call(this, index, x);
        }
      },


      insert : function(index, node) {
        this.children.splice(index, 0, node);
        this.updateChildren(index);
      },

      replace : function(index, node) {
        this.children.splice(index, 1, node);
        this.updateChildren(index);
      },

      remove : function(begin, end) {
        if (end == null) {
          var result = this.children[begin];
          this.children.splice(begin, 1);
          this.updateChildren(begin);
          return result;
        }
        else {
          var result = new org.mathdox.formulaeditor.presentation.Row();
          result.initialize.apply(result, this.children.splice(begin, end-begin));
          this.updateChildren(begin);
          return result;
        }
      },

      getSemantics : function(begin, end, start, backward) {

        if (begin == null) {
          begin = 0;
        }
        if (end == null) {
          end = this.children.length;
        }
        if (start == null) {
          start = "start";
        }
        if (backward == null) {
          backward = false;
        }

        with(org.mathdox.formulaeditor.presentation) {
        with(org.mathdox.formulaeditor.parsing.expression) {

          var parser = ExpressionParser;

          var string = "";

          for (var i=begin; i<end; i++) {

            var child = this.children[i];
            if (child instanceof Symbol) {
              string += child.value
            }
            else {
              // add dummy to input and semantic node to cache
              var childSemantics = child.getSemantics();

              var extension = {};
              var childIndex = string.length;

  //            alert(childIndex + "," + childSemantics.rule);

              extension[childSemantics.rule] = function(context, index, result, continuation) {
  //              alert("index: " + index + ", childIndex: " + childIndex + ", rule: " + childSemantics.rule);
                var parent = arguments.callee.parent;
                if (!context.backward) {
                  if (index == childIndex) {
                    continuation(index+1, result.concat([childSemantics.value]));
                  }
                }
                else {
                  if (index-1 == childIndex) {
                    continuation(index-1, [childSemantics.value].concat(result));
                  }
                }
                parent[childSemantics.rule](context, index, result, continuation);
              };

              parser = $extend(parser, extension);

              string += "#";
            }

          }

          var parsed = new parser().parse(string, backward ? string.length : 0, backward, start);

          return {
            value : parsed.value,
            index : parsed.index + begin,
            rule  : "braces"
          };

        }}

      }

    })

})