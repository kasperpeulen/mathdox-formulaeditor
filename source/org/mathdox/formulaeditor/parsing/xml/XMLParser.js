$package("org.mathdox.formulaeditor.parsing.xml");

$identify("org/mathdox/formulaeditor/parsing/xml/XMLParser.js");

var SAXDriver;
$require("net/sf/xmljs/xmlsax.js", function() { return SAXDriver; });

var DOMImplementation;
$require("net/sf/xmljs/xmlw3cdom.js", function() { return DOMImplementation; });

$main(function(){

  org.mathdox.formulaeditor.parsing.xml.XMLParser = $extend(Object, {

    name: "XMLParser",

    /**
     * Parses the supplied OpenMath xml, and returns a
     * org.mathdox.formulaeditor.semantics.Node.
     */
    parse: function(xml, context) {

      var rootnode = new DOMImplementation().loadXML(xml).getDocumentElement();

      /* remove comment nodes, since we don't want to parse them */
      if (rootnode !== null) {
        this.removeComments(rootnode);
      } else {
        return null;
      }
      
      /* do the actual parsing */
      if (rootnode !== null) {
        return this.handle(rootnode, context);
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
    handle: function(node, context) {
      if (node.getLocalName()==="") {
        // XML comment
        return null;
      }

      var handler = "handle" + node.getLocalName();

      if (handler in this) {
	if (context !== null && context!== undefined) {
          return this[handler](node, context);
	} else {
          return this[handler](node);
	}
      }
      else {
        throw new Error( this.name+" doesn't know how to handle this "+
            "node: " + node +". INFO: 1.");
      }

    },

    /**
     * Removes all comment nodes from a DOM XML tree
     */
    removeComments: function(node) {
      var children = node.getChildNodes();

      for (var i=children.length - 1; i>=0; i--) {
        var child = children.item(i);

        if (child) {
          if (child.getNodeType() == DOMNode.COMMENT_NODE) {
            node.removeChild(child);
          } else if (child.hasChildNodes()) {
            this.removeComments(child);
          }
        }
      }
    }

  });

});
