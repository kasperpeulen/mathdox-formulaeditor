$package("org.mathdox.formulaeditor.options");

$identify("org/mathdox/formulaeditor/Options.js");

// currently only org.mathdox.formulaeditor.options should be created
// further functions could be placed in an org.mathdox.formulaeditor.options
// record.

// ancientOrbeon: if set to true: do not warn about old orbeon
// contextParsingExpression: set to an object describing the context for the ExpressionParser
// debug: is debug enabled ?
// decimalMark: character for decimal mark
// - '.' : use period as in US
// - ',' : use comma as in Europe
// dragPalette: if set to true: enable draggable Palette
// fontSize: set font size 
// paletteHighlight: highlight Palette
// - true (default): highlight Palette onmouseover
// - false: do not highlight Palette
// indentXML: indent created XML
// inputStyle: set default style for Editor Canvases
// modeArith1Divide: set mode for handling arith1.divide
// - normal: automatically put unary minus and times expressions as enumerators
// - restricted: only parse power and higher priority (default)
// - inline: just insert a symbol (default: slash)
//     NOTE: if styleArith1Divide is set to colon, div or slash then the mode
//     automatically becomes inline
// optionArith1PowerInversePrefix
// - true : allow sin^-1(x) -> arcsin(x)
// - false : (default)
// optionArith1PowerPrefix
// - true : allow sin^2(x)
// - false : (default)
// optionVerboseStyle
// - "true": add style to divide and times
// - "false": (default)
// onloadFocus: set focus on load 
// - true gives focus to the first formulaeditor
// - <id> as string gives focus to the formulaeditor corresponding to the
//   textarea with id <id>
// paletteShow : default behaviour when showing palettes, choices : 
// - "all" gives a palette if not specified by class
// - "none" gives no palette if not specified by class
// - "one" (default) gives a palette if not specified by class when there
//   is none in the page yet, 
// paletteStyle: set default style for Palette Canvases
// paletteURL: url for palette
// styleArith1Divide: behavior for divide symbol
// - "colon" inline with a ratio symbol (U+2236 or :)
// - "div" inline with a division sign symbol (U+00F7)
// - "mfrac" display style with a line between the arguments
// - "slash" inline with a slash symbol (U+2215 or /)
// styleArith1Times: behavior for times symbol
// - "dot" show a middle dot (default)
// - "cross" show a cross
// - "star" show an asterisk
// styleTransc1Log: behavior for logarithm symbol
// - "function" log(10, x)
// - "prefix"   ^10 log (x)
// - "postfix"  log_10(x)
// undo: whether to enable experimental undo
// - true (default): enable undo
// - false: disable undo
// useBar : enable Bar to turn palette on/off
// - true (default): enable bar
// - false: disable bar

$main(function() {
  org.mathdox.formulaeditor.Options = $extend(Object, {
    defaultOptions : {
      debug: false,
      decimalMark: '.',
      featureUndo: true,
      modeArith1Divide: 'restricted',
      optionVerboseStyle: 'false',
      styleArith1Divide: 'mfrac',
      styleArith1Times: 'dot',
      styleTransc1Log: 'function',
      symbolArith1Times: '·' // U+00B7 Middle dot
    },
    getOption : function(name) {
      if (org.mathdox.formulaeditor.options[name] !== undefined) {
        return org.mathdox.formulaeditor.options[name];
      } else if (this.defaultOptions[name] !== undefined) {
        return this.defaultOptions[name];
      } else {
	return null;
      }
    },
    getArith1DivideMode : function () {
      var option = this.getOption("modeArith1Divide");
      var style = this.getOption("styleArith1Divide");

      if (style == 'colon' || style == 'div' || style == 'slash') {
	return "inline";
      } else if (option == 'normal' || option == 'restricted' || option == 'inline') {
      	return option;
      } else {
        return "restricted";
      }
    },
    getArith1DivideStyle : function () {
      var option = this.getOption("styleArith1Divide");

      if (option == 'colon' || option == 'div' || option == 'mfrac' || option == 'slash') {
	return option;
      }

      return this.defaultOptions.styleArith1Divide;
    },
    getArith1DivideSymbol : function () {
      var option = this.getOption("styleArith1Divide");

      if (option == 'colon') {
        return ':'; // normal colon, 
        // NOTE: it might be better to return U+2236 ratio, but that would be
        // confusing to the user
      } else if (option == 'div') {
        return '÷'; // U+00F7 is division sign 
      } else if (option == 'slash') {
        return '∕'; // U+2215 is division slash
      } else {
        return '∕'; // U+2215 is division slash
      }
    },
    getArith1PowerOptionInversePrefix : function () {
      var option = this.getOption("optionArith1PowerInversePrefix");

      if (option == 'true') {
      	return "true";
      } else {
        return "false";
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
    getArith1TimesStyle : function () {
      var option = this.getOption("styleArith1Times");

      if (option == 'dot' || option == 'cross' || option == 'star') {
	return option;
      }

      return this.defaultOptions.styleArith1Times;
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
    },
    getVerboseStyleOption : function() {
      var option = this.getOption("optionVerboseStyle");

      if (option == 'true' || option == 'false') {
        return option;
      } 

      return this.defaultOptions.optionVerboseStyle;
    }
  });
});

