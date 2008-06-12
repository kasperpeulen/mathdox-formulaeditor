$identify("org/mathdox/formulaeditor/OrbeonForms.js");

$require("org/mathdox/formulaeditor/FormulaEditor.js");

var ORBEON;

$main(function(){

  if (ORBEON && ORBEON.xforms && ORBEON.xforms.Document) {

    /**
     * Extend the save function of the formula editor to use the orbeon update
     * mechanism, see also:
     * http://www.orbeon.com/ops/doc/reference-xforms-2#xforms-javascript
     */
    org.mathdox.formulaeditor.FormulaEditor =
      $extend(org.mathdox.formulaeditor.FormulaEditor, {

        save : function() {

          // call the parent function
          arguments.callee.parent.save.apply(this, arguments);

          // let orbeon know about the change of textarea content
          var textarea = this.textarea;
          if (textarea.id) {
            ORBEON.xforms.Document.setValue(textarea.id, textarea.value);
          }

        }

    })

    /**
     * Override Orbeon's xformsHandleResponse method so that it initializes any
     * canvases that might have been added by the xforms engine.
     */
    var oldXformsHandleResponse = xformsHandleResponse;
    xformsHandleResponse = function(request) {

      // call the overridden method
      oldXformsHandleResponse.apply(this, arguments);

      // go through all canvases in the document
      var canvases = document.getElementsByTagName("canvas");
      for (var i=0; i<canvases.length; i++) {

        // initialize a FormulaEditor for each canvas
        var canvas = canvases[i];
        if (canvas.nextSibling) {
          if (canvas.nextSibling.tagName.toLowerCase() == "textarea") {

            var FormulaEditor = org.mathdox.formulaeditor.FormulaEditor;
            var editor = new FormulaEditor(canvas.nextSibling, canvas);

            // (re-)load the contents of the textarea into the editor
            editor.load();

          }

        }

      }
      
    }


  }

})
