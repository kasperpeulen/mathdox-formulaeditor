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
          var parser = ExpressionParser;

          for (i=0;i<functions.length;i++) {
            parser = $extend(parser, functions[i](context));
          }
          return parser;
        }
      });

    org.mathdox.formulaeditor.parsing.expression.ExpressionContextParser.addFunction = function(fun) {
      functions.push(fun);
    };

  }

);
