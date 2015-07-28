(function($){
  //Hooks on startup
  $(document).ready( function() {
    //console.log ('document ready - woot!');

    //redirect to https.
    if ((window.location.host=='pgp.help' || window.location.host=='gaff.github.io') && window.location.protocol!="https:")
    window.location.protocol = "https";
  });
  
  //Make it easer to cut-and-paste.
  //Thanks to: https://stackoverflow.com/questions/5797539/jquery-select-all-text-from-a-textarea
  $('.autoselectall').focus(function() {
    var $this = $(this);
    $this.select();

    // Work around Chrome's little problem
    $this.mouseup(function() {
      // Prevent further mouseup intervention
      $this.unbind("mouseup");
      return false;
    });

    $('.autoselectall').blur(function() {
      $(this).scrollTop(0);
    });
  });

})(jQuery);
