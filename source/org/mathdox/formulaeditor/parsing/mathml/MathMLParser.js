$package("org.mathdox.formulaeditor.parsing.mathml");

$identify("org/mathdox/formulaeditor/parsing/mathml/MathMLParser.js");

//$require("org/mathdox/formulaeditor/parsing/mathml/KeywordList.js");
//$require("org/mathdox/formulaeditor/parsing/mathml/VariableList.js");
$require("org/mathdox/formulaeditor/parsing/xml/XMLParser.js");
$require("org/mathdox/formulaeditor/presentation/Root.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");
$require("org/mathdox/formulaeditor/presentation/Symbol.js");

$main(function(){

  org.mathdox.formulaeditor.parsing.mathml.MathMLParser = 
      $extend(org.mathdox.formulaeditor.parsing.xml.XMLParser, {
    
    name: "MathMLParser",

    /* main handle function */
    handlemath: function(node, context) {
      return this.handlemrow(node, context);
    },

    /** 
     * artificial handle functions, not called by tags, 
     * but as helper functions 
     */
    handleTextNode: function(node, context, style) {
      // TODO:
      // - create symbols here
      // - use style option
      // - ignore some symbols
      // - what to do with symbols that can't be shown
      var presentation = org.mathdox.formulaeditor.presentation;

      // use ""+... to force casting to string
      var value = ""+node.getFirstChild().getNodeValue();

      var row = new presentation.Row(value);
      return row;
    },

    /* 1 attribute is expected, if more are present an mrow is inferred, handle it as such.*/
    handleInferredMrow: function(node, context) {
      var children = node.getChildNodes();

      if (children.length != 1) {
        return this.handlemrow(node, context);
      } else {
        return this.handle(children.item(0));
      }
    },

    /** 
     * order based on mathml specs, in groups: token elements, general layout
     * schemata, script and limit schemata, tabular math, elementary math, enlivening expressions
     */
    /* 3.2 token elements */
    /* token math:mi */
    handlemi: function(node, context) {
      // TODO: check for keywords and do not style them math
      // or use layout information
      return this.handleTextNode(node, context, "math");
    },
    /* token math:mn */
    handlemn: function(node, context) {
      return this.handleTextNode(node, context);
    },
    /* token math:mo */
    handlemo: function(node, context) {
      return this.handleTextNode(node, context);
    },

    /* token math:ms */
    handlems: function(node, context) {
      var presentation = org.mathdox.formulaeditor.presentation;
      return new presentation.Row(new presentation.Symbol("\""), this.handleTextNode(node, context), 
	new presentation.Symbol("\""));
    },

    /* token math:mspace */
    handlemspace: function(node, context) {
      return null;
    },
    /* token math:mtext */
    handlemtext: function(node, context) {
      return this.handleTextNode(node, context);
    },
    /** 
     * generaa layout schemata
     *
     * supported elements:
     * mrow, mfrac, msqrt, mroot, mstyle(*), merror(*), mpadded(*),
     * mphantom(**), mfenced, menclose(*)
     *
     * notes: 
     *  * treated as mrow
     *  ** returns null
     */

    /* general layout : math:mrow */
    handlemrow: function(node, context) {
      var children = node.getChildNodes();
      var entries = [];
      var presentation = org.mathdox.formulaeditor.presentation;

      for (var i=0; i<children.length; i++) {
        var child = this.handle(children.item(i), context);

        if (child !== null) { 
          // ignore comments
          entries.push(child);
        }
      }

      var row = new presentation.Row();
      row.initialize.apply(row, entries);
      return row;
    },

    /* general layout : math:mfrac */
    handlemfrac: function(node, context) {
      var children = node.getChildNodes();
      var entries = [];
      var presentation = org.mathdox.formulaeditor.presentation;

      for (var i=0; i<children.length; i++) {
        var child = this.handle(children.item(i), context);

        entries.push(child);
      }

      return new presentation.Fraction(entries[0], entries[1]);
    },    

    /* general layout : math:sqrt */
    handlemsqrt: function(node, context) {
      var presentation = org.mathdox.formulaeditor.presentation;
      
      var index = this.handleInferredMrow(node, context);
      var base = new presentation.Row("2");

      return new presentation.Root(index, base);
    },

    /* general layout : math:mroot */
    handlemroot: function(node, context) {
      var children = node.getChildNodes();

      var base = this.handle(children.item(0), context);
      var index = this.handle(children.item(1), context);

      var presentation = org.mathdox.formulaeditor.presentation;

      return new presentation.Root(index, base);
    },

    /*
     * general layout : math:mstyle 
     * currently : ignore, treat as row
     */
    handlemstyle: function(node, context) {
      return this.handlemrow(node, context);
    },

    /*
     * general layout : math:merror 
     * currently : ignore, treat as row
     */
    handlemerror: function(node, context) {
      return this.handlemrow(node, context);
    },

    /*
     * general layout : math:mpadded 
     * currently : ignore, treat as row
     */
    handlempadded: function(node, context) {
      return this.handlemrow(node, context);
    },

    /*
     * general layout : math:mphantom 
     * currently : return null
     */
    handlempadded: function(node, context) {
      return this.handlemrow(node, context);
    },

    /*
     * general layout : math:mphantom 
     */
    handlemfenced: function(node, context) {
      var opensymbol = node.getAttribute("open");
      var closesymbol = node.getAttribute("close");
      var separators = node.getAttribute("separators");
      var children = node.getChildNodes();

      var presentation = org.mathdox.formulaeditor.presentation;
      var entries = [];

      if (opensymbol === null || opensymbol === undefined) {
	opensymbol = '(';
      } 
      entries.push(new presentation.Symbol(opensymbol));
      
      if (separators === null || separators === undefined) {
	separators = ',';
      } else {
        // remove spaces
      }

      // for each child : add child and possibly separator
      for (var i = children.length - 1; i>=0; i--) {
        if (i>0) {
	  // add separator
	}
      }

      if (closesymbol === null || closesymbol === undefined) {
	closesymbol = ')';
      } 
      entries.push(new presentation.Symbol(closesymbol));
    },

    /*
     * general layout : math:menclose 
     * currently : ignore, treat as row
     */
    handlemenclose: function(node, context) {
      return this.handlemrow(node, context);
    }

  });

});