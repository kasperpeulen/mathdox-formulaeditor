$package("org.mathdox.formulaeditor.options");

$identify("org/mathdox/formulaeditor/Options.js");

// currently only org.mathdox.formulaeditor.options should be created
// further functions could be placed in an org.mathdox.formulaeditor.options
// record.

// ancientOrbeon: if set to true: do not warn about old orbeon
// contextParsingExpression: set to an object describing the context for the ExpressionParser
// dragPalette: if set to true: enable draggable Palette
// fontSize: set font size 
// ignoreTextareaStyle: do not copy options from textarea if set to true
// indentXML: indent created XML
// inputStyle: set default style for Editor Canvases
// paletteShow : default behaviour when showing palettes, choices : 
// - "all" gives a palette if not specified by class
// - "none" gives no palette if not specified by class
// - "one" (default) gives a palette if not specified by class when there
//   is none in the page yet, 
// paletteStyle: set default style for Palette Canvases
// paletteURL: url for palette
// styleArith1Times: behavior for times symbol
// - "dot" show a middle dot (default)
// - "cross" show a cross
// - "star" show an asterisk
// useBar : enable Bar to turn palette on/off

$main(function() {
  org.mathdox.formulaeditor.Options = $extend(Object, {
    defaultOptions : {
      decimalMark: '.',
      styleTransc1Log: 'function',
      symbolArith1Times: '·' // U+00B7 Middle dot
    },
    getOption : function(name) {
      if (org.mathdox.formulaeditor.options[name] !== undefined) {
        return org.mathdox.formulaeditor.options[name];
      } else {
        return null;
      }
    },
    getArith1PowerOptionPrefix : function () {
      var option = this.getOption("optionArith1PowerPrefix");

      if (option == 'true') {
      	return "true";
      } else {
        return "false";
      }
    },
     getArith1TimesSymbol : function () {
      var option = this.getOption("styleArith1Times");

      if (option == 'dot') {
        return '·'; // U+00B7 Middle dot
      } else if (option == 'cross') {
        return '×'; // U+00D7 is cross
      } else if (option == 'star') {
        return '*';
      }
      return this.defaultOptions.symbolArith1Times;
    },
    getDecimalMark: function() {
      var mark = this.getOption("decimalMark");
      if (mark === '.' || mark === ',') {
        return mark;
      } else { 
        // use default 
        return this.defaultOptions.decimalMark;
      }
    },
    getListSeparator : function() {
      var mark = this.getDecimalMark();
      
      if (mark === '.') {
        return ',';
      } else if (mark === ',') {
        return ';';
      } else { // should not happen
        alert("Options: unable to get listseparator.");
        return null;
      }
    },
    getTransc1LogStyle : function () {
      var option = this.getOption("styleTransc1Log");

      if (option == 'prefix' || option == 'postfix' || option == 'function') {
        return option;
      } 

      return this.defaultOptions.styleTransc1Log;
    }
  });
});

