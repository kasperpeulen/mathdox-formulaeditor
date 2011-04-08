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

    var ExpressionParser = new org.mathdox.formulaeditor.parsing.expression.ExpressionParser;

    org.mathdox.formulaeditor.parsing.expression.ExpressionContextParser =
      $extend(Object, {
        functions : new Array(),
        parser : new ExpressionParser(),
        
        addFunction : function(fun) {
          functions.push(fun);
        },

        getParser : function(context) {
          var i;

          for (i=0;i<functions.length;i++) {
            var result = functions[i](context);

          }
        }
      });

  }

);
