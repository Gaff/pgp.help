getOrigin = function() {
	var wlo = window.location.origin;
	if (!wlo) {
  		wlo = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
	}

	return wlo;
}