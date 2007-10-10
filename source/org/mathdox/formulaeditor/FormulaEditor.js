$package("org.mathdox.formulaeditor");

$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/Canvas.js");
$require("org/mathdox/formulaeditor/MathCanvas.js");
$require("org/mathdox/formulaeditor/Cursor.js");
$require("org/mathdox/formulaeditor/EventHandler.js");

$require("org/mathdox/formulaeditor/modules/arithmetic/divide.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/gcd.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/lcm.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/minus.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/plus.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/power.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/times.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/unaryminus.js");
$require("org/mathdox/formulaeditor/modules/relations/equality.js");

$main(function(){

  /**
   * Maintain a list of all formula editors that are initialized.
   */
  var editors = [];

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

        // hide the textarea
        textarea.style.display = "none";

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
      try {
        textarea.value =
          "<OMOBJ xmlns='http://www.openmath.org/OpenMath' version='2.0' " +
          "cdbase='http://www.openmath.org/cd'>" +
          this.presentation.getSemantics().value.getOpenMath() +
          "</OMOBJ>"; // TODO: parse until the end
      }
      catch(exception) {
        textarea.value =
          "<OMOBJ xmlns='http://www.openmath.org/OpenMath' version='2.0' " +
          "cdbase='http://www.openmath.org/cd'>" +
            "<OME>" +
              "<OMS cd='moreerrors' name='encodingError'/>" +
              "<OMSTR>invalid expression entered</OMSTR>" +
            "</OME>" +
          "</OMOBJ>";
      }

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
     * Handles an onmousedown event from the browser. Returns false when the
     * event has been handled and should not be handled by the browser, returns
     * true otherwise.
     */
    onmousedown : function(event) {

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
        this.focus();
        // forward the mouse click to the cursor object
        return this.cursor.onmousedown(event, this, mouseX-x, mouseY-y);
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
    }

  });

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
        for (var i=0; i<editors.length; i++) {
          var intermediate = editors[i].onmousedown(event);
          if (intermediate != null && intermediate == false) {
            result = false;
          }
        }
        return result;
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

});