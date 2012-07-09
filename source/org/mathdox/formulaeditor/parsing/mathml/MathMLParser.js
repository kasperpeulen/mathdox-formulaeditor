$package("org.mathdox.formulaeditor.parsing.mathml");

$identify("org/mathdox/formulaeditor/parsing/mathml/MathMLParser.js");

//$require("org/mathdox/formulaeditor/parsing/mathml/KeywordList.js");
//$require("org/mathdox/formulaeditor/parsing/mathml/VariableList.js");
$require("org/mathdox/formulaeditor/parsing/xml/XMLParser.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");
$require("org/mathdox/formulaeditor/presentation/Symbol.js");

$main(function(){

  org.mathdox.formulaeditor.parsing.mathml.MathMLParser = 
      $extend(org.mathdox.formulaeditor.parsing.xml.XMLParser, {
    
    name: "MathMLParser",

    handlemath: function(node, context) {
      var child = node.getFirstChild();
      var parsed;

      if (child !== null) {
        parsed = this.handle(child, context);
      }
      else {
        parsed = null;
      }
      var presentation = org.mathdox.formulaeditor.presentation;

      return new presentation.Row(parsed);
    },

    handleTextNode: function(node, context) {
      var presentation = org.mathdox.formulaeditor.presentation;

      // use ""+... to force casting to string
      var value = ""+node.getFirstChild().getNodeValue();

      var row = new presentation.Row(value);
      return row;
    },
    handlemi: function(node, context) {
      return this.handleTextNode(node, context);
    },
    handlemn: function(node, context) {
      return this.handleTextNode(node, context);
    },
    handlemo: function(node, context) {
      return this.handleTextNode(node, context);
    }
  });

});
