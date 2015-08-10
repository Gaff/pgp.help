pgpApp.controller('KeyGenerator', function ($scope, $state, focus) {
  $scope.working = false;
  $scope.$state = $state;
  $scope.generateKeyPair = function() {
    var userid;

    if ($scope.user) {
      if ($scope.email) {
        userid = $scope.user + " <" + $scope.email + ">";
      } else {
        userid = $scope.user;
      }
    } else {
      userid = $scope.email;
    }

    var options = {
        numBits: 2048,
        userId: userid,
        passphrase: $scope.passphrase
    };

    $scope.working = true;
    openpgp.generateKeyPair(options).then(function(keypair) {
        $scope.working = false;
        // success
        //var privkey = keypair.privateKeyArmored;
        //var pubkey = keypair.publicKeyArmored;
        var pKey = openpgp.key.readArmored( keypair.publicKeyArmored );
        $scope.$emit('persist');
        $scope.$emit('newkey', pKey.keys[0]);
        $scope.$emit('newkey', keypair.key);
        $scope.$state.go("key", {
          key : $scope.getFingerprint(keypair.key),
          private : true,
        });
    }).catch(function(err) {
        // failure
        $scope.working = false;
        console.log(err);
        $scope.$apply();
    });
  };
});
