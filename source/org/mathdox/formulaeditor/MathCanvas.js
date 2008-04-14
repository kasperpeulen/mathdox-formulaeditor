$package("org.mathdox.formulaeditor");

$main(function(){

  /**
   * Adds mathematical symbol and string rendering to an HTML Canvas.
   */
  org.mathdox.formulaeditor.MathCanvas = $extend(Object, {

    /**
     * The HTML Canvas that is used for drawing mathematics.
     */
    canvas : null,

    /**
     * The name of the font that is used for drawing symbols and strings.
     */
    fontName : "cmr",

    /**
     * The font size that is used for drawing symbols and strings.
     */
    fontSize : 144,

    /**
     * Contains previously loaded images.
     */
    imageCache : null,

    /**
     * Constructor which takes as parameter the HTML Canvas that will be used to
     * draw mathematics on.
     */
    initialize : function(canvas) {
      this.canvas = canvas;
      this.imageCache = {};
    },

    /**
     * Returns the CanvasRenderingContext2D object associated with the HTML
     * canvas.
     */
    getContext : function() {
      return this.canvas.getContext("2d");
    },

    /**
     * Draws the specified bracket (character) on the canvas, at the specified
     * position, using the current fontName and fontSize. The (x,y) coordinate
     * indicates where the left of the baseline of the symbol will appear.
     * The result of this method is one object containing the values
     * { left, top, width, height } that indicate the position and dimensions of
     * the bounding rectangle of the drawn symbol.
     * The optional parameter 'invisible' determines whether or not the symbol
     * should be drawn to the canvas. By default this parameter is 'false'.
     * Setting this parameter to 'true' can be used to obtain information about
     * the dimensions of the drawn symbol, without actually drawing on the
     * canvas.
     *
     * This function is like the drawSymbol function, except it has an extra
     * parameter minimumSize, which is used to determine the size of the
     * brackets. A bracket symbol will be used of at least that size. If no
     * symbol of that size is known it will be tried to construct it, if that
     * fails a smaller symbol will be used. See also drawSymbol.
     */
    drawBracket : function(bracket, x, y, minimumHeight, invisible) {

      // retrieve font and symbol data
      var bracketData = this.getBracketData(bracket);
      var font = bracketData.font;

      var symbolData;

      // see if a standard symbol can be used
      for (var i=bracketData.symbols.length - 1 ; i>=0; i--) {
        if (bracketData.symbols[i].height >= minimumHeight) {
          symbolData = bracketData.symbols[i];
        }
      }

      // use the largest symbol if none is large enough, TODO implement large
      // constructing symbols
      //if (!symbolData) {
      //  symbolData = bracketData.symbols[bracketData.symbols.length-1];
      //}

      if (symbolData) {
        // draw a symbol 
        
        // calculate the position of the topleft corner, the width and the height
        if (symbolData.margin) {
          symbolData = {
            x: symbolData.x - symbolData.margin,
            y: symbolData.y,
            width: symbolData.width + 2*symbolData.margin,
            height: symbolData.height,
            yadjust: symbolData.yadjust
          }
        }
        var left   = x;
        var top    = y - symbolData.height + symbolData.yadjust;
        var width  = symbolData.width;
        var height = symbolData.height;
  
        // draw that part of the font image which contains the symbol
        if (!invisible) {
  
          var canvas = this.canvas;
          var cache  = this.imageCache;
  
          var drawImage = function() {
            canvas.getContext("2d").drawImage(
              cache[font.image],
              symbolData.x, symbolData.y, symbolData.width, symbolData.height,
              left, top, width, height
            );
          };
  
          if (cache[font.image] == null) {
            var image = new Image();
            image.onload = function() {
              cache[font.image] = image;
              drawImage();
            }
            image.src = font.image;
          }
          else{
            drawImage();
          }
  
        }
  
        // return the coordinates of the topleft corner, the width and height
        return {
          left:   left,
          top:    top,
          width:  width,
          height: height
        }
      } else {
        // construct a symbol
        var topSymbol = bracketData.topSymbol;
        var bottomSymbol = bracketData.bottomSymbol;
        var connection = bracketData.connection;
        var left = x;
        var height = Math.max(minimumHeight,
          topSymbol.height + bottomSymbol.height);
        var top = y - height + bottomSymbol.yadjust;
        var width = Math.max(topSymbol.width, connection.xadjust+
          connection.width, bottomSymbol.width);

        if (!invisible) {
  
          var canvas = this.canvas;
          var cache  = this.imageCache;
  
          var drawImage = function() {
            var topPos = { 
              left: left,
              top: top,
              width: topSymbol.width,
              height: topSymbol.height
            };
                   var bottomPos = { 
              left: left,
              top: top + height - bottomSymbol.height ,
              width: bottomSymbol.width,
              height: bottomSymbol.height
            };
                   var connPos = { 
              left: left,
              top: topPos.top + topPos.height,
              width: connection.width,
              height: height - topPos.height - bottomPos.height
            };
            canvas.getContext("2d").drawImage(
              cache[font.image],
              topSymbol.x, topSymbol.y, topSymbol.width, topSymbol.height,
              topPos.left, topPos.top, topPos.width, topPos.height
            );
            if (connPos.height>0) {
              canvas.getContext("2d").drawImage(
                cache[font.image],
                connection.x, connection.y, connection.width, connection.height,
                connPos.left+connection.xadjust, connPos.top, connPos.width, connPos.height
              );
            }
            canvas.getContext("2d").drawImage(
              cache[font.image],
              bottomSymbol.x, bottomSymbol.y, bottomSymbol.width, bottomSymbol.height,
              bottomPos.left, bottomPos.top, bottomPos.width, bottomPos.height
            );
          };
  
          if (cache[font.image] == null) {
            var image = new Image();
            image.onload = function() {
              cache[font.image] = image;
              drawImage();
            }
            image.src = font.image;
          }
          else{
            drawImage();
          }
  
        }
         // return the coordinates of the topleft corner, the width and height
        return {
          left:   left,
          top:    top,
          width:  width,
          height: height
        }
       }
    },

    /**
     * Draws a blue box around on the edge of an element, depending on the
     * dimensions. It overwrites the character (that is stays inside its
     * dimensions). The box will be drawn around
     * (dimensions.left,dimensions.top) (upper left) and
     * (dimensions.left+dimensions.width - 1, dimensions.top+dimensions.height
     * - 1) (lower right). An additional line will be drawn around the
     * baseline.
     */
    drawBox: function(dimensions,y) {
      var canvas = this.canvas;
      var context = this.getContext();
      context.save();
      context.lineWidth = 1.0;
      context.strokeRect(dimensions.left, dimensions.top, dimensions.width - 1 , dimensions.height - 1 );
      if (y) {
        context.beginPath();
        context.moveTo(dimensions.left, y);
        context.lineTo(dimensions.left + dimensions.width - 1, y);
        context.stroke();
        context.closePath();
      }
      context.restore();
    },
   
    // draw a box the size of the symbol of the letter 'f' 
    drawFBox : function(x, y, invisible, letter) {
      var dim;
      if (letter == null) {
	letter = "f";
      }
      with(org.mathdox.formulaeditor.presentation) {
	dim= new Symbol(letter).draw(this,x,y,true);

        if (!invisible) {
          var context = this.getContext();
          context.save();
          context.fillStyle = "#DDF";
          context.fillRect(dim.left, dim.top, dim.width, dim.height);
          context.restore();
        }

	return dim;
      }

    },


    /**
     * Draws the specified symbol (character) on the canvas, at the specified
     * position, using the current fontName and fontSize. The (x,y) coordinate
     * indicates where the left of the baseline of the symbol will appear.
     * The result of this method is one object containing the values
     * { left, top, width, height } that indicate the position and dimensions of
     * the bounding rectangle of the drawn symbol.
     * The optional parameter 'invisible' determines whether or not the symbol
     * should be drawn to the canvas. By default this parameter is 'false'.
     * Setting this parameter to 'true' can be used to obtain information about
     * the dimensions of the drawn symbol, without actually drawing on the canvas.
     */
    drawSymbol : function(symbol, x, y, invisible) {

      // retrieve font and symbol data
      var symbolData = this.getSymbolData(symbol);
      var font = symbolData.font;

      // calculate the position of the topleft corner, the width and the height
      var left   = x;
      var top    = y - symbolData.height + symbolData.yadjust;
      var width  = symbolData.width;
      var height = symbolData.height;

      // draw that part of the font image which contains the symbol
      if (!invisible) {

        var canvas = this.canvas;
        var cache  = this.imageCache;

        var drawImage = function() {
          canvas.getContext("2d").drawImage(
            cache[font.image],
            symbolData.x, symbolData.y, symbolData.width, symbolData.height,
            left, top, width, height
          );
        };

        if (cache[font.image] == null) {
          var image = new Image();
          image.onload = function() {
            cache[font.image] = image;
            drawImage();
          }
          image.src = font.image;
        }
        else{
          drawImage();
        }

      }

      // return the coordinates of the topleft corner, the width and height
      return {
        left:   left,
        top:    top,
        width:  width,
        height: height
      }

    },

    getBracketData : function(bracket) {
      // retrieve font and bracket data
      var font = this.fonts[this.fontName]
      var bracketData = font[this.fontSize].brackets[bracket]

      if (bracketData) {
        // return bracketdata
        bracketData.font = font[this.fontSize];
        return bracketData;
      }
      else {
        // check fallback fonts when the bracket could not be found in this font
        for (var i=0; i<font.fallback.length; i++) {
          var fallbackfont = this.fonts[font.fallback[i]];
          bracketData = fallbackfont[this.fontSize].brackets[bracket];
          if (bracketData) {
            bracketData.font = fallbackfont[this.fontSize];
            return bracketData;
          }
        }
      }

      // no bracket data found, return null
      return null;

    },

     getSymbolData : function(symbol) {
      // retrieve font and symbol data
      var font = this.fonts[this.fontName]
      var symbolData = font[this.fontSize].symbols[symbol]

      if (symbolData) {
        if (symbolData.margin) {
          symbolData = {
            x: symbolData.x - symbolData.margin,
            y: symbolData.y,
            width: symbolData.width + 2*symbolData.margin,
            height: symbolData.height,
            yadjust: symbolData.yadjust
          }
        }
        // return symboldata
        symbolData.font = font[this.fontSize];
        return symbolData;
      }
      else {
        // check fallback fonts when the symbol could not be found in this font
        for (var i=0; i<font.fallback.length; i++) {
          var fallbackfont = this.fonts[font.fallback[i]];
          symbolData = fallbackfont[this.fontSize].symbols[symbol];
          if (symbolData) {
            symbolData.font = fallbackfont[this.fontSize];
            return symbolData;
          }
        }
      }

      // no symbol data found, return null
      return null;

    },

    /**
     * Clears the canvas.
     */
    clear : function() {
      var canvas = this.canvas;
      var width  = canvas.getAttribute("width");
      var height = canvas.getAttribute("height");
      canvas.getContext("2d").clearRect(0, 0, width, height);
    },

    /**
     * Contains information about the location of the font png's, and where each
     * character is located inside these png's.
     */
    fonts : {

      // Computer Modern Math Extensions
      "cmex" : {

        // When a symbol can not be found in this font, search the fonts below
        fallback : ["cmex", "cmr","cmsy"],

        // point size 144
        144 : {

          // the location of each set of brackets in the font image
          brackets : {
            '(' : { 
              symbols : [
                { x: 12, y: 30, width: 6, height:24, yadjust:0},
                { x: 12, y:119, width: 9, height:37, yadjust:0},
                { x: 85, y:119, width:10, height:49, yadjust:0},
                { x: 13, y:208, width:11, height:61, yadjust:0}
              ],
              topSymbol : 
                { x: 14, y:296, width:12, height:36, yadjust:0},
              bottomSymbol :
                { x: 14, y:385, width:12, height:37, yadjust:0},
              connection : 
                { x: 14, y:331, width: 3, height: 1, yadjust:0, xadjust:0}
            },
            ')' : {
              symbols : [
                { x: 46, y: 30, width: 6, height:24, yadjust:0},
                { x: 45, y:119, width: 9, height:37, yadjust:0},
                { x:117, y:119, width:11, height:49, yadjust:0},
                { x: 45, y:208, width:12, height:61, yadjust:0},
              ],
              topSymbol : 
                { x: 45, y:296, width:12, height:36, yadjust:0},
              bottomSymbol : 
                { x: 45, y:385, width:12, height:37, yadjust:0},
              connection : 
                { x: 54, y:331, width: 3, height: 1, yadjust:0, xadjust:9}
            }
          },

          // the image that contains the font characters
          image : $baseurl + "org/mathdox/formulaeditor/fonts/cmex10/144.png",

          symbols : {}

        }

      },

      // Computer Modern Math Italic
      "cmmi" : {

        // When a symbol can not be found in this font, search the fonts below
        fallback : ["cmex", "cmr","cmsy"],

        // point size 144
        144 : {

          // the image that contains the font characters
          image : $baseurl + "org/mathdox/formulaeditor/fonts/cmmi10/144.png",

          // brackets in this font (if any)
          brackets : {},

          // the location of each character in the font image
          symbols : {
            // U+03C0 greek small letter pi
            'π' : { x:223, y:41,  width:12, height:10, yadjust:-1  },
            '<' : { x:296, y:87,  width:13, height:12, yadjust:-1  },
            '>' : { x:344, y:87,  width:13, height:12, yadjust:-1  }
          }

        }

      },

      // Computer Modern Roman
      "cmr" : {

        // When a symbol can not be found in this font, search the fonts below
        fallback : ["cmex", "cmmi","cmsy"],

        // point size 144
        144 : {

          // the image that contains the font characters
          image : $baseurl + "org/mathdox/formulaeditor/fonts/cmr10/144.png",

          // brackets in this font (if any)
          brackets : {},

          // the location of each character in the font image
          symbols : {

            // U+0393 greek capital letter gamma
            'Γ' : { x:8,   y:12,  width:12, height:14, yadjust:0  },

            // U+0393 greek capital letter gamma
            'Δ' : { x:34,  y:11,  width:15, height:15, yadjust:0  },

            // U+0398 greek capital letter theta
            'Θ' : { x:58,  y:11,  width:14, height:16, yadjust:1  },

            // U+039B greek capital letter lambda
            'Λ' : { x:82,  y:11,  width:14, height:15, yadjust:0  },

            // U+039E greek capital letter xi
            'Ξ' : { x:106, y:12,  width:13, height:14, yadjust:0  },

            // U+03A0 greek capital letter pi
            'Π' : { x:131, y:12,  width:15, height:14, yadjust:0  },

            // U+03A3 greek capital letter sigma
            'Σ' : { x:156, y:12,  width:13, height:14, yadjust:0  },

            // U+03A5 greek capital letter upsilon
            'Υ' : { x:181, y:11,  width:14, height:15, yadjust:0  },

            // U+03a6 greek capital letter phi
            'Φ' : { x:206, y:12,  width:13, height:14, yadjust:0  },

            // U+03A8 greek capital letter psi
            'Ψ' : { x:230, y:12,  width:14, height:14, yadjust:0  },

            // U+03A9 greek capital letter omega
            'Ω' : { x:255, y:11,  width:13, height:15, yadjust:0  },

            // U+2205 empty set
            '∅' : { x:303, y:39,  width:13, height:14, yadjust:2  },

            '!' : { x:34,  y:59,  width:3,  height:15, yadjust:0  },
            '"' : { x:57,  y:60,  width:7,  height:6,  yadjust:-8 },
            '#' : { x:83,  y:60,  width:15, height:18, yadjust:4  },
            '$' : { x:107, y:59,  width:8,  height:16, yadjust:1  },
            '%' : { x:132, y:59,  width:15, height:17, yadjust:2  },
            '&' : { x:155, y:59,  width:15, height:16, yadjust:1  },
            "'" : { x:181, y:60,  width:4,  height:6,  yadjust:-8 },
            '(' : { x:207, y:59,  width:5,  height:20, yadjust:5  },
            ')' : { x:230, y:59,  width:5,  height:20, yadjust:5  },
            '*' : { x:255, y:59,  width:8,  height:9,  yadjust:-6 },
            '+' : { x:279, y:62,  width:14, height:14, yadjust:2  },
            ',' : { x:304, y:71,  width:3,  height:7,  yadjust:4  },

            // fake ' ', like ',', 4 pixes to the right
            ' ' : { x:308, y:71,  width:3,  height:7,  yadjust:4  },

            '-' : { x:327, y:69,  width:6,  height:2,  yadjust:-3, margin:2 },
            '.' : { x:353, y:71,  width:3,  height:3,  yadjust:0  },
            '/' : { x:378, y:59,  width:8,  height:20, yadjust:5  },
            '0' : { x:8,   y:84,  width:10, height:15, yadjust:1  },
            '1' : { x:34,  y:84,  width:8,  height:14, yadjust:0  },
            '2' : { x:58,  y:84,  width:8,  height:14, yadjust:0  },
            '3' : { x:82,  y:84,  width:10, height:15, yadjust:1  },
            '4' : { x:106, y:84,  width:10, height:14, yadjust:0  },
            '5' : { x:132, y:84,  width:8,  height:15, yadjust:1  },
            '6' : { x:155, y:84,  width:10, height:15, yadjust:1  },
            '7' : { x:181, y:84,  width:9,  height:15, yadjust:1  },
            '8' : { x:205, y:84,  width:10, height:15, yadjust:1  },
            '9' : { x:229, y:84,  width:10, height:15, yadjust:1  },
            ':' : { x:255, y:89,  width:3,  height:9,  yadjust:0  },
            ';' : { x:279, y:89,  width:3,  height:13, yadjust:4  },
            '=' : { x:328, y:90,  width:14, height:6,  yadjust:-2 },
            '?' : { x:378, y:83,  width:8,  height:15, yadjust:0  },
            '@' : { x:9,   y:107, width:14, height:16, yadjust:1  },
            'A' : { x:33,  y:107, width:15, height:15, yadjust:0  },
            'B' : { x:57,  y:108, width:13, height:14, yadjust:0  },
            'C' : { x:83,  y:107, width:13, height:16, yadjust:1  },
            'D' : { x:106, y:108, width:15, height:14, yadjust:0  },
            'E' : { x:131, y:108, width:13, height:14, yadjust:0  },
            'F' : { x:155, y:108, width:13, height:14, yadjust:0  },
            'G' : { x:181, y:107, width:14, height:16, yadjust:1  },
            'H' : { x:205, y:108, width:15, height:14, yadjust:0  },
            'I' : { x:229, y:108, width:7,  height:14, yadjust:0  },
            'J' : { x:254, y:108, width:10, height:15, yadjust:1  },
            'K' : { x:278, y:108, width:15, height:14, yadjust:0  },
            'L' : { x:303, y:108, width:12, height:14, yadjust:0  },
            'M' : { x:327, y:108, width:18, height:14, yadjust:0  },
            'N' : { x:352, y:108, width:15, height:14, yadjust:0  },
            'O' : { x:378, y:107, width:14, height:16, yadjust:1  },
            'P' : { x:8,   y:131, width:13, height:14, yadjust:0  },
            'Q' : { x:34,  y:130, width:14, height:19, yadjust:4  },
            'R' : { x:57,  y:131, width:15, height:15, yadjust:1  },
            'S' : { x:83,  y:130, width:9,  height:16, yadjust:1  },
            'T' : { x:106, y:131, width:14, height:14, yadjust:0  },
            'U' : { x:131, y:131, width:15, height:15, yadjust:1  },
            'V' : { x:155, y:131, width:15, height:15, yadjust:1  },
            'W' : { x:180, y:131, width:21, height:15, yadjust:1  },
            'X' : { x:205, y:131, width:15, height:14, yadjust:0  },
            'Y' : { x:229, y:131, width:15, height:14, yadjust:0  },
            'Z' : { x:255, y:131, width:11, height:14, yadjust:0  },
            '[' : { x:280, y:130, width:4,  height:20, yadjust:5  },
            ']' : { x:327, y:130, width:4,  height:20, yadjust:5  },
            'a' : { x:33,  y:160, width:10, height:10, yadjust:1  },
            'b' : { x:57,  y:155, width:11, height:15, yadjust:1  },
            'c' : { x:82,  y:160, width:9,  height:10, yadjust:1  },
            'd' : { x:106, y:155, width:11, height:15, yadjust:1  },
            'e' : { x:131, y:160, width:9,  height:10, yadjust:1  },
            'f' : { x:155, y:154, width:8,  height:15, yadjust:0  },
            'g' : { x:180, y:160, width:10, height:14, yadjust:5  },
            'h' : { x:205, y:155, width:11, height:14, yadjust:0  },
            'i' : { x:229, y:155, width:5,  height:14, yadjust:0  },
            'j' : { x:253, y:155, width:6,  height:19, yadjust:5  },
            'k' : { x:278, y:155, width:11, height:14, yadjust:0  },
            'l' : { x:303, y:155, width:5,  height:14, yadjust:0  },
            'm' : { x:327, y:160, width:17, height:9,  yadjust:0  },
            'n' : { x:352, y:160, width:11, height:9,  yadjust:0  },
            'o' : { x:377, y:160, width:10, height:10, yadjust:1  },
            'p' : { x:8,   y:184, width:11, height:13, yadjust:4  },
            'q' : { x:33,  y:184, width:11, height:13, yadjust:4  },
            'r' : { x:57,  y:184, width:8,  height:9,  yadjust:0  },
            's' : { x:82,  y:184, width:8,  height:10, yadjust:1  },
            't' : { x:106, y:180, width:7,  height:14, yadjust:1  },
            'u' : { x:131, y:184, width:11, height:10, yadjust:1  },
            'v' : { x:155, y:184, width:11, height:10, yadjust:1  },
            'w' : { x:180, y:184, width:14, height:10, yadjust:1  },
            'x' : { x:205, y:184, width:11, height:9,  yadjust:0  },
            'y' : { x:229, y:184, width:11, height:13, yadjust:4  },
            'z' : { x:254, y:184, width:8,  height:9,  yadjust:0  }

          }

        }

      },

      // Computer Modern Math Symbols
      "cmsy" : {

        // When a symbol can not be found in this font, search the fonts below
        fallback : ["cmex", "cmmi","cmr"],

        // point size 144
        144 : {

          // the image that contains the font characters
          image : $baseurl + "org/mathdox/formulaeditor/fonts/cmsy10/144.png",

          // brackets in this font (if any)
          brackets : {},

          // the location of each character in the font image
          symbols : {

            // U+00B7 middle dot
            '·' : { x:38,  y:21,  width:3,  height:2,  yadjust:-4 , margin:2 },

            // U+2264 less than or equal to
            '≤' : { x:124, y:55,  width:13, height:16, yadjust:3  },

            // U+2265 greater than or equal to
            '≥' : { x:153, y:55,  width:13, height:16, yadjust:3  },

            // U+2248 almost equal to
            '≈' : { x:268, y:58,  width:14, height:9,  yadjust:-1 },

            // U+21D0 leftwards double arrow
            '⇐' : { x:239, y:98,  width:18, height:12, yadjust:1  }, 

            // U+21D2 rightwards double arrow
            '⇒' : { x:268, y:98,  width:18, height:12, yadjust:1  },

            // U+21D4 left right double arrow
            '⇔' : { x:353, y:98,  width:19, height:12, yadjust:1  },

            // U+221E infinity
            '∞' : { x:38,  y:141, width:18, height:10, yadjust:1 },

            // U+00AC not sign
            '¬' : { x:296, y:142, width:12, height:7,  yadjust:-1 },

            // U+2227 logical and
            '∧' : { x:411, y:220, width:12, height:13, yadjust:1  },

            // U+2228 logical or
            '∨' : { x:440, y:220, width:12, height:13, yadjust:1  },

            '|' : { x:297, y:258, width:2,  height:20, yadjust:5  }

          }

        }

      }

    }

  })

})
