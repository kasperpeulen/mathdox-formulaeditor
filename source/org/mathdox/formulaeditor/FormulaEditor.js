$package("org.mathdox.formulaeditor");

$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/Canvas.js");
$require("org/mathdox/formulaeditor/MathCanvas.js");
$require("org/mathdox/formulaeditor/Cursor.js");

$require("org/mathdox/formulaeditor/modules/arithmetic/plus.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/minus.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/times.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/divide.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/power.js");

$main(function(){

  /**
   * A formula editor that can be used to replace a textarea.
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
     * Hides the specified textarea and replaces it by a canvas that will be
     * used for rendering formulae.
     */
    initialize : function(textarea) {

      var Cursor    = org.mathdox.formulaeditor.Cursor;
      var MathCanvas = org.mathdox.formulaeditor.MathCanvas;
      var Parser    = org.mathdox.formulaeditor.parsing.openmath.OpenMathParser;
      var Row       = org.mathdox.formulaeditor.presentation.Row;

      // create an HTML canvas
      var htmlcanvas;
      htmlcanvas = document.createElement("canvas");
      htmlcanvas.style.border  = "1px solid #99F";
      htmlcanvas.style.verticalAlign = "middle";
      
      // insert canvas into the document before the textarea and hide the latter
      textarea.parentNode.insertBefore(htmlcanvas, textarea);
      textarea.style.display = "none";

      // Initialize the canvas. This is only needed in Internet Explorer,
      // where Google's Explorer Canvas library handles canvases.
      if (G_vmlCanvasManager) {
        htmlcanvas = G_vmlCanvasManager.initElement(htmlcanvas);
      }

      // register the textarea and a new mathcanvas
      this.textarea = textarea;
      this.canvas   = new MathCanvas(htmlcanvas);

      // read any OpenMath code that may be present in the textarea
      try {
        var parsed = new Parser().parse(textarea.value);
        this.presentation = new Row(parsed.getPresentation());
        this.presentation.flatten();
      }
      catch(exception) {
        this.presentation = new Row();
      }

      // initialize the cursor, and draw the presentation tree
      this.cursor = new Cursor(this.presentation.getFollowingCursorPosition());
      this.draw();

      // save the 'this' pointer, so it can be used in key handling below
      var editor = this;

      // handle command keys
      document.onkeydown = function(event) {

        // the Internet Explorer way (non-standard, of course) of
        // getting the event object
        if (!event) {
          event = window.event
        };

        // let the cursor object handle the event
        return editor.cursor.onkeydown(event, editor);

      }

      // handle non-command keys
      document.onkeypress = function(event) {

        // the Internet Explorer way (non-standard, of course) of
        // getting the event object
        if (!event) {
          event = window.event
        };

        // Internet Explorer does not set the charCode attribute, but the
        // keyCode attribute
        if (!("charCode" in event)) {
          event.charCode = event.keyCode;
        }

        // let the cursor object handle the event
        return editor.cursor.onkeypress(event, editor);

      }

    },

    save : function() {

      // update the text field
      try {
        this.textarea.value =
          "<OMOBJ xmlns='http://www.openmath.org/OpenMath' version='2.0' " +
          "cdbase='http://www.openmath.org/cd'>" +
          this.presentation.getSemantics().value.getOpenMath() +
          "</OMOBJ>";
      }
      catch(exception) {
        this.textarea.value =
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
    }

  });

  /**
   * When the document has finished loading, replace all textarea elements of
   * class 'mathdoxformula' with a formula editor.
   */

  // function that will be called upon loading
  var onload = function() {

    // go through all textareas
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

  }

  // register the function as an event handler
  if (window.addEventListener) {

    // use the W3C standard way of registering event handlers
    window.addEventListener("load", onload, false)

  }
  else if (document.body.attachEvent){

    if (document.readyState == "complete") {
      onload();
    }
    else {
      // use the MSIE-only way of registering event handlers
      document.body.attachEvent("onload", onload);
    }

  }

});