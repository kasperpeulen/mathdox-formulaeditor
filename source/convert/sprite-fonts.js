// outputbuffer object
var output = {
  str : "", // buffer
  print : function(s,newline) { // printing function
    this.str += s;

    if (newline == true) {
      print(this.str);
      this.str = "";
    }
  }
}

var copy = function(data) {
  if (data instanceof Array) {
    output.print('[');
    for(var i=0; i<data.length; i++) {
      if (i>0) {
	output.print(",");
	if (Math.floor(i/8)==i/8) {
	  output.print("",true);
	  output.print("  ");
	}
      }
      copy(data[i]);
    }
    output.print(']');
  } else if (data instanceof Object) {
    output.print('{');
    for (var i in data) {
      copy(i);
      output.print(":");
      copy(data[i]);
    }
    output.print('}');
  } else {
    output.print(data.toString());
  }
};

var jsMath={
  Img: {
    AddFont:function(size,data) {
      print("org.mathdox.formulaeditor.MathCanvas.addFont("+size+", ");

      // now copy data
      copy(data);
      // also flushes the buffer 
      output.print(");",true);
    }
  }
};

print("$package(\"org.mathdox.formulaeditor\");");
print("$require(\"org/mathdox/formulaeditor/MathCanvas.js\");");
print("");
print("$main(function(){");

load("fonts-sprite/cmbx10/font.js");
load("fonts-sprite/cmex10/font.js");
load("fonts-sprite/cmr10/font.js");
load("fonts-sprite/cmsy10/font.js");
load("fonts-sprite/cmti10/font.js");

print("});");
