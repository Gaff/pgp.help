(function($){
  //Hooks on startup
  $(document).ready( function() {
    //console.log ('document ready - woot!');

    //redirect to https.
    if ((window.location.host=='pgp.help' || window.location.host=='gaff.github.io') && window.location.protocol!="https:")
    window.location.protocol = "https";
  });  
})(jQuery);
