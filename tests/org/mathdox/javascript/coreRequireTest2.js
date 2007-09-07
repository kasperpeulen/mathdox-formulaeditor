$require("org/mathdox/javascript/coreRequireTest3.js")

$main(function(){

  $require.requireTest2 = true;
  $require.requireTest4 = ($require.requireTest3 == 1)

})
