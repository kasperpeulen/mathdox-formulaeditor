$package("org.mathdox.formulaeditor.presentation");

$require("org/mathdox/formulaeditor/presentation/Node.js");

$main(function(){

  /**
   * Representation of a row of mathematical expressions in the presentation
   * tree.
   */
  org.mathdox.formulaeditor.presentation.Row =
    $extend(org.mathdox.formulaeditor.presentation.Node, {

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
          this.dimensions = {
            left:   left,
            top:    top,
            width:  right - left,
            height: bottom - top
          };

          return this.dimensions;

        }
        else {

          with(org.mathdox.formulaeditor.presentation) {
            this.dimensions = new Symbol("f").draw(canvas,x,y,true);
            return this.dimensions;
          }

        }

      },

      /**
       * Handles an onkeydown event from the browser. Returns false when the
       * event has been handled and should not be handled by the browser,
       * returns true otherwise.
       */
      onkeydown : function(event, editor) {

        // only handle keypresses where alt, ctrl and shift are not held
        if (!event.altKey && !event.ctrlKey && !event.shiftKey) {

          // handle backspace and delete
          switch(event.keyCode) {

            case  8: // backspace
              var position = editor.cursor.position;
              if (position.index > 0) {
                this.remove(position.index - 1);
                position.index--;
                editor.redraw();
                editor.save();
              }
              return false;

            case 46: // delete 
              this.remove(editor.cursor.position.index);
              editor.redraw();
              editor.save();
              return false;

          }

        }

        // pass the event back to the browser
        return true;

      },

      /**
       * Handles an onkeypress event from the browser. Returns false when the
       * event has been handled and should not be handled by the browser,
       * returns true otherwise.
       */
      onkeypress : function(event, editor) {

        // only handle keypresses where alt and ctrl are not held
        if (!event.altKey && !event.ctrlKey) {

          var canvas    = editor.canvas;
          var fontName  = canvas.fontName;
          var fontSize  = canvas.fontSize;
          var character = String.fromCharCode(event.charCode);

          // see whether there is a character for pressed key in current font
          if (canvas.fonts[fontName][fontSize].symbols[character]) {

            var Symbol   = org.mathdox.formulaeditor.presentation.Symbol;

            // insert the character into the row, and move the cursor
            this.insert(editor.cursor.position.index, new Symbol(character));
            editor.cursor.moveRight();

            editor.redraw();
            editor.save();
            return false;

          }

        }

        // pass the event back to the browser
        return true;

      },

      /**
       * Flattens this row, meaning that all child nodes that are rows
       * themselves will be embedded into this row.
       */
      flatten : function() {

        var Row = org.mathdox.formulaeditor.presentation.Row;

        // call flatten on the child nodes
        arguments.callee.parent.flatten.apply(this);

        // go through all children
        var children = this.children;
        for (var i=0; i<children.length; i++) {
          var child = children[i];

          // check whether the child is a row
          if (child instanceof Row) {

            // insert the child node's children into the list of children
            children.splice.apply(children, [i,1].concat(child.children));

          }

        }
        this.updateChildren();

      },

      getCursorPosition : function(x, y) {

        var count = this.children.length;
        for (var i=0; i<count; i++) {
          var dimensions = this.children[i].dimensions;
          if (x < dimensions.left + dimensions.width || i == count - 1) {
            return this.children[i].getCursorPosition(x,y);
          }
        }

        return { row: this, index: 0 };

      },

      getFirstCursorPosition : function(index) {
        if (index == null || index > 0) {
          return this.getFollowingCursorPosition();
        }
        else {
          if (this.parent != null) {
            return this.parent.getFirstCursorPosition();
          }
          else {
            return null;
          }
        }
      },

      getLastCursorPosition : function(index) {
        if (index == null | index < this.children.length) {
          return this.getPrecedingCursorPosition();
        }
        if (this.parent != null) {
          return this.parent.getLastCursorPosition();
        }
        else {
          return null;
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

        // assign default values to parameters
        if (begin    == null) { begin    = 0;                    }
        if (end      == null) { end      = this.children.length; }
        if (start    == null) { start    = "start";              }
        if (backward == null) { backward = false;                }

        // use the expressionparser to parse the elements of the row
        var Parser;
        Parser = org.mathdox.formulaeditor.parsing.expression.ExpressionParser;

        // create the input for the parser by serializing the row elements
        var input = "";

        // go through the row elements
        var children = this.children;
        for (var i=begin; i<end; i++) {

          // start a new variable scope
          (function(){

            // act differently based on the type of the row element
            var child = children[i];
            if (child instanceof org.mathdox.formulaeditor.presentation.Symbol) {

              // if the row element is a symbol, add its value to input string
              input = input + child.value;

            }
            else {

              // record the index of this row element in the parser input string
              var inputindex = input.length;

              // add a dummy to the input string
              input = input + '#';

              // retrieve the semantic tree node that represents the row element
              var semantics = child.getSemantics();

              // extend the parser so that it will parse the dummy into the
              // correct semantic tree node
              var extension = {};
              extension[semantics.rule] =
                function(context, index, result, continuation) {

                  var parent = arguments.callee.parent;

                  if (!context.backward && index == inputindex) {
                    continuation(index+1, result.concat([semantics.value]));
                  }
                  else if(context.backward && index - 1 == inputindex) {
                    continuation(index-1, [semantics.value].concat(result));
                  }
                  else {
                    parent[semantics.rule](context, index, result, continuation);
                  }

                }

              Parser = $extend(Parser, extension);

            }

          })();


        }

        // use the constructed parser and input to parse the row
        var parsebegin = backward ? input.length : 0           ;
        var parseend   = backward ? 0            : input.length;
        var parsed = new Parser().parse(input, parsebegin, backward, start);

        // return the result of parsing
        return {
          value : parsed.index == parseend ? parsed.value : null,
          index : parsed.index + begin,
          rule  : "braces"
        };

      }

    })

})