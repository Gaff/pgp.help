(function($){

    var TIMEOUT = 600;
    var timeout = null;	

    var openpgp = window.openpgp; //require('openpgp');

    var key = [
		'-----BEGIN PGP PUBLIC KEY BLOCK-----',
		'Version: GnuPG v2.0.22 (MingW32)',
		'',
		'mQENBFWiLtsBCAD4QIBM7iBow/aMuHCrK3Sy8b6oMUKtnCKRhpT2U6+9rQqdEijb',
		'bcWjC9Dtng4H/03/DP5O21rCg22C7B/FINxJ7d/Owyz/Qk70794NES7XDhFw6vui',
		'dtwxYpekeT9QlS0lq/rXx7gHVFvhw9dqxhIC0+2L+oKVIAsCXXyek1ziUw2qeb0B',
		'Vbg0P3MoT+CEIPcroISo5qf/dEu7ERf1DFkydFbB25/asFUknAS9f8jzv/1gZrv4',
		'LxsmxXEMnIUgakjD1Y0Hy/+vn2WGdrp0dLRBSgwxCFBkG30Ivwujp8KnKYqSD0Ow',
		'HtACHTP4rSlv3MIrHXCAVxdU7IJivZR2oHfRABEBAAG0H2V6cGdwdGVzdCA8ZXpw',
		'Z3B0ZXN0QGV6cGdwdGVzdD6JATkEEwECACMFAlWiLtsCGwMHCwkIBwMCAQYVCAIJ',
		'CgsEFgIDAQIeAQIXgAAKCRAS8n6XV462SI8KCADzcuA0Nxe4ZL6TcNVrfaD0aBtn',
		'0wbZaWPd/9gqkzhNjySXeyzzgNoEZhl/Pb+6HOpL1pBY0GpzfUzx+yv6JsFebOeD',
		'9XNgBtFCFN3XAEsmbaX475wBZ3JXYGjYeeRtKSDHwpPH63AXZP6AIqTAZo3LJJv3',
		'gG3iH+AZidaNEQFq22jEAwYIaFWZC7vkww8jJZhgeOabGGRthyr+qM2pHi6FtdAH',
		'O0ORHCfWoEdVSqovJwkiw6Y0UPjGhXpTpqJxwrgsnRce8uO1YiCWUW8nb2GLOnjT',
		'CaSiSskIA1/Zsr92Lxo930mhc1tz11Ix2h077wn04E/KbpZs7BeOUqMBhwnjuQEN',
		'BFWiLtsBCAC9tTzmOmICD/4q+LN1WwEo9ZINGHilgU+YdURFK4IVlzIRXwZUR9LK',
		'SkrstIaudwt5ls92fv4X5ZF6iIaFdoyPxlyGnUSlMi2rZyjsUPvWHctr5WKUtLpx',
		'JILCpEIjiLx8uJtg3PIIT8XluJaXvSu+k0wISVLFqN7sQcU0AqH9tq15Rccr0gyH',
		'TSY1edy2Q40Woe+Km1R+Mqg+uOYpMDqnWtpqxP2CirNoviOn9R9WC4hXpGJep07R',
		'apjb4cDUll77kIhullLi0H8ABo5qVpnD6W752tJhALab0OIcjMTSrI4qpAXub6Ie',
		'isKfU0jKGuZvv1s3BnwFRJwaCyu4VND3ABEBAAGJAR8EGAECAAkFAlWiLtsCGwwA',
		'CgkQEvJ+l1eOtkjfHgf9GzrwUPFYmybD/89+ZLZE4SuqLc33eweTIpbdVmv4OSes',
		'1+Ul/FOdMsuW4WUM2tuqXRAf6oLPJcgqTrwPTeixvACxlHVvESdTaYkpRRQiwgnD',
		'G3VgA4Kua4/rjrh73EmKEGU9LIzq8kr/x91t/Qh6XPp9BtxLY9fi4nKjTiw7GuhA',
		'qoIV9zb/8ehns/CgRvVLImUt0mSF9SHoJ5jpY19ajBqnc5HrPl8DnhxlLOU9d7Cn',
		'Kyjxk0U6cRXJJi74MDiQhAvNotbuybYtv0H6lw0N/nCKd89nSvaDikIaRO9aGo65',
		'Ywsgh9vKGngeVd4hO1c/RaPxs0rm9CeAbbF7U5p/0Q==',
		'=w1w6',
		'-----END PGP PUBLIC KEY BLOCK-----'].join('\n');

	var privkey = [
		'-----BEGIN PGP PRIVATE KEY BLOCK-----',
		'Version: GnuPG v2.0.22 (MingW32)',
		'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',
		'P0Wj8bNK5vQngG2xe1Oaf9E=',
		'=q60p',
		'-----END PGP PRIVATE KEY BLOCK-----'].join('\n');

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

	//Hooks on startup
	$(document).ready( function() {
		//console.log ('document ready - woot!');

		onInput('#src', onChangeFrom);
		
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
});

})(jQuery);

