$identify("org/mathdox/formulaeditor/modules/complex1/complex_cartesian.js");

$require("org/mathdox/formulaeditor/parsing/expression/ExpressionContextParser.js");
$require("org/mathdox/formulaeditor/parsing/openmath/KeywordList.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/semantics/Keyword.js");
$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/modules/arith1/plus.js");
$require("org/mathdox/formulaeditor/modules/arithmetic/times.js");
$require("org/mathdox/formulaeditor/modules/keywords.js");

$main(function(){
  /**
   * Extend the OpenMathParser object with parsing code for arith1.times.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a Times object based on the OpenMath node.
       */
      handleComplex1Complex_cartesian : function(node, style) {

        var semantics = org.mathdox.formulaeditor.semantics;
        // parse the children of the OMA
        var children = node.getChildNodes();

        var realpart = this.handle(children.item(1));

        var complexI = org.mathdox.formulaeditor.parsing.openmath.KeywordList["nums1__i"];

        var complexpart = new semantics.Times(this.handle(children.item(2)), complexI);

        // construct a Times object
        var result = new semantics.Arith1Plus(realpart, complexpart);

        return result;
      }

    });

});
