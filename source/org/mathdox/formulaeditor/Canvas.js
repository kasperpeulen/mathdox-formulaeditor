/**
 * Loads Google's Explorer Canvas library, when there is no native support for
 * the <canvas/> tag.
 */
var G_vmlCanvasManager;
if (!window.CanvasRenderingContext2D) {

  $require(
    "com/google/code/excanvas/excanvas.js",
    function() { return window.CanvasRenderingContext2D }
  );

  $main(function(){

    /**
     * Workaround for bug in Google's Explorer Canvas. The standard fixElement
     * method will remove all siblings following the canvas tag.
     */
    G_vmlCanvasManager.fixElement_ = function(element) { return element; }

    /**
     * Because the script tag that references excanvas.js file is dynamically
     * added to the DOM after the document is already loaded, it is necessary
     * to call the initialization code explicitly, instead of letting it wait
     * forever on the 'onreadystatechange' event.
     */
    if (document.readyState && document.readyState == "complete") {
      G_vmlCanvasManager.init_(document);
    }

  });

}
else {

  $main(function(){
    // skip
  });

}