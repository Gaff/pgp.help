(function($){

    var TIMEOUT = 600;
    var timeout = null;	

    function onChangeFrom() {
        clearTimeout(timeout);
        timeout = setTimeout(translate, TIMEOUT);
    }

    function translate() {

        var str = $('#src').val();

        text = str + "XXX";

        $('#dest').val(text);

    }

	//I'm not sure what any of this means :/
	$(document).ready( function() {
		console.log ('document ready - woot!');

		onInput('#src', onChangeFrom);
    });	
})(jQuery);