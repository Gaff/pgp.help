(function($){

    var TIMEOUT = 600;
    var timeout = null;	

    var openpgp = window.openpgp; //require('openpgp');

	function loadPgp(pgp, userw, fingerw) {
		setErrorState(pgp, false);
		var newKey = pgp.val();
		var publicKey = openpgp.key.readArmored(newKey);

		try {
			var prefferedKey = publicKey.keys[0];
			var user = prefferedKey.getPrimaryUser();
			var keyIds = prefferedKey.getKeyIds();
			userw.val(user.user.userId.userid ); //TODO: This looks ugly, is there a better way?
			fingerw.val(prefferedKey.primaryKey.fingerprint);
		} catch (err) {
			setErrorState(pgp, true);
			console.log(err);
		}

		return publicKey;
	}

    function translate() {

        var str = $('#src').val();
        var publicKey = loadPgp($('#pgppub'), $('#username'), $('#fingerprint'));

		openpgp.encryptMessage(publicKey.keys, str).then(function(pgpMessage) {
		    text = pgpMessage;
		    $('#dest').val(text);
		}).catch(function(error) {
		    text = error;
		    $('#dest').val(text);
		});
    }

    function decrypt() {
    	setErrorState($('#passphrase'), false);
    	//First load the key.
    	var privKey = loadPgp($('#pgppriv'), $('#usernamep'), $('#fingerprintp'));
    	//Now check that it's a private key...
    	var passphrase = $('#passphrase').val();
        var privateKey = privKey.keys[0];
    	var ok = privateKey.decrypt(passphrase);
		
    	if ( ok ) {
	    	var messgae = $('#encmsg').val();
    		var ctext = openpgp.message.readArmored(messgae);

			openpgp.decryptMessage(privateKey, ctext).then( function(plaintext) {
				$('#clearmsg').val(plaintext);
			}).catch(function(error ) {
				$('#clearmsg').val(error);

			});


		} else {
			setErrorState($('#passphrase'), true);
		}
 
    }

    function onInput(id, func) {
        $(id).bind("input keyup keydown keypress change blur paste", function() {
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

    function onChangeDecrypt() {
        clearTimeout(timeout);
        timeout = setTimeout(decrypt, TIMEOUT);
    }

	//Hooks on startup
	$(document).ready( function() {
		//console.log ('document ready - woot!');
		
		//redirect to https.
		if ((window.location.host=='pgp.help' || window.location.host=='gaff.github.io') && window.location.protocol!="https:")
            window.location.protocol = "https";


        if (window.location.hash)
          $('#tab-' + window.location.hash.substr(1).split('?')[0]).tab('show');

        $('a[data-toggle="tab"]').on('click', function (e) {
            window.location.hash = $(this).attr('href');
        });

		onInput('#src', onChangeFrom);
		onInput('#pgppub', onChangeFrom);
		
		onInput('#encmsg', onChangeDecrypt);
		onInput('#passphrase', onChangeDecrypt);
		onInput('#pgppriv', onChangeDecrypt);	
    });

    function setErrorState(field, err, msg) {
        var group = field.closest('.controls').parent();
        if (err) {
            group.addClass('has-error');
            group.attr('title',msg);
        } else {
            group.removeClass('has-error');
            group.attr('title','');
        }
    }

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

