$package("org.mathdox.formulaeditor");

// load make/maker functions
$require("com/oreilly/javascript/tdg/make.js");

$require("org/mathdox/formulaeditor/parsing/expression/KeywordList.js");
$require("org/mathdox/formulaeditor/parsing/openmath/KeywordList.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/Canvas.js");
$require("org/mathdox/formulaeditor/MathCanvas.js");
$require("org/mathdox/formulaeditor/Cursor.js");
$require("org/mathdox/formulaeditor/EventHandler.js");
$require("org/mathdox/formulaeditor/presentation/EmptyRow.js");

//$require("org/mathdox/formulaeditor/modules/arith1/gcd.js");
//$require("org/mathdox/formulaeditor/modules/arith1/lcm.js");
$require("org/mathdox/formulaeditor/modules/keywords.js");

$require("org/mathdox/formulaeditor/modules/arithmetic/abs.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/divide.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/minus.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/plus.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/power.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/sum.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/times.js");
//$require("org/mathdox/formulaeditor/modules/arithmetic/unaryminus.js");

//$require("org/mathdox/formulaeditor/modules/arith1/unary_minus.js");

$require("org/mathdox/formulaeditor/modules/linalg/matrix.js");

/*
$require("org/mathdox/formulaeditor/modules/logic1/and.js");
$require("org/mathdox/formulaeditor/modules/logic1/equivalent.js");
//$require("org/mathdox/formulaeditor/modules/logic1/false.js");
$require("org/mathdox/formulaeditor/modules/logic1/implies.js");
$require("org/mathdox/formulaeditor/modules/logic1/not.js");
$require("org/mathdox/formulaeditor/modules/logic1/or.js");
//$require("org/mathdox/formulaeditor/modules/logic1/true.js");

//$require("org/mathdox/formulaeditor/modules/nums1/e.js");
//$require("org/mathdox/formulaeditor/modules/nums1/i.js");
//$require("org/mathdox/formulaeditor/modules/nums1/infinity.js");
//$require("org/mathdox/formulaeditor/modules/nums1/pi.js");

$require("org/mathdox/formulaeditor/modules/relation1/approx.js");
$require("org/mathdox/formulaeditor/modules/relation1/eq.js");
$require("org/mathdox/formulaeditor/modules/relation1/geq.js");
$require("org/mathdox/formulaeditor/modules/relation1/gt.js");
$require("org/mathdox/formulaeditor/modules/relation1/leq.js");
$require("org/mathdox/formulaeditor/modules/relation1/lt.js");
*/
/*$require("org/mathdox/formulaeditor/modules/relation1/neq.js");*/

//$require("org/mathdox/formulaeditor/modules/relation2/eqs.js");

/*$require("org/mathdox/formulaeditor/modules/relations/equality.js");*/

//$require("org/mathdox/formulaeditor/modules/set1/emptyset.js");

/*
$require("org/mathdox/formulaeditor/modules/transc1/arccos.js");
$require("org/mathdox/formulaeditor/modules/transc1/arccosh.js");
$require("org/mathdox/formulaeditor/modules/transc1/arccot.js");
$require("org/mathdox/formulaeditor/modules/transc1/arccoth.js");
$require("org/mathdox/formulaeditor/modules/transc1/arccsc.js");
$require("org/mathdox/formulaeditor/modules/transc1/arccsch.js");
$require("org/mathdox/formulaeditor/modules/transc1/arcsec.js");
$require("org/mathdox/formulaeditor/modules/transc1/arcsech.js");
$require("org/mathdox/formulaeditor/modules/transc1/arcsin.js");
$require("org/mathdox/formulaeditor/modules/transc1/arcsinh.js");
$require("org/mathdox/formulaeditor/modules/transc1/arctan.js");
$require("org/mathdox/formulaeditor/modules/transc1/arctanh.js");
$require("org/mathdox/formulaeditor/modules/transc1/cos.js");
$require("org/mathdox/formulaeditor/modules/transc1/cosh.js");
$require("org/mathdox/formulaeditor/modules/transc1/cot.js");
$require("org/mathdox/formulaeditor/modules/transc1/coth.js");
$require("org/mathdox/formulaeditor/modules/transc1/csc.js");
$require("org/mathdox/formulaeditor/modules/transc1/csch.js");
$require("org/mathdox/formulaeditor/modules/transc1/exp.js");
$require("org/mathdox/formulaeditor/modules/transc1/ln.js");
$require("org/mathdox/formulaeditor/modules/transc1/log.js");
$require("org/mathdox/formulaeditor/modules/transc1/sec.js");
$require("org/mathdox/formulaeditor/modules/transc1/sech.js");
$require("org/mathdox/formulaeditor/modules/transc1/sin.js");
$require("org/mathdox/formulaeditor/modules/transc1/sinh.js");
$require("org/mathdox/formulaeditor/modules/transc1/tan.js");
$require("org/mathdox/formulaeditor/modules/transc1/tanh.js");
*/

$main(function(){

  /**
   * Maintain a list of all formula editors that are initialized.
   */
  var editors = [];

  var palette;

  /**
   * Class that represents a formula editor.
   */
  org.mathdox.formulaeditor.FormulaEditor = $extend(Object, {

    /**
     * The textarea that is being replaced.
     */
    textarea : null,

    /**
     * The canvas that will be used for rendering formulae.
     */
    canvas : null,

    /**
     * The current presentation tree.
     */
    presentation : null,

    /**
     * The keyboard cursor.
     */
    cursor : null,

    /**
     * The palette (if any)
     */
    palette : null,

    /**
     * Indicates whether this formula editor has the focus.
     */
    hasFocus : false,

    /**
     * Hides the specified textarea and replaces it by a canvas that will be
     * used for rendering formulae.
     */
    initialize : function(textarea, canvas) {

      if (textarea) {

        var Cursor    = org.mathdox.formulaeditor.Cursor;
        var MathCanvas = org.mathdox.formulaeditor.MathCanvas;

        // ensure that there isn't already an editor for this textarea
        for (var i=0; i<editors.length; i++) {
          if (editors[i].textarea == textarea) {
            return editors[i];
          }
        }

        // check whether a new canvas needs to be added.
        if (!canvas) {

          // create an HTML canvas
          canvas = document.createElement("canvas");

          // copy style attributes from the textarea to the canvas
          for (var x in textarea.style) {
            try {
              canvas.style[x] = textarea.style[x];
            }
            catch(exception) {
              // skip
            }
          }

          // set the style attributes that determine the look of the editor
          canvas.style.border        = "1px solid #99F";
          canvas.style.verticalAlign = "middle";
          canvas.style.cursor        = "text";
          canvas.style.padding       = "0px";

          // insert canvas in the document before the textarea 
          textarea.parentNode.insertBefore(canvas, textarea);

          // Initialize the canvas. This is only needed in Internet Explorer,
          // where Google's Explorer Canvas library handles canvases.
          if (G_vmlCanvasManager) {
            canvas = G_vmlCanvasManager.initElement(canvas);
          }

        }

        // check whether a palette needs to be added
        if (!palette) {
          /*
          var ec = new com.oreilly.javascript.tdg.ElementCreation;
          var table = ec.maker("table");
          var tr = ec.maker("tr");
          var td = ec.maker("td");
          var span = ec.maker("span");

          palette = ec.make("div", { class: "formulaeditor_palette" }, 
            table({},[
              tr({},[ td({}, span({class:"math"}, "\\pi")) ])
            ])
          );

          palette.style.border = "solid";
          */
          //canvas.parentNode.insertBefore(palette, canvas);
          var palcanvas = document.createElement("canvas");

          // copy style attributes from the textarea to the canvas
          for (var x in textarea.style) {
            try {
              palcanvas.style[x] = textarea.style[x];
            }
            catch(exception) {
              // skip
            }
          }

          // set the style attributes that determine the look of the editor
          palcanvas.style.border        = "2px solid #99F";
          palcanvas.style.verticalAlign = "middle";
          palcanvas.style.cursor        = "text";
          palcanvas.style.padding       = "0px";

          // insert canvas in the document before the textarea 
          textarea.parentNode.insertBefore(palcanvas, textarea);

          // Initialize the canvas. This is only needed in Internet Explorer,
          // where Google's Explorer Canvas library handles canvases.
          if (G_vmlCanvasManager) {
            palcanvas = G_vmlCanvasManager.initElement(palcanvas);
          }
          palette = new org.mathdox.formulaeditor.Palette(palcanvas);
        }

        // hide the textarea
        textarea.style.display = "none";

        // register the textarea and a new mathcanvas
        this.textarea = textarea;
        this.canvas   = new MathCanvas(canvas);
        this.palette  = palette;

        this.load();

        // initialize the cursor, and draw the presentation tree
        this.cursor = new Cursor(this.presentation.getFollowingCursorPosition());
        this.draw();

        // register this editor in the list of editors.
        editors.push(this);

      }

    },

    load : function() {

      var Parser    = org.mathdox.formulaeditor.parsing.openmath.OpenMathParser;
      var Row       = org.mathdox.formulaeditor.presentation.Row;

      // read any OpenMath code that may be present in the textarea
      try {
        var parsed = new Parser().parse(this.textarea.value);
        this.presentation = new Row(parsed.getPresentation());
        this.presentation.flatten();
      }
      catch(exception) {
        this.presentation = new Row();
      }

    },

    // TODO : move this to an onchange handler
    save : function() {

      var textarea = this.textarea;

      // update the textarea
      textarea.value = this.getOpenMath();

    },

    redraw : function() {
      this.canvas.clear();
      this.draw();
    },

    draw : function() {

      // TODO: move this code to a separate presentation node
      //       (equivalent to the DOM Document node)
      var margin = 4.0;
      var dimensions = this.presentation.draw(this.canvas, 0, 0, true);
      this.canvas.canvas.setAttribute("width", dimensions.width + 2 * margin);
      this.canvas.canvas.setAttribute("height", dimensions.height + 2 * margin);
      this.presentation.draw(this.canvas, margin-dimensions.left, margin-dimensions.top);
      this.cursor.draw(this.canvas);
    },

    /**
     * Handles an onkeydown event from the browser. Returns false when the event
     * has been handled and should not be handled by the browser, returns true
     * otherwise.
     */
    onkeydown : function(event) {

      // forward the event to the cursor object when we have the focus
      if(this.hasFocus) {
        // handle some events here
        switch (event.keyCode) {
          case 116: // F5
            var Cursor    = org.mathdox.formulaeditor.Cursor;

            this.save();
            this.load();
            this.cursor = new Cursor(this.presentation.getFollowingCursorPosition());
            this.focus(); // XXX is this necessary ?
            this.redraw();

            return false;
        }
        this.focus(); // TODO: only necessary for crappy blinker implementation
        return this.cursor.onkeydown(event, this);
      }

    },

    /**
     * Handles an onkeypress event from the browser. Returns false when the
     * event has been handled and should not be handled by the browser, returns
     * true otherwise.
     */
    onkeypress : function(event) {

      // forward the event to the cursor object when we have the focus
      if (this.hasFocus) {
        this.focus(); // TODO: only necessary for crappy blinker implementation
        return this.cursor.onkeypress(event, this);
      }

    },

    /**
     * Returns info about the mouse event, returning {x, y}, where x and y are
     * the relative positions in the canvas. If the mouseclick was not in the
     * canvas null is returned instead.
     */
    mouseeventinfo : function(event) {  

      // retrieve the screen coordinates of the mouse click
      var mouseX = event.clientX;
      var mouseY = event.clientY;

      // retrieve the page offset, needed to convert screen coordinates to
      // document coordinates
      var pageXOffset = window.pageXOffset;
      var pageYOffset = window.pageYOffset;

      // MSIE provides the page offset in a different way *sigh*
      if (pageXOffset == null) {
        var element = document.documentElement;
        if (!element || !element.scrollLeft) {
          element = document.body;
        }
        pageXOffset = element.scrollLeft;
        pageYOffset = element.scrollTop;
      }

      // calculate the document coordinates of the mouse click
      mouseX += pageXOffset;
      mouseY += pageYOffset;

      // calculate the document coordinates of the canvas element
      var element = this.canvas.canvas;
      var x      = 0;
      var y      = 0;
      var width  = element.offsetWidth;
      var height = element.offsetHeight;
      while (element) {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
      }

      // check whether the mouse click falls in the canvas element
      if (x<=mouseX && mouseX<=x+width && y<=mouseY && mouseY<=y+height) {
        // we have focus
        // forward the mouse click to the cursor object
        return { x:mouseX-x, y:mouseY-y };
      }
      else {
        // we do not have focus
        return null;
      }

    },
    /**
     * Handles an onmousedown event from the browser. Returns false when the
     * event has been handled and should not be handled by the browser, returns
     * true otherwise.
     */
    onmousedown : function(event) {
      // check whether the mouse click falls in the canvas element
      var mouseinfo = this.mouseeventinfo(event);

      if (mouseinfo) {
        // we have focus
        this.focus();
        // forward the mouse click to the cursor object
        return this.cursor.onmousedown(event, this, mouseinfo.x, mouseinfo.y);
      }
      else {
        // we do not have focus
        this.blur();
        this.redraw();
      }

    },

    // TODO: only necessary for crappy blinker implementation
    blinker : 0,

    focus : function() {

      this.hasFocus = true;
      this.cursor.visible = true;

      // cursor blinking
      // TODO: move to cursor class
      var editor = this;
      var blinker = ++this.blinker;
      var blinkon;
      var blinkoff;
      blinkon = function() {
        if (editor.hasFocus && (blinker == editor.blinker)) {
          editor.cursor.visible = true;
          editor.redraw();
          window.setTimeout(blinkoff, 600);
        }
      }
      blinkoff = function() {
        if (editor.hasFocus && (blinker == editor.blinker)) {
          editor.cursor.visible = false;
          editor.redraw();
          window.setTimeout(blinkon, 400);
        }
      }
      blinkon();

    },

    blur : function() {
      this.hasFocus = false;
      this.cursor.visible = false;
    },

    getMathML : function() {
      var mmlstring;
      try {
        mmlstring = this.presentation.getSemantics().value.getMathML();
      }
      catch(exception) {
        mmlstring = exception.toString();
      }

      return mmlstring;
    },

    getOpenMath : function() {
      var omstring;
      try {
        omstring =
          "<OMOBJ xmlns='http://www.openmath.org/OpenMath' version='2.0' " +
          "cdbase='http://www.openmath.org/cd'>" +
          this.presentation.getSemantics().value.getOpenMath() +
          "</OMOBJ>";
      }
      catch(exception) {
        omstring =
          "<OMOBJ xmlns='http://www.openmath.org/OpenMath' version='2.0' " +
          "cdbase='http://www.openmath.org/cd'>" +
            "<OME>" +
              "<OMS cd='moreerrors' name='encodingError'/>" +
              "<OMSTR>invalid expression entered</OMSTR>" +
              exception.toString() +
            "</OME>" +
          "</OMOBJ>";
      }
      
      return omstring;

    }

  });

  /**
   * Add the static getEditorByTextArea(id) method, that returns the formula
   * editor corresponding to a certain textarea. Returns null when none of the
   * editors in the page has a textarea with that id argument id.
   */
  org.mathdox.formulaeditor.FormulaEditor.getEditorByTextArea = function(id) {

    for (var i=0; i<editors.length; i++) {
      if (id == editors[i].textarea.id) {
        return editors[i];
      }
    }
    return null;

  }

  /**
   * Add the static getFocusedEditor() method, that returns the formula editor
   * that currently has focus. Returns null when none of the editors in the page
   * have focus.
   */
  org.mathdox.formulaeditor.FormulaEditor.getFocusedEditor = function() {

    for (var i=0; i<editors.length; i++) {
      if (editors[i].hasFocus) {
        return editors[i];
      }
    }
    return null;

  }


  /**
   * When the document has finished loading, replace all textarea elements of
   * class 'mathdoxformula' with a formula editor.
   */

  // function that will be called upon loading
  var onload = function() {

    // replace all textarea's of class 'mathdoxformula' with editors
    var textareas = document.getElementsByTagName("textarea")
    for (var i=0; i<textareas.length; i++) {
      var textarea = textareas[i];

      // retrieve the class attribute of the textarea
      var classattribute = textarea.getAttribute("class");

      // workaround bug in IE
      // see also http://www.doxdesk.com/personal/posts/wd/20020617-dom.html
      if (!classattribute) {
        classattribute = textarea.getAttribute("className");
      }

      // check whether this textarea is of class 'mathdoxformula'
      if (classattribute && classattribute.match(/(^| )mathdoxformula($| )/)) {

        // replace the textarea by a formula editor
        new org.mathdox.formulaeditor.FormulaEditor(textarea);

      }

    }

    // register key and mouse handlers that forward events to the editors
    var Handler = $extend(org.mathdox.formulaeditor.EventHandler, {

      onkeydown : function(event) {
        var result = true;
        for (var i=0; i<editors.length; i++) {
          var intermediate = editors[i].onkeydown(event);
          if (intermediate != null && intermediate == false) {
            result = false;
          }
        }
        return result;
      },

      onkeypress : function(event) {
        var result = true;
        for (var i=0; i<editors.length; i++) {
          var intermediate = editors[i].onkeypress(event);
          if (intermediate != null && intermediate == false) {
            result = false;
          }
        }
        return result;
      },

      onmousedown : function(event) {
        var result = true;
        if (palette) {
          result = palette.onmousedown(event);
        }
        if (result) {
          // if not handled by palette, then continue
          for (var i=0; i<editors.length; i++) {
            var intermediate = editors[i].onmousedown(event);
            if (intermediate != null && intermediate == false) {
              result = false;
            }
          }
          return result;
        }
      }

    });
    new Handler();

  }

  // register the onload function as an event handler
  if (window.addEventListener) {

    // use the W3C standard way of registering event handlers
    window.addEventListener("load", onload, false)

  }
  else if (document.body.attachEvent){

    // use the MSIE-only way of registering event handlers
    if (document.readyState == "complete") {
      onload();
    }
    else {
      document.body.attachEvent("onload", onload);
    }

  }

  /**
   * Class that represents a formula editor palette.
   */
  org.mathdox.formulaeditor.Palette = $extend(
    org.mathdox.formulaeditor.FormulaEditor, {

    // do nothing with a keypress
    onkeydown : function(event) {
      return true; 
    },
    // do nothing with a keypress
    onkeypress : function(event) {
      return true; 
    },
    // handle a mouseclick
    onmousedown: function(event) {
      // check whether the mouse click falls in the canvas element
      var mouseinfo = this.mouseeventinfo(event);

      if (mouseinfo) {
        // we are clicked on
        var editor = org.mathdox.formulaeditor.FormulaEditor.getFocusedEditor();
        if (editor) {
          this.presentation.insertSymbolFromPalette(editor, 
            mouseinfo.x, mouseinfo.y);
        } else {
          alert("No formulaeditor with focus. Please click on an editor\n"+
                "at the position where the symbol should be entered.");
        }

        return false;
      }
      else {
        // we are not clicked on 
        return true;
      }
    },
    // fake function, do not draw the cursor
    cursor : {
      draw: function() {
        return true;
      }
    }
    ,
    // todo onmousedown : function(event) { }
    initialize : function(canvas) {
      var MathCanvas = org.mathdox.formulaeditor.MathCanvas;
      if (arguments.length > 0 ) { 
        this.canvas = new MathCanvas(canvas);
      }
      with (org.mathdox.formulaeditor.presentation) {
        var pi = org.mathdox.formulaeditor.parsing.openmath.KeywordList["nums1__pi"];
	var semInteger = org.mathdox.formulaeditor.semantics.Integer;

        var autocreate = function(createFun) {
          var obj = createFun(); 
          if (obj instanceof Array) {
            // in case of an array put it in a row for the palette, and add the
            // items one by one in insertCopy
            
            var row = new Row();
            row.initialize.apply(row, obj);
            row.insertCopy = function(position) {
              var toInsert = createFun();
              var i;

              for (i=0;i<toInsert.length;i++) {
                position.row.insert(position.index, toInsert[i]);
                position.index++;
              };
            }
            obj = row;
          } else {
            obj.insertCopy = function(position) {
              position.row.insert(position.index, createFun());
              position.index++;
            };
          }
          return obj;
        }
        var empty = function() {
          var obj = new Symbol(" ");
          obj.insertCopy = function(position) { };
          return obj;
        };
        var autocreateOMA = function(cd, name) {
          var createFun = function() {
            return [ org.mathdox.formulaeditor.parsing.openmath.KeywordList[cd+"__"+name].getPresentation(), new Symbol("("), new Row(), new Symbol(")")];
          };
          return autocreate(createFun);
        }
        var autocreateOMS = function(cd, name) {
          var createFun = function() {
            return org.mathdox.formulaeditor.parsing.openmath.KeywordList[cd+"__"+name].getPresentation();
          };
          return autocreate(createFun);
        };
        var autocreateSymbol = function(symbol) {
          var createFun = function() {
            return new Symbol(symbol);
          }
          return autocreate(createFun);
        };
        var autocreateMatrix = function(n,m) {
	  var obj = new Vector(new Row((new semInteger(n)).getPresentation(),new Symbol("x"), (new semInteger(m)).getPresentation()));
          obj.insertCopy = function(position) {
	    var rows = new Array();
            var i,j;
            for (i=0;i<n;i++) {
	      var row = new Array();
	      for (j=0;j<m;j++) {
		row.push(new Row());
	      }
	      rows.push(row);
            }
            var mat = new Matrix();
	    mat.initialize.apply(mat,rows);
            position.row.insert(position.index, mat);
            position.index++;
          }
          return obj;
        };
        var autocreateVector = function(size) {
	  var i = new semInteger(size);
          var obj = new Vector(new Row(i.getPresentation()));
          obj.insertCopy = function(position) {
	    var entries = new Array();
            var i;
            for (i=0;i<size;i++) {
              entries.push(new Row());
            }
            var v = new Vector();
	    v.initialize.apply(v,entries);
            position.row.insert(position.index, v);
            position.index++;
          }
          return obj;
        };
        // create o/o 
        var createFrac = function() {
          return new Fraction(new Row(), new Row());
        };
        // create o^o
        var createPower = function() {
          return [new EmptyRow(), new Superscript(new Row)];
        };
        // create |o|
        var createAbs = function() {
          return [new Symbol("|"), new EmptyRow(), new Symbol("|")];
        };
        // create o!
        var createFac = function() {
          return [new EmptyRow(), new Symbol("!")];
        };
        // create e^o
        var createEPower = function() {
          return [autocreateOMS("nums1","e"), new Superscript(new Row())];
        };
        // create a PArray
        this.presentation = new PArray(
          [ autocreateSymbol("+"), 
            autocreateSymbol("-"), 
            // U+00B7 middle dot
            autocreateSymbol("·"),
            // U+2227 logical and
            autocreateSymbol("∧"),
            // U+2228 logical or
            autocreateSymbol("∨"),
            autocreateOMA("transc1", "cos"),
	    autocreateVector(2),
          ],
          [ autocreateSymbol("<"), 
            // U+2264 less-than or equal to 
            autocreateSymbol("≤"),
            autocreateSymbol("="),
            // U+2265 greater-than or equal to 
            autocreateSymbol("≥"), 
            autocreateSymbol(">"),
            autocreateOMA("transc1", "sin"),
	    autocreateVector(3),
          ],
          [ autocreateOMS("nums1","pi"),
            autocreateOMS("nums1","e"),
            autocreateOMS("nums1","i"),
            autocreateOMS("nums1","infinity"),
            empty(),
            autocreateOMA("transc1", "tan"),
	    autocreateMatrix(2,2),
          ],
          [ autocreate(createFrac), 
            autocreate(createPower),
            autocreate(createAbs),
            autocreate(createFac),
            autocreate(createEPower),
            autocreateOMA("transc1", "ln"),
	    autocreateMatrix(2,3),
          ]
        );
        this.presentation.margin = 10.0;
        this.draw();
      }
    }
  });

});
