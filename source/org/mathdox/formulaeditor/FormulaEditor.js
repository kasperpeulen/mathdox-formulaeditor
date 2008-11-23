$package("org.mathdox.formulaeditor");

$identify("org/mathdox/formulaeditor/FormulaEditor.js");

// load make/maker functions
$require("com/oreilly/javascript/tdg/make.js");

var Drag;
$require("net/youngpup/dom-drag/dom-drag.js", function() { return Drag; });

$require("org/mathdox/formulaeditor/parsing/expression/KeywordList.js");
$require("org/mathdox/formulaeditor/parsing/openmath/KeywordList.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/Canvas.js");
$require("org/mathdox/formulaeditor/MathCanvasFill.js");
$require("org/mathdox/formulaeditor/Cursor.js");
$require("org/mathdox/formulaeditor/EventHandler.js");

$require("org/mathdox/formulaeditor/version.js");

$require("org/mathdox/formulaeditor/Options.js");

$require("org/mathdox/formulaeditor/modules/keywords.js");

$require("org/mathdox/formulaeditor/modules/arithmetic/abs.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/divide.js");
$require("org/mathdox/formulaeditor/modules/arith1/minus.js");
$require("org/mathdox/formulaeditor/modules/arith1/plus.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/power.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/product.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/root.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/sum.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/times.js");
$require("org/mathdox/formulaeditor/modules/arith1/unary_minus.js");

$require("org/mathdox/formulaeditor/modules/calculus1/defint.js");
$require("org/mathdox/formulaeditor/modules/calculus1/int.js");

$require("org/mathdox/formulaeditor/modules/editor1/palette.js");

$require("org/mathdox/formulaeditor/modules/fns1/lambda.js");

$require("org/mathdox/formulaeditor/modules/integer1/factorial.js");

$require("org/mathdox/formulaeditor/modules/linalg/matrix.js");

$require("org/mathdox/formulaeditor/modules/list1/list.js");

$require("org/mathdox/formulaeditor/presentation/Root.js");

$require("org/mathdox/formulaeditor/modules/logic1/and.js");
$require("org/mathdox/formulaeditor/modules/logic1/equivalent.js");
$require("org/mathdox/formulaeditor/modules/logic1/implies.js");
$require("org/mathdox/formulaeditor/modules/logic1/not.js");
$require("org/mathdox/formulaeditor/modules/logic1/or.js");

$require("org/mathdox/formulaeditor/modules/permutation1/permutation.js");

$require("org/mathdox/formulaeditor/modules/relation1/approx.js");
$require("org/mathdox/formulaeditor/modules/relation1/eq.js");
$require("org/mathdox/formulaeditor/modules/relation1/geq.js");
$require("org/mathdox/formulaeditor/modules/relation1/gt.js");
$require("org/mathdox/formulaeditor/modules/relation1/leq.js");
$require("org/mathdox/formulaeditor/modules/relation1/lt.js");
$require("org/mathdox/formulaeditor/modules/relation1/neq.js");
$require("org/mathdox/formulaeditor/modules/relation2/eqs.js");

$main(function(){

  /**
   * Maintain a list of all formula editors that are initialized.
   */
  var editors = [];

  var palettes;

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
     * Boolean that indicates whether the palette should be shown
     */
    showPalette : true,

    /**
     * Indicates whether this formula editor has the focus.
     */
    hasFocus : false,

    /**
     * checkClass(classNames, className): function to help check if an HTML
     * element contains a certain class.
     */
    checkClass: function(classNames, className) {
      var words = classNames.split(" ");
      var i;

      for (i=0; i<words.length; i++) {
        if (words[i] == className) {
          return true;
        }
      }
      return false;
    },

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

          canvas.className           = "formulaeditorinput";

          // set the style attributes that determine the look of the editor
          if (textarea.getAttribute("style") !== null && 
               textarea.getAttribute("style") !== undefined) {
            // same style as the textarea
            canvas.setAttribute("style", textarea.getAttribute("style"));
          } else if (org.mathdox.formulaeditor.options.inputStyle) {
            // textarea has no style use inputStyle option if available
            canvas.setAttribute("style",
                    org.mathdox.formulaeditor.options.inputStyle);
          } else {
            // textarea has no style and no inputStyle option available
            // set default style
            canvas.style.border        = "1px solid #99F";
            canvas.style.verticalAlign = "middle";
            canvas.style.cursor        = "text";
            canvas.style.padding       = "0px";
          }

          // insert canvas in the document before the textarea 
          textarea.parentNode.insertBefore(canvas, textarea);

          // Initialize the canvas. This is only needed in Internet Explorer,
          // where Google's Explorer Canvas library handles canvases.
          if (G_vmlCanvasManager) {
            canvas = G_vmlCanvasManager.initElement(canvas);
          }

        }

        // check whether a palette needs to be added
        this.showPalette = this.showPalette &&
          (this.checkClass(textarea.className, "mathdoxpalette") || 
          (!this.checkClass(textarea.className, "mathdoxnopalette") && 
            !palettes)
          );
        if (this.showPalette) { 
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

          // set the style attributes that determine the look of the palette
          if (org.mathdox.formulaeditor.options.paletteStyle) {
            // use paletteStyle option if available
            palcanvas.setAttribute("style",
                    org.mathdox.formulaeditor.options.paletteStyle);
          } else {
            // no paletteStyle option available -> set default style
            palcanvas.style.border        = "2px solid #99F";
            palcanvas.style.verticalAlign = "middle";
            palcanvas.style.cursor        = "text";
            palcanvas.style.padding       = "0px";
          }

          // set a classname so the user can extend the style
          palcanvas.className           = "formulaeditorpalette";

          // special case: dragable canvas TODO
          if (org.mathdox.formulaeditor.options.dragPalette !== undefined &&
            org.mathdox.formulaeditor.options.dragPalette === true) {
            // create root 
            var root = document.createElement("div");
            root.style.left = "50px";
            root.style.top = "50px";
            root.style.position = "relative";
	    root.style.backgroundColor = "white";

            // create handle
            var handle = document.createElement("div");

	    //if (palcanvas.style.borderTopColor !== undefined &&
	    //  palcanvas.style.borderTopColor !== null) {
            //  handle.style.backgroundColor = palcanvas.style.borderColor;
	    //} else {
            handle.style.backgroundColor = "red";
	    //};

            handle.style.width = "200px";
            handle.style.marginLeft = "50px";
            handle.style.height = "10px";

            // add root, handle and palette to the document
            textarea.parentNode.insertBefore(root, textarea);
            root.appendChild(handle);
            root.appendChild(palcanvas);

            // initialize dragging script
            Drag.init(handle, root);
          } else {
            // insert canvas in the document before the textarea 
            textarea.parentNode.insertBefore(palcanvas, textarea);
          }

          // Initialize the canvas. This is only needed in Internet Explorer,
          // where Google's Explorer Canvas library handles canvases.
          if (G_vmlCanvasManager) {
            palcanvas = G_vmlCanvasManager.initElement(palcanvas);
          }

          if (!palettes) {
            palettes = [];
          }
          this.palette = new org.mathdox.formulaeditor.Palette();
          palettes.push(this.palette);

          this.palette.initialize(palcanvas);
        }

        // hide the textarea XXX
        if (!this.checkClass(textarea.className, "mathdoxvisibletextarea")) {
          textarea.style.display = "none";
        }

        // register the textarea and a new mathcanvas
        this.textarea = textarea;
        this.canvas   = new MathCanvas(canvas);

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
        this.presentation = new Row(parsed.getPresentation({}));
        this.presentation.flatten();
      }
      catch(exception) {
        this.presentation = new Row();
      }

    },

    // TODO : move this to an onchange handler
    save : function() {

      var textarea = this.textarea;
      var openmathInfo = this.getOpenMath(true);

      // update the textarea
      if (org.mathdox.formulaeditor.options.indentXML && 
        org.mathdox.formulaeditor.options.indentXML === true) {
        textarea.value = this.indentXML(openmathInfo.value);
      } else {
        textarea.value = openmathInfo.value;
      }

      return { 
        success: openmathInfo.success,
        errorString: openmathInfo.errorString
      };
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
        if (event.keyCode == 116) {
          var Cursor    = org.mathdox.formulaeditor.Cursor;

          var saveResult = this.save();
          if (saveResult.success) {
            // formula can be parsed and transformed to OpenMath
            this.load();
            this.cursor = new Cursor(this.presentation.getFollowingCursorPosition());
            this.focus(); // XXX is this necessary ?
            this.redraw();
          } else {
            // formula cannot be parsed and transformed to OpenMath
            alert("The formula could not be interpreted correctly. "+
              "The error message was:\n"+saveResult.errorString);
          }

          return false;
        }
        this.focus(); // TODO: only necessary for crappy blinker implementation
        return this.cursor.onkeydown(event, this);
      }

    }, 
    decreaseSizes : function() {
      var i;
      for (i =0;i<palettes.length;i++) {
        if(palettes[i].canvas) {
          palettes[i].canvas.decreaseSize();
          palettes[i].redraw();
        }
      }
      for (i =0;i<editors.length;i++) {
        if(editors[i].canvas) {
          editors[i].canvas.decreaseSize();
          editors[i].redraw();
        }
      }
      return true;
    },
  
    increaseSizes : function() {
      var i;
      for (i=0;i<editors.length;i++) {
        if(editors[i].canvas) {
          editors[i].canvas.increaseSize();
          editors[i].redraw();
        }
      }
      for (i=0;i<palettes.length;i++) {
        if(palettes[i].canvas) {
          palettes[i].canvas.increaseSize();
          palettes[i].redraw();
        }
      }
      return true;
    },

    /**
     * Handles an onkeypress event from the browser. Returns false when the
     * event has been handled and should not be handled by the browser, returns
     * true otherwise.
     */
    onkeypress : function(event) {

      // forward the event to the cursor object when we have the focus
      if (this.hasFocus) {
        var result = true;
        if (event.ctrlKey) {
          switch(event.charCode) {
            case 43: // '+' larger
              this.increaseSizes();
              result = false;
              break;
            case 45: // '-' smaller
              this.decreaseSizes();
              result = false;
              break;
          }
        }
  
        this.focus(); // TODO: only necessary for crappy blinker implementation
        if (result) {
          result = this.cursor.onkeypress(event, this);
        }

        return result;
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

      var element;
      // MSIE provides the page offset in a different way *sigh*
      if (pageXOffset === null || pageXOffset === undefined) {
        element = document.documentElement;
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
      element = this.canvas.canvas;
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
      };
      blinkoff = function() {
        if (editor.hasFocus && (blinker == editor.blinker)) {
          editor.cursor.visible = false;
          editor.redraw();
          window.setTimeout(blinkon, 400);
        }
      };
      blinkon();

    },

    blur : function() {
      if (this.hasFocus) {
        // on losing focus save changes to ORBEON if ORBEON is around
        if (ORBEON) {
          ORBEON.xforms.Document.setValue(this.textarea.id, 
            this.textarea.value);
        }
      }
      this.hasFocus = false;
      this.cursor.visible = false;
    },

    getMathML : function() {
      var mmlstring;
      try {
        mmlstring = "<math xmlns=\"http://www.w3.org/1998/Math/MathML\">"+
          this.presentation.getSemantics().value.getMathML()+
          "</math>";
      }
      catch(exception) {
        mmlstring = "<math xmlns=\"http://www.w3.org/1998/Math/MathML\">"+
          "<mtext>"+exception.toString()+"</mtext></math>";
      }

      return mmlstring;
    },

    /**
     * getOpenMath()
     *
     * function to get the OpenMath value of the formula in the formulaeditor
     * returns the contents of the formulaeditor as an OpenMath string.
     * 
     * extended with optional argument returnErrorInfo (boolean). If true
     * an array is returned instead with entries: 
     * - value (the OpenMath string);
     * - success (a boolean, true if no error has occurred);
     * - errorString (the exception converted to a string, which might be shown
     *   to the user).
     *
     * Usually an error occurs when there is an error in the entered formula.
     */
    getOpenMath : function(returnErrorInfo) {
      var omstring;
      var errorInfo;
      var success;

      if (returnErrorInfo === null || returnErrorInfo === undefined) {
        returnErrorInfo = false;
      }

      try {
        omstring =
          "<OMOBJ xmlns='http://www.openmath.org/OpenMath' version='2.0' " +
          "cdbase='http://www.openmath.org/cd'>" +
          this.presentation.getSemantics().value.getOpenMath() +
          "</OMOBJ>";
        success = true;
        errorString = null;
      }
      catch(exception) {
        errorString = exception.toString();
        omstring =
          "<OMOBJ xmlns='http://www.openmath.org/OpenMath' version='2.0' " +
          "cdbase='http://www.openmath.org/cd'>" +
            "<OME>" +
              "<OMS cd='moreerrors' name='encodingError'/>" +
              "<OMSTR>invalid expression entered</OMSTR>" +
              errorString + 
            "</OME>" +
          "</OMOBJ>";
        success = false;
      }
      
      if (returnErrorInfo) {
        /* return information about whether an error did occur */
        return { 
          errorString : errorString,
          success: success,
          value: omstring
        };
      } else {
        return omstring;
      }
    },
    indentXML : function(str) {
      var buffer=[];     // buffer to prevent slow string concatenation
      var oldpos;        // old position in string (written up till here)
      var pos;                 // current position in string
      var l;                 // length
      var indent=0;         // current indenting
      var indentstr="  ";// indenting done for each step
      var child;         // true if a child tag exists inside this one
                               // set to true if a tag is closed
                         // set to false if a tag is opened

      // help function that does the indenting
      var doIndent = function() {
        var i;

        if (buffer.length>0) {
          buffer.push("\n");
        }
        for (i=indent;i>0;i--) {
          buffer.push(indentstr);
        }
      };

      l=str.length; // store the length in l;

      oldpos=0; // written up to 0

      while ((pos = str.indexOf('<',oldpos))>=0) {
        if (pos>oldpos) {
          /* 
            indenting is not desired for text inside tags, unless after a child
          */
          if (child === true) {
            doIndent();
          }
          buffer.push(str.substr(oldpos,pos-oldpos));
          oldpos=pos;
        }

        pos++;
        c = str[pos];
        switch(c) {
          case '/': // closing tag
            indent -= 1;
            if (indent<0) {
              // shouldn't happen
              indent=0;
            }
            /*
             * don't indent if the tag only contains text (so no other tags, no
             * comments and no CDATA)
             */
            if (child === true) {
              doIndent();
            }
            pos = str.indexOf('>',pos);
            if (pos<0) {
              //alert("couldn't find closing >");
              return buffer.join("")+str.substr(oldpos);
            }
            pos+=1;
            child = true;
            break;
          case '!': // comment or CDATA
            pos++;
            c = str[pos];
            switch(c) {
              case '[' : // CDATA 
                child = true;
                pos = str.indexOf(']]>',pos);
                if (pos<0) {
                  //alert("couldn't find closing ]]>");
                  return buffer.join("")+str.substr(oldpos);
                }
                pos+=3;

                doIndent();

                break;
              case '-' : // XML Comment
                child = true;
                pos = str.indexOf('-->',pos);
                if (pos<0) {
                  //alert("couldn't find closing -->");
                  return buffer.join("")+str.substr(oldpos);
                }
                pos+=3;

                doIndent();

                break;
              default: // failure to parse the string
                //alert("couldn't parse");
                return buffer.join("")+str.substr(oldpos);
            }
            break;

          default: // opening tag or directly closed tag
            pos = str.indexOf('>',pos);
            if (pos<0) {
              //alert("couldn't find >, was expecting one though");
              return buffer.join("")+str.substr(oldpos);
            }

            doIndent();
            
            // in case of an opening tag, increase indenting
            if (str[pos-1] !='/') {
              child = false;
              indent += 1;
            } else {
              child = true;
            }
            pos+=1;
            break;
        }
        buffer.push(str.substr(oldpos,pos-oldpos));
        oldpos = pos;
        
      }
      if (oldpos<str.length) {
        buffer.push(str.substr(oldpos));
      }
      
      return buffer.join("");
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

  };

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

  };


  /**
   * Class that represents a formula editor palette.
   */
  org.mathdox.formulaeditor.Palette = $extend(
    org.mathdox.formulaeditor.FormulaEditor, {

    // do nothing with a keydown
    onkeydown : function(event) {
      return true; 
    },
    // check for keypress (currently: zoom)
    onkeypress : function(event) {
      var result = true;

      if (event.ctrlKey) {
        switch(event.charCode) {
          case 43: // '+' larger
            this.increaseSizes();
            result = false;
            break;
          case 45: // '-' smaller
            this.decreaseSizes();
            result = false;
            break;
        }
      }

      return result; 
    },
    // handle a mouseclick
    onmousedown: function(event) {
      // check whether the mouse click falls in the canvas element
      var mouseinfo = this.mouseeventinfo(event);

      if (mouseinfo) {
        // we are clicked on
        var editor = org.mathdox.formulaeditor.FormulaEditor.getFocusedEditor();
        if (editor) {
          this.insertSymbolFromPalette(editor, 
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
      if (!canvas) {
        /* first initalization, do nothing yet */
        return null;
      }
     
      var MathCanvas = org.mathdox.formulaeditor.MathCanvas;
      if (arguments.length > 0 ) { 
        this.canvas = new MathCanvas(canvas);
      }
      // default presentation: empty
      this.presentation = new org.mathdox.formulaeditor.presentation.Row();

      var url;
      if (org.mathdox.formulaeditor.options.paletteURL) {
        url = org.mathdox.formulaeditor.options.paletteURL;
      } else {
              url = $baseurl+"org/mathdox/formulaeditor/palette.xml";
      }

      if (!org.mathdox.formulaeditor.Palette.description) {
        org.mathdox.formulaeditor.Palette.description = "loading";
        var xmlhttp = null;

        var onload = function() {
          if (xmlhttp.readyState!=4) {
            // only do something when fully loaded
            return;
          }

          org.mathdox.formulaeditor.Palette.description = xmlhttp.responseText;
            
          /* update palettes */
          for (var p=0; p<palettes.length; p++) {
            palettes[p].parseXMLPalette(org.mathdox.formulaeditor.Palette.description);
            palettes[p].draw();
          }
        };

        /// XMLHttp request data from http://www.w3schools.com/dom/dom_http.asp
        if (window.XMLHttpRequest) {
          // code for Firefox, Opera, IE7, etc.
          xmlhttp = new XMLHttpRequest();
        } else {
          // code for IE6, IE5
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (xmlhttp!==null) {
          xmlhttp.onreadystatechange = onload;
          xmlhttp.open("GET", url, true);
          xmlhttp.send(null);
        } else {
          alert("Your browser does not support XMLHTTP.");
        }
      } else if (org.mathdox.formulaeditor.Palette.description != "loading") {
        // set presentation and semantics
        this.parseXMLPalette(org.mathdox.formulaeditor.Palette.description);
        this.draw();
      }
    },
    initialize2 : function(canvas) {
      var MathCanvas = org.mathdox.formulaeditor.MathCanvas;
      if (arguments.length > 0 ) { 
        this.canvas = new MathCanvas(canvas);
      }
      var presentation = org.mathdox.formulaeditor.presentation;
      var pi = org.mathdox.formulaeditor.parsing.openmath.KeywordList["nums1__pi"];
      var semantics = org.mathdox.formulaeditor.semantics;

      var autocreate = function (createFun) {
        return autocreate2(createFun, createFun);
      };
      var autocreate2 = function(createFunDisplay,createFunInsert) {
        var obj = createFunDisplay(); 
        if (obj instanceof Array) {
          // in case of an array put it in a row for the palette, and add the
          // items one by one in insertCopy
          
          var row = new presentation.Row();
          row.initialize.apply(row, obj);
          row.insertCopy = function(position) {
            var toInsert = createFunInsert();
            
            if (toInsert === null) {
              return; // nothing to insert
            }

            var doinsert = function(node, removeEmpty) {
              var moveright = 
                position.row.insert(position.index, node, removeEmpty);
              if (moveright) {
                position.index++;
              }
            };
            var i;

            for (i=0;i<toInsert.length;i++) {
              if (toInsert[i] instanceof Row) {
                for (var j=0; j<toInsert[i].children.length; j++) {
                  doinsert(toInsert[i].children[j], ((i===0) && (j===0)) );
                }
              } else {
                doinsert(toInsert[i], (i === 0) );
              }
            }
          };
          obj = row;
        } else {
          obj.insertCopy = function(position) {
            var toInsert = createFunInsert();

            if (toInsert === null) {
              return; // nothing to insert
            }

            var moveright = 
              position.row.insert(position.index, toInsert);
            if (moveright) {
              position.index++;
            }
          };
        }
        return obj;
      };
      var empty = function() {
        var obj = new presentation.Symbol(" ");
        obj.insertCopy = function(position) { };
        return obj;
      };
      var autocreateOMA = function(cd, name) {
        var createFun = function() {
          return [ org.mathdox.formulaeditor.parsing.openmath.KeywordList[cd+"__"+name].getPresentation({}), new presentation.Symbol("("), null, 
            new presentation.Symbol(")")];
        };
        return autocreate(createFun);
      };
      var autocreateOMS = function(cd, name) {
        var createFun = function() {
          return org.mathdox.formulaeditor.parsing.openmath.KeywordList[cd+"__"+name].getPresentation({});
        };
        return autocreate(createFun);
      };
      var autocreateSymbol = function(symbol) {
        var createFun = function() {
          return new presentation.Symbol(symbol);
        };
        return autocreate(createFun);
      };
      var autocreateMatrix = function(n,m) {
        var rows = [];
        var i,j;
        for (i=0;i<n;i++) {
          var row = [];
          for (j=0;j<m;j++) {
            row.push(new presentation.Row(new presentation.BlockSymbol(",")));
          }
          rows.push(row);
        }
        var obj = new presentation.Matrix();
        obj.initialize.apply(obj, rows);

        obj.insertCopy = function(position) {
          var rows = [];
          var i,j;
          for (i=0;i<n;i++) {
            var row = [];
            for (j=0;j<m;j++) {
              row.push(new presentation.Row());
            }
            rows.push(row);
          }
          var mat = new presentation.Matrix();
          mat.initialize.apply(mat,rows);
          position.row.insert(position.index, mat);
          position.index++;
        };
        return obj;
      };
      var autocreateVector = function(size) {
        var i;
        var entries = [];
        for (i=0;i<size;i++) {
          entries.push(new presentation.Row(new presentation.BlockSymbol(",")));
        }
        var obj = new presentation.Vector();
        obj.initialize.apply(obj, entries);
        obj.insertCopy = function(position) {
          var entries = [];
          var i;
          for (i=0;i<size;i++) {
            entries.push(new presentation.Row());
          }
          var v = new presentation.Vector();
          v.initialize.apply(v,entries);
          position.row.insert(position.index, v);
          position.index++;
        };
        return obj;
      };
      var autocreateFromOpenMath = function(str) {
        var Parser    = 
          org.mathdox.formulaeditor.parsing.openmath.OpenMathParser;
        var Row       = org.mathdox.formulaeditor.presentation.Row;
        var createFun = function(context) {
          var presentation;
          
          // read any OpenMath code that may be present in str
          //try {
            var parsed = new Parser().parse(str);
            presentation = parsed.getPresentation(context);
            // result is a row, get the children ?
            // not for a vector !
            if ((presentation instanceof 
              org.mathdox.formulaeditor.presentation.Row) && 
              presentation.children) {

              presentation = presentation.children;
            }
          //}
          //catch(exception) {
          //  presentation = [null];
          //}
        
          return presentation;
        };
        var createFunDisplay = function() {
          return createFun({
            inPalette:true  // inside a palette
          });
        };
        var createFunInsert = function() {
          return createFun({});
        };

        return autocreate2(createFunDisplay,createFunInsert);
      };

      // create o/o 
      var createFrac = function() {
        return new presentation.Fraction(new presentation.Row(), 
          new presentation.Row());
      };
      // create o^o
      var createPower = function() {
        return [null, new presentation.Superscript(new presentation.Row())];
      };
      // create |o|
      var createAbs = function() {
        return [new presentation.Symbol("|"), null, 
          new presentation.Symbol("|")];
      };
      // create o!
      var createFac = function() {
        return [null, new presentation.Symbol("!")];
      };
      // create e^o
      var createEPower = function() {
        return [autocreateOMS("nums1","e"), new presentation.Superscript(
          new presentation.Row())];
      };
      var createRoot = function() { 
        return [new presentation.Root(new presentation.Row(), 
          new presentation.Row())];
      };
      var createRoot2 = function() { 
        return [new presentation.Root(new presentation.Row(
          new presentation.Row()), new presentation.Row(
            new semantics.Integer(2).getPresentation({})))];
      };
      var createList = function() { 
        return [new presentation.Symbol("{"), null, 
          new presentation.Symbol("}")];
      };
      // create a PArray
      this.presentation = new presentation.PArray(
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
          autocreate(createRoot2)
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
          autocreate(createRoot)
        ],
        [ autocreateOMS("nums1","pi"),
          autocreateOMS("nums1","e"),
          autocreateOMS("nums1","i"),
          autocreateOMS("nums1","infinity"),
          autocreateFromOpenMath("<OMOBJ><OMS cd='editor1' name='input_box'/></OMOBJ>"),
          autocreateOMA("transc1", "tan"),
          autocreateMatrix(2,2),
          autocreate(createList)
        ],
        [ autocreate(createFrac), 
          autocreate(createPower),
          autocreate(createAbs),
          autocreate(createFac),
          autocreate(createEPower),
          autocreateOMA("transc1", "ln"),
          autocreateMatrix(2,3),
          empty()
        ]
      );
      this.presentation.margin = 10.0;
      this.draw();
    },
    insertSymbolFromPalette: function(editor,x,y) {
      var position = editor.cursor.position;
      var pArray = this.presentation.children[0];
      var coords = pArray.getCoordinatesFromPosition(x,y);
      var row = this.semantics.operands[coords.row].operands[coords.col];

      var presentation = org.mathdox.formulaeditor.presentation;
      var rowPresentation = new presentation.Row(row.getPresentation({}));
      rowPresentation.flatten();

      var moveright;
      if (rowPresentation.children) {
        for (var i=0;i<rowPresentation.children.length;i++) {
          //alert("inserting: "+i+" : "+toInsert.children[i]);

          moveright = position.row.insert(position.index, 
            rowPresentation.children[i], (i === 0));
          if (moveright) {
            position.index++;
          }
        }
      } else {
        moveright = position.row.insert(
          position.index, rowPresentation, true);

        if (moveright) {
          position.index++;
        }
      }
      editor.redraw();
      editor.save();
    },
    parseXMLPalette : function(XMLstr) {
      var presentation;
      var Parser    = org.mathdox.formulaeditor.parsing.openmath.OpenMathParser;
      var Row       = org.mathdox.formulaeditor.presentation.Row;

      // read any OpenMath code that may be present in the textarea
      //try {
        this.semantics = new Parser().parse(XMLstr);
        presentation = new Row(this.semantics.getPresentation({}));
        presentation.flatten();
        this.presentation = presentation;
        this.presentation.margin = 10.0;
      //}
      //catch(exception) {
      //  presentation = new Row();
      //}

      return presentation;
    }

  });

  /**
   * When the document has finished loading, replace all textarea elements of
   * class 'mathdoxformula' with a formula editor.
   */

  // function that will be called upon loading
  var onload = function() {

    // replace all textarea's of class 'mathdoxformula' with editors
    var textareas = document.getElementsByTagName("textarea");
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
        var editor = new org.mathdox.formulaeditor.FormulaEditor(textarea);

      }

    }

    // register key and mouse handlers that forward events to the editors
    var Handler = $extend(org.mathdox.formulaeditor.EventHandler, {

      onkeydown : function(event) {
        var result = true;
        for (var i=0; i<editors.length; i++) {
          var intermediate = editors[i].onkeydown(event);
          if (intermediate !== null && intermediate !== undefined &&
              intermediate === false) {
            result = false;
          }
        }
        return result;
      },

      onkeypress : function(event) {
        var result = true;

        for (var i=0; i<editors.length; i++) {
          var intermediate = editors[i].onkeypress(event);
          if (intermediate !== null && intermediate !== undefined && 
              intermediate === false) {
            result = false;
          }
        }
        return result;
      },

      onmousedown : function(event) {
        var result = true;
        var i; // counter
        if (palettes) {
          for (i=0;i<palettes.length;i++) {
            if (result) {
              result = result && palettes[i].onmousedown(event);
            }
          }
        }
        if (result) {
          // if not handled by palettes, then continue
          for (i=0; i<editors.length; i++) {
            var intermediate = editors[i].onmousedown(event);
            if (intermediate !== null && intermediate !== undefined &&
                intermediate === false) {
              result = false;
            }
          }
          return result;
        }
      }
    });
    var handler = new Handler();
  };

  // register the onload function as an event handler
  if (window.addEventListener) {

    // use the W3C standard way of registering event handlers
    if (org.mathdox.formulaeditor.hasLoaded) {
      onload();
    } else {
      window.addEventListener("load", onload, false);
    }
  } else {

    // document.body might not exist yet, if it doesn't call the check function
    // with a 50 ms delay (fixes a bug)
    
    var bodyChecker;

    bodyChecker = function() {
      if (!document.body) {
        setTimeout(bodyChecker,50);
      } else {
        if (document.body.attachEvent) {
          // use the MSIE-only way of registering event handlers
          if (document.readyState == "complete") {
            onload();
          } else {
            document.body.attachEvent("onload", onload);
          }
        } 
      }
    };
    bodyChecker();
  }

});

org.mathdox.formulaeditor.hasLoaded = false;

if (window.addEventListener) {
  var setLoaded = function() {
    org.mathdox.formulaeditor.hasLoaded = true;
  };

  // use the W3C standard way of registering event handlers
  window.addEventListener("load", setLoaded, false);
}
