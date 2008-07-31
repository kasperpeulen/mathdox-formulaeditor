$identify("org/mathdox/formulaeditor/modules/editor1/input_box.js");

$require("org/mathdox/formulaeditor/semantics/Keyword.js");
$require("org/mathdox/formulaeditor/parsing/expression/KeywordList.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");
$require("org/mathdox/formulaeditor/parsing/openmath/KeywordList.js");
$require("org/mathdox/parsing/ParserGenerator.js");

$main(function(){

  with (org.mathdox.formulaeditor.semantics) {
    /**
     * Define a semantic tree node that represents the 
     * editor1.input_box keyword.
     */
    var cd = "editor1";
    var name = "input_box";
    var symbol = { 
      // U+25A1 white square
      onscreen: "□", 
      openmath : null, // use default with model:cd and model:name
      // U+25A1 white square
      mathml : "<mi>□</mi>"
    };
  
    org.mathdox.formulaeditor.parsing.expression.KeywordList["input_box"] = new Keyword(cd, name, symbol, "constant");
  
    // U+25A1 white square
    if ( "input_box" != "□" ) {
      // U+25A1 white square
      org.mathdox.formulaeditor.parsing.expression.KeywordList["□"] = new Keyword(cd, name, symbol, "constant");
    }
  
    org.mathdox.formulaeditor.parsing.openmath.KeywordList["editor1__input_box"] = new Keyword(cd, name, symbol, "constant");
  }
});
