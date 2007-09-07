/**
 * Declare the global variables that will be exported by this script.
 */
var $package;
var $require;
var $main;
var $extend;
var $baseurl;

/**
 * Enter a private variable context, so that variables declared below are not
 * visible outside this script.
 */
(function(){

  /**
   * Contains a record of all $main arguments that have been executed. This is
   * used by the $main and $require functions to ensure that each $main argument
   * is executed only once.
   */
  var executed = {};

  /**
   * This counter is used to keep track of how many urls were requested to be
   * loaded (using the $require function), but haven't finished loading yet.
   */
  var loading = 1;

  /**
   * A list of functions that wish to be called when the 'loading' counter
   * reaches 0.
   */
  var waiting = [];

  /**
   * Holds a reference to the script tag that was last added to the document by
   * the $require function. New scripts will be added below this script.
   */
  var lastadded;

  /**
   * Record the global variable scope in the 'global' object. This is used by
   * the $package function to create new package objects in the global scope.
   */
  var global = this;

  /**
   * Returns the package object for the specified package string. For instance,
   * the call $package("org.mathdox.javascript") will return the
   * org.mathdox.javascript object. If the package object doesn't exist, it is
   * created.
   */
  $package = function(string) {

    var parts = string.split(".");
    var parent = global;
    for (i=0; i<parts.length; i++) {
      if (!parent[parts[i]]) {
        parent[parts[i]] = {};
      }
      parent = parent[parts[i]];
    }
    return parent;

  }

  /**
   * When a script has been loaded, this function will check whether all
   * requirements have been loaded, and will then execute the main sections.
   */
  var onload = function() {

    loading = loading - 1;
    if (loading == 0) {
      while (waiting.length > 0) {
        var continuation = waiting.pop();
        if (!executed[continuation]) {
          executed[continuation] = true;
          continuation();
        }
      }
    }

  }

  /**
   * Ensures that the script at the specified url is loaded before the main
   * section is executed. Each url is only loaded once.
   * We cannot detect whether a script has finished loading when a third-party
   * script is loaded that doesn't contain a call to $main. In those cases a
   * 'ready' function to detect load completion must be specified. This function
   * should return 'true' when the script has loaded, and 'false' otherwise.
   * Typically, such a function would check for the presence of a variable that
   * is set by the third-party script.
   */
  $require = function(url, ready) {

    // add base url to url, unless it is an absolute url
    if (!url.match(/^\/|:/)) {
      url = $baseurl + url;
    }

    // increase the 'loading' counter
    loading = loading + 1;

    // add script tag to document
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    lastadded.parentNode.insertBefore(script, lastadded.nextSibling);
    lastadded = script;

    // use the 'ready' function to check for load complete, if it was specified
    if (ready instanceof Function) {
      var wait = function() {
        if (ready()) {
          onload();
        }
        else {
          setTimeout(wait, 100);
        }
      }
      wait();
    }

  }

  /**
   * Calls the continuation function that is specified as a parameter when all
   * previously specified requirements have been loaded.
   */
  $main = function(continuation) {
    waiting.push(continuation);
    onload();
  }

  /**
   * Returns a new class that adds the specified properties to the specified
   * parent class.
   */
  $extend = function(parent, properties) {

    // figure out what the prototype of the new class will be
    var prototype;
    if (parent instanceof Function) {
      prototype = new parent();
    }
    else {
      prototype = parent;
    }

    // create the new class constructor
    var constructor = function(){
      if (this.initialize instanceof Function) {
        this.initialize.apply(this, arguments);
      }
    }

    // copy any static class properties of the parent to the new class
    if (parent instanceof Function) {
      for (x in parent) {
        constructor[x] = parent[x];
      }
    }

    // copy the additional properties to the prototype
    for (x in properties) {

      // add a 'parent' property to methods, to enable super calls
      if (properties[x] instanceof Function) {
        if (!("parent" in properties[x])) {
          if (parent instanceof Function) {
            properties[x].parent = parent.prototype;
          }
          else {
            properties[x].parent = parent;
          }
        }
      }

      prototype[x] = properties[x];

    }

    // combine constructor and prototype
    constructor.prototype = prototype;

    // return new class constructor
    return constructor;

  }

  /**
   * Find the script tag that was used to load this script, and use it to
   * calculate the value of 'lastadded' and '$baseurl'.
   */
  var scripts = document.getElementsByTagName("script");
  var scriptfinder = /(.*)org\/mathdox\/javascript\/core\.js(.*)$/;
  for (var i=0; i<scripts.length; i++) {
    var match = scripts[i].src.match(scriptfinder);
    if (match != null) {
      lastadded = scripts[i];
      $baseurl = match[1];
    }
  }

})()