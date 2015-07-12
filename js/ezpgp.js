(function($){

    var TIMEOUT = 600;
    var timeout = null;	

    function onInput(id, func) {
        $(id).bind("input keyup keydown keypress change blur", function() {
            if ($(this).val() != jQuery.data(this, "lastvalue")) {
                func();
            }
            jQuery.data(this, "lastvalue", $(this).val());
        });
        $(id).bind("focus", function() {
           jQuery.data(this, "lastvalue", $(this).val());
        });
    }

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