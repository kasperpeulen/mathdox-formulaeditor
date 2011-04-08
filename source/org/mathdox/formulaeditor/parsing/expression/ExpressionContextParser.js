$package("org.mathdox.formulaeditor.parsing.expression");

$identify("org/mathdox/formulaeditor/parsing/expression/ExpressionContextParser.js");

$require("org/mathdox/parsing/Parser.js");
$require("org/mathdox/parsing/ParserGenerator.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionParser.js");
$require("org/mathdox/formulaeditor/parsing/expression/KeywordList.js");
$require("org/mathdox/formulaeditor/presentation/Subscript.js");
$require("org/mathdox/formulaeditor/semantics/FunctionApplication.js");
$require("org/mathdox/formulaeditor/semantics/Integer.js");
$require("org/mathdox/formulaeditor/semantics/SemanticFloat.js");
$require("org/mathdox/formulaeditor/semantics/Variable.js");

$main(function() {

    var ExpressionParser = org.mathdox.formulaeditor.parsing.expression.ExpressionParser;
    var functions = new Array();

    org.mathdox.formulaeditor.parsing.expression.ExpressionContextParser =
      $extend(Object, {
        getParser : function(context) {
          var i;

          if (context === null || context === undefined) {
	    context = this.getContext();
	  }

	  if (context.parser === undefined) {

            var parser = ExpressionParser;

            for (i=0;i<functions.length;i++) {
              parser = $extend(parser, functions[i](context));
            }

	    context.parser = parser;
	  }

	  return context.parser;
        }
      });

    org.mathdox.formulaeditor.parsing.expression.ExpressionContextParser.addFunction = function(fun) {
      functions.push(fun);
    };
    
    org.mathdox.formulaeditor.parsing.expression.ExpressionContextParser.defaultContext = new Object();

    org.mathdox.formulaeditor.parsing.expression.ExpressionContextParser.getContext = function() {
      if (org.mathdox.formulaeditor.options.contextParsingExpression === undefined) {
        org.mathdox.formulaeditor.options.contextParsingExpression = 
          org.mathdox.formulaeditor.parsing.expression.ExpressionContextParser.defaultContext;
      }

      return org.mathdox.formulaeditor.options.contextParsingExpression;
    };
}

);
