$package("org.mathdox.formulaeditor.parsing.openmath");

$identify("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");

$require("org/mathdox/formulaeditor/parsing/openmath/KeywordList.js");
$require("org/mathdox/formulaeditor/semantics/FunctionApplication.js");
$require("org/mathdox/formulaeditor/semantics/Integer.js");
$require("org/mathdox/formulaeditor/semantics/SemanticFloat.js");
$require("org/mathdox/formulaeditor/semantics/Variable.js");

var SAXDriver;
$require("net/sf/xmljs/xmlsax.js", function() { return SAXDriver; });

var DOMImplementation;
$require("net/sf/xmljs/xmlw3cdom.js", function() { return DOMImplementation; });

$main(function(){

  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser = $extend(Object, {

    /**
     * Parses the supplied OpenMath xml, and returns a
     * org.mathdox.formulaeditor.semantics.Node.
     */
    parse: function(xml) {

      var rootnode = new DOMImplementation().loadXML(xml).getDocumentElement();
      if (rootnode != null) {
        return this.handle(rootnode);
      }
      else {
        return null;
      }

    },

    /**
     * Extracts the local name of the node, and uses that to figure out which
     * method should be called to handle this node. For instance, when an
     * <OMI> node is encountered, the handleOMI method is called.
     */
    handle: function(node) {

      var handler = "handle" + node.getLocalName();

      if (handler in this) {
        return this[handler](node);
      }
      else {
        throw new Error(
          "OpenMathParser doesn't know how to handle this node: " + node
        );
      }

    },

    /**
     * Handles an <OMOBJ> node by processing its child node.
     */
    handleOMOBJ: function(node) {

      var child = node.getFirstChild();
      if (child != null) {
        return this.handle(child);
      }
      else {
        return null;
      }

    },

    /**
     * Handle an <OMA> node.
     */
    handleOMA: function(node) {
      var symbol;

      // handle <OMA>'s with as first argument an <OMS/>
      if ("OMS" == node.getFirstChild().getLocalName()) {

        // helper function that uppercases first character of provided string
        var uppercase = function(string) {
            return string.substring(0,1).toUpperCase() + string.substring(1);
        }

        // figure out which handler method to call; for instance, for handling 
        // an <OMA> with as first argument <OMS cd='arith1' name='plus'/>, the
        // handleArith1Plus method is called
        var symbolname= node.getFirstChild().getAttribute("cd") + "__" + node.getFirstChild().getAttribute("name");

        var handler = "handle";

        handler += uppercase(node.getFirstChild().getAttribute("cd"));
        handler += uppercase(node.getFirstChild().getAttribute("name"));

        // call the handler method
        if (handler in this) {
          return this[handler](node);
        } else if (org.mathdox.formulaeditor.parsing.openmath.KeywordList[symbolname]!=null) {
	  /* return a FunctionApplication at the end */
          symbol = this.handleOMS(node.getFirstChild());
        } else {
            throw new Error(
              "OpenMathParser doesn't know how to handle this node: " + node
            );
        }

      } else if ("OMV" == node.getFirstChild().getLocalName()) {
	/* return a FunctionApplication at the end */
        symbol = this.handleOMV(node.getFirstChild());
      } else {
	throw new Error(
          "OpenMathParser doesn't know how to handle an <OMA> that does " +
          "not have an <OMS/> or <OMV/> as first argument"
        );

      }

      if (symbol) {
        var children = node.getChildNodes();
        var operands = new Array(children.getLength()-1);

        for (var i=1; i<children.length; i++) {
          operands[i-1] = this.handle(children.item(i))
        }
        
        with(org.mathdox.formulaeditor.semantics) {
          return new FunctionApplication(symbol, operands);
	}
      }
    },

    /**
     * Handles an <OMBIND> node by pretending its an <OMA> node.
     */
    handleOMBIND: function(node) {

      return this.handleOMA(node);

    },

    /**
     * Ignores an <OMBVAR> node.
     */
    handleOMBVAR: function(node) {

      return this.handle(node.getFirstChild());

    },

    /**
     * Handles an <OMF> node.
     */
    handleOMF: function(node) {

      with(org.mathdox.formulaeditor.semantics) {
	if (node.getAttribute("dec"))
	  return new SemanticFloat(node.getAttribute("dec"));
      }

    },

    /**
     * Handles an <OMI> node.
     */
    handleOMI: function(node) {

      with(org.mathdox.formulaeditor.semantics) {
        return new Integer(node.getFirstChild().getNodeValue());
      }

    },

    /**
     * Handles an <OMS> node that is translated to a symbol without arguments
     */
    handleOMS: function(node) {
      var symbolname= node.getAttribute("cd") + "__" + node.getAttribute("name");

      if (org.mathdox.formulaeditor.parsing.openmath.KeywordList[symbolname]!=null) {
        return org.mathdox.formulaeditor.parsing.openmath.KeywordList[symbolname]
      } else {
        throw new Error(
          "OpenMathParser doesn't know how to handle this node: " + node + " when it is not first in an <OMA>."
        );
      }
    },

    /**
     * Handles an <OMV> node.
     */
    handleOMV: function(node) {

      with(org.mathdox.formulaeditor.semantics) {
        return new Variable(node.getAttribute("name"));
      }

    }

  })

});
