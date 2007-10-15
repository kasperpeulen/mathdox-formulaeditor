$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/


$main(function(){

  org.mathdox.formulaeditor.semantics.Sum =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {
    
      // operand 0 : bound variable
      // operand 1 : lower bound
      // operand 2 : upper bound
      // operand 3 : expression
    
      getPresentation : function() {
      
        with(org.mathdox.formulaeditor.presentation) {
        
          return new Row(
            new Column(
              new Row(this.operands[2].getPresentation()),
              new Symbol("Σ"),
              new Row(
                this.operands[0].getPresentation(),
                new Symbol("="),
                this.operands[1].getPresentation()
              )
            ),
            this.operands[3].getPresentation()
          );
        
        }        
      
      },
      
      getOpenMath : function() {
      
        return 
          "<OMA>" +
            "<OMS cd='arith1' name='sum'/>" +
            "<OMA>" +
              "<OMS cd='interval1' name='integer_interval'/>" +
              this.operands[1].getOpenMath() +
              this.operands[2].getOpenMath() +
            "</OMA>" +
            "<OMBIND>" +
              "<OMS cd='fns1' name='lambda'>" +
              "<OMBVAR>" +
                this.operands[0].getOpenmath() +
              "</OMBVAR>" +
              this.operands[3].getOpenMath() +
            "</OMBIND>" +
          "</OMA>";
      
      }
    
    })

})
