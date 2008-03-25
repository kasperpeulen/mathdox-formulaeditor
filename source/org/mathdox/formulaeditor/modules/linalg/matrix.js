$require("org/mathdox/formulaeditor/presentation/Node.js")
$require("org/mathdox/formulaeditor/presentation/Row.js")
$require("org/mathdox/formulaeditor/presentation/Bracket.js")
$require("org/mathdox/formulaeditor/presentation/Matrix.js")
$require("org/mathdox/formulaeditor/modules/linalg/matrixrow.js")
//$require("org/mathdox/formulaeditor/presentation/Matrix.js")

$main(function(){

  /**
   * Define a presentation tree node that represents the linalg2.matrix
   */

  org.mathdox.formulaeditor.presentation.Vector = 
    $extend(org.mathdox.formulaeditor.presentation.Node, {
      /* 
       * use method from the row 
       */
      draw : function(canvas, x, y, invisible) {
        return this.row.draw(canvas, x, y, invisible)
      },
      /* 
       * use method from the row 
       */
      getCursorPosition : function(x,y) {
        return this.row.getCursorPosition(x,y)
      },
      /* 
       * use method from the row 
       */
      getFirstCursorPosition : function(x,y) {
        return this.row.getFirstCursorPosition(x,y)
      },
      /* 
       * use method from the row 
       */
      getFollowingCursorPosition : function(x,y) {
        return this.row.getFollowingCursorPosition(x,y)
      },
      /* 
       * use method from the row 
       */
      getHigherCursorPosition : function(x,y) {
        return this.row.getHigherCursorPosition(x,y)
      },
      /* 
       * use method from the row 
       */
      getLastCursorPosition : function(x,y) {
        return this.row.getLastCursorPosition(x,y)
      },
      /* 
       * use method from the row 
       */
      getLowerCursorPosition : function(x,y) {
        return this.row.getLowerCursorPosition(x,y)
      },
      /* 
       * use method from the row 
       */
      getPrecedingCursorPosition : function(x,y) {
        return this.row.getPrecedingCursorPosition(x,y)
      },
      getOpenmath : function() {
        var openmathString = "<OMA><OMS cd='linalg2' name='vector'/>"
        for (var i = 0; i < this.entries.length; i++) {
          openmathString += this.entries[i].getOpenMath()
        }
        openmathString += "</OMA>"
      },
      getSemantics : function() {
        with(org.mathdox.formulaeditor.semantics) {
          var entries = new Array();

          for (var i=0; i<this.entries.length; i++) {
            entries.push(this.entries.getSemantics().value)
          }
        
          return {
            value : new Linalg2Vector(entries),
            rule  : "braces"
          }
        }
      },
      initialize : function() {
        var children = new Array()
        this.entries = Array.prototype.slice.call(arguments) // TODO: check
        if (this.entries.length == 0) {
          this.entries[0] = new Symbol("1")
        }

        children.push(new Symbol('['))
        for (var i=0; i<this.entries.length; i++) {
          if (i>0) {
            children.push(new Symbol(','))
          }
          children.push(this.enties[i])
        }
        children.push(new Symbol(']'))

        /*this.row = new Row()
        this.row.initialize.apply(children)
        this.row.parent = this
        this.row.index = 0*/
        this.row = new Symbol("1")
      },
      /* insert method not callable  */
      entries : [],
      /* 
       * use method from the row 
       */
      onkeydown : function(event, editor) {
        this.row.onkeydown(event, editor)
      },
      /* 
       * use method from the row 
       */
      onkeypress : function(event, editor) {
        this.row.onkeypress(event, editor)
      },
      /* remove method not callable  */
      /* replace method not callable  */
      row : null
  })

  /**
   * Define a semantic tree node that represents the linalg2.matrix
   */
  org.mathdox.formulaeditor.semantics.Linalg2Matrix =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        mathml   : ["<mtable>","","</mtable>"],
        onscreen : ["[", ",", "]"],
        openmath : "<OMS cd='linalg2' name='matrix'/>"

      },

      precedence : 0,

      getPresentation : function() {
        with(org.mathdox.formulaeditor.presentation) {
        
          var rows = [];

          //org.mathdox.operands3 = this.operands[0]//XXX
          for ( var row =0 ; row<this.operands.length ; row++) {
            var currentRow = new Array();
            for (var col = 0 ; col<this.operands[row].operands.length; col++) {
              var entry = this.operands[row].operands[col].getPresentation();
              currentRow.push(entry);
            }
            rows[row] = currentRow;
          }

          //org.mathdox.rows = rows//XXX
          var result = new Matrix();
          //org.mathdox.presentationMatrix=result//XXX
          result.initialize.apply(result,rows);
          //org.mathdox.presentationMatrix2=result//XXX
         
          return result
        }
      } 

    })

  /**
   * Define a semantic tree node that represents the linalg2.vector
   */
  org.mathdox.formulaeditor.semantics.Linalg2Vector =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        mathml   : ["<mo>[</mo>",",","<mo>]</mo>"],
        onscreen : ["[", ",", "]"],
        openmath : "<OMS cd='linalg2' name='vector'/>"

      },

      precedence : 0,

      getPresentation : function() {
        with(org.mathdox.formulaeditor.presentation) {
          var array = new Array()
          var result = new Column()
          //array.push(new Symbol("[","("))
          for (var i=0; i<this.operands.length; i++) {
            if (i>0) {
              //array.push(new Symbol(","," "))
            }
            array.push(this.operands[i].getPresentation())
          }
          //array.push(new Symbol("]",")"))
          result.initialize.apply(result,array)

          return new Row(new Symbol("("),result, new Symbol(")"))
        }
      }

    })

  /**
   * Extend the OpenMathParser object with parsing code for linalg2.matrixrow
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a Linalg2Matrixrow object based on the OpenMath node.
       */
      handleLinalg2Matrix : function(node) {

        // parse the children of the OMA
        var children = node.getChildNodes();
        var operands = new Array()
        for (var i=1; i<children.length; i++) {
          operands[i-1] = this.handle(children.item(i))
        }

        // construct a Linalg2Matrix object
        var result = new org.mathdox.formulaeditor.semantics.Linalg2Matrix()
        result.initialize.apply(result,operands)
        //org.mathdox.matrixOperands = operands //XXX
        //org.mathdox.semanticMatrix = result //XXX
        return result

      },

      /**
       * Returns a Linalg2Matrixrow object based on the OpenMath node.
       */
      handleLinalg2Matrixrow : function(node) {

        // parse the children of the OMA
        var children = node.getChildNodes();
        var operands = new Array(children.getLength()-1);
        for (var i=1; i<children.length; i++) {
          operands[i-1] = this.handle(children.item(i))
        }

        // construct a Linalg2Matrixrow object
        var result = new org.mathdox.formulaeditor.semantics.Linalg2Matrixrow()
        result.initialize.apply(result,operands)
        //org.mathdox.rowResult = result.operands//XXX
        return result

      },

      /**
       * Returns a Linalg2Vector object based on the OpenMath node.
       */
      handleLinalg2Vector : function(node) {

        // parse the children of the OMA
        var children = node.getChildNodes();
        var operands = new Array(children.getLength()-1);
        for (var i=1; i<children.length; i++) {
          operands[i-1] = this.handle(children.item(i))
        }

        // construct a Linalg2Vector object
        var result = new org.mathdox.formulaeditor.semantics.Linalg2Vector()
        result.initialize.apply(result, operands)
        return result

      }

    })

  /**
   * Extend the ExpressionParser object with parsing code for Matrixrow.
   */
  with( org.mathdox.formulaeditor.semantics          ) {
  with( org.mathdox.formulaeditor.parsing.expression ) {
  with( new org.mathdox.parsing.ParserGenerator()    ) {

    org.mathdox.formulaeditor.parsing.expression.ExpressionParser =
      $extend(org.mathdox.formulaeditor.parsing.expression.ExpressionParser, {

        // expression160 = Linalg2Matrixlike | super.expression160
        expression160 : function() {
          var parent = arguments.callee.parent;
          alternation(
            rule("Linalg2Matrixlike"),
            parent.expression160
          ).apply(this, arguments);
        },

        // Linalg2Matrixrow = "[" expression ("," expression)* "]"
        Linalg2Matrixlike :
          transform(
            concatenation(
              literal("["),
              rule("expression"),
              repetition(
                concatenation(
                  literal(","),
                  rule("expression")
                )
              ),
              literal("]")
            ),
            function(result) {
              var array = new Array();
              for (var i=1; i+1<result.length; i=i+2) {
                array.push(result[i]);
              }
              var matrixLike;
              var allvector = true;
              for (var i=0; i<array.length; i++) {
                allvector = allvector && array[i] instanceof Linalg2Vector
              }
              if (allvector) {
                /*
                 * convert vectors in array to matrixrows
                 */
                var matrixRows = new Array()
                for (var i=0; i<array.length; i++) {
                  var row = new Linalg2Matrixrow()
                  row.initialize.apply(row, array[i].operands)
                  matrixRows.push(row)
                }
                // create a new matrix
                matrixLike = new Linalg2Matrix()
                //org.mathdox.matrixRows=matrixRows //XXX
                matrixLike.initialize.apply(matrixLike, matrixRows)
              } else {
                // create a vector 
                matrixLike = new Linalg2Vector()
                matrixLike.initialize.apply(matrixLike, array)
              }
              return matrixLike
            }
          )

      })

  }}}


})
