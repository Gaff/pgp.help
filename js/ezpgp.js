(function($){

    var TIMEOUT = 600;
    var timeout = null;	

    var openpgp = window.openpgp; //require('openpgp');

    var key = [
    	'-----BEGIN PGP PUBLIC KEY BLOCK-----',
		'Version: GnuPG v2.0.22 (MingW32)',
		'',
		'mQENBFWiJmcBCACQ5wfQLZx6rKbiD1QV6Vwc50iPqalZO3MIs+fv9EdUb7+cxc+K',
		'iW+GDEj2eqqJ+YCKtabYwbjYqPfbEzqbLo72joVFW5uBFxofTqC0qITQh/jqwYCu',
		'58PSJZqBzWLWR0Z6AGlbxKar2VGHwQKhzC78+H2iISs5Ur1hLl+JW3knVAofhnnv',
		'N9vVN2MqgFag65RcG5d/ZfogOLVHNF26o/A/HVXyAcnIcLMSjvoY2bX520qgKX4t',
		'Oart5mvPZuixIwS7SlSJ6bqFw78iQ2TtW2c6Cr4591uvGMvs7tNi2SbzOuZk4/XP',
		'i71X8v5vT4HIrwOfkU/nUdB0cJK2yS6nTYNZABEBAAG0E2V6cGdwIDxlenBncEBl',
		'enBncD6JATkEEwECACMFAlWiJmcCGwMHCwkIBwMCAQYVCAIJCgsEFgIDAQIeAQIX',
		'gAAKCRAvxGcZqIW/GVApCACKs3Ev0oWVugkOz4y1tbq+LwtLTEtLnKC4lM/Zr5hP',
		'5NNyK9X80QA8ysP3YelhwGBHFCGBkKwebT9V2KmRmFGjN5+U0NBhaoQKhkUbRXdT',
		'jsFjgECnMPpkmyGM4tWQTHS7WSyZnyHb51zmIphuE3WIWWCoaX56l1c9N88nxBMj',
		'KgjglPtXqz5cERIZuH0tLoRs3Z/lSVN6JgtvPm+dT0Bzg3zB1rUDhT2hO3Qv3vK1',
		'JDE1ADsjUrVWAmOLmwpQGMm6tnUGG96MOAX6XJ6sWuPeXZA7oaR7axzjYqvBBCUZ',
		'zTRb5KsnpNeGD+s9wCf8JE28UfxUnIIOf1UypnaEYbVtuQENBFWiJmcBCADOynw9',
		'ZI8qAMRtLv4keQDaCG7DWRiqB+5zyzTnOp6Qpb44QjbIKQXR98TOzO09ryfyWfWD',
		'UvuMw2aHoqrwEuBQJOLyOnIyIugF0tuaSI/8Ipu59YKWSZ9+UFZ1G0+GNiEacb7+',
		'seEIsAmcUUpWYNM5uSqdMZA2Vi486nQVypPUdtWjN17z8IElqdcez36kjld5v5fQ',
		'7p1lMAupP7c9vA5MVpXEic/omLOX0wAq6jf8+uIMz7xjGyekuje24PhOi5CdCWq1',
		'519k8J7VnbyNBrq3PGj7HLRATwiDvJawKNXJlVCV01rzonehjO42wdpOygUZmty+',
		'WdUbbJ/gHgKwOZgpABEBAAGJAR8EGAECAAkFAlWiJmcCGwwACgkQL8RnGaiFvxm6',
		'XQgAiJG9+7EPkqFr+AX3KeHpwCBUCXhTIc8z5Z4Xum3OQ7YqetHip2NZ0oE4q7bk',
		'l7eIRD4PyMJGPG1VggoivFjqTdUdkSJDRq/q26JIjWAkbglm/AwS/J3ho14krVzb',
		'bOwHkTM/kpGq17GzBv2pxfQW8NSll6rc+VdIKzKQh3FbmtRM9rtFhURu/3pL2qM0',
		'6uGQWDwbA4eETLEgvmrMljXVbc+kYRMkEaSHs6EbZHdLjeZ9I+IPDITJCgg7X8g2',
		'8ukwHeBTuAa2G9AdIaCESe6stQryOn+GE9HnbctVIiKePLwsfjHzaacN1lUgT2fl',
		'clXB4R9mNkKiniYdqUFX54HrVw==',
		'=xMIP',
		'-----END PGP PUBLIC KEY BLOCK-----'].join('\n');


    function translate() {

        var str = $('#src').val();
        var publicKey = openpgp.key.readArmored(key);
        var text = '...translating';
        $('#dest').val(text);

		openpgp.encryptMessage(publicKey.keys, str).then(function(pgpMessage) {
		    text = pgpMessage;
		    $('#dest').val(text);
		}).catch(function(error) {
		    text = error;
		    $('#dest').val(text);
		});

        

    }

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

	//I'm not sure what any of this means :/
	$(document).ready( function() {
		//console.log ('document ready - woot!');

		onInput('#src', onChangeFrom);
    });	
})(jQuery);