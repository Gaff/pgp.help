pgpApp.controller('KeyWorkCtrl', function ($scope, focus, $state, $stateParams, $uibModal) {
  $scope.key = null;
  $scope.$stateParams = $stateParams;
  $scope.$state = $state;

  $scope.init = function() {
    if ('pgp' in $stateParams && $stateParams.pgp) {
      $scope.rawkey = decodeURIComponent($stateParams.pgp);
      key = $scope.loadKey_raw();
      if( key ) {
        $scope.key = key;
        //not quite correct for private keys. Why would you be making permanlinks for this?
        focus("message");
      }
    } else {
      $scope.key = $scope.findKey($stateParams.key, $stateParams.private);

      if ($scope.isNewKey()) {
        $scope.rawkey = "";
        focus("pgppub");
      } else {
        if ($scope.isPrivateKey()) {
          $scope.rawkey = $scope.key.toPublic().armor();
          $scope.rawkey_private = $scope.key.armor();
          if(!$scope.isDecryptedKey()) {
            focus("passphrase");
          } else {
            focus("pmessage");
          };
        } else {
          $scope.rawkey = $scope.key.armor();
          focus("message");
        }
      }
    }
  };

  //TODO: These don't need to be functions any more. Except isDecrypted maybe
  $scope.isNewKey = function() { return $scope.key == null};
  $scope.isPrivateKey = function() {
    if (!$scope.key) return $scope.$stateParams.private;
    return $scope.isPrivate($scope.key);
  };
  $scope.isDecryptedKey = function() {
    if($scope.key){
      return ($scope.isDecrypted($scope.key));
    } else { return(false); }
  };

  $scope.deleteKey = function() {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'templates/chickenBox.html',
      controller: 'chickenBoxCtrl',
      size: 'lg',
      resolve: {
        content: function () {
          return {
            title : 'Delete key data',
            danger : $scope.isPrivateKey(),
          };
        }
      }
    });

    modalInstance.result.then(function (result) {
      $scope.$emit('deletekey', $scope.key);
      $scope.$state.go("key", {key:null, private:false});
    }, function () {
      //$log.info('Modal dismissed at: ' + new Date());
    });
  }

  $scope.mailit = function() {
    //Not bullet-proof but probably good enough.
    var emailMatches = $scope.getUser($scope.key).match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\b/);
    if (!emailMatches) return "";
    var email = emailMatches[0];
    var rt = $scope.resulttext;

    return ("mailto:" + email + "?subject=" + encodeURIComponent("Sent from pgp.help") + "&body=" + encodeURIComponent(rt));
  }

  $scope.encodeURIComponent = function(raw) {
    var r = encodeURIComponent(raw);
    return r;
  }

  $scope.loadKey_raw = function() {
    var publicKey;
    try {
      var publicKey = openpgp.key.readArmored($scope.rawkey);
    } catch (err) {
      //console.log("Not a key: " + err);
      $scope.pgperror = true;
      return null;
    }

    if (publicKey.err) {
      $scope.pgperror = true;
      return null;
    } else {
      $scope.pgperror = false;
      //Apply this first to get animations to work:
      key = publicKey.keys[publicKey.keys.length - 1];
      $scope.smartfade = "smartfade";
      focus("message");
      //$scope.wasNew = true;

      //Now notify about the new keys.
      for( i = 0; i < publicKey.keys.length; i++) {
        $scope.$emit('newkey', publicKey.keys[i]);
      }

      return key;
    };
  };

  $scope.loadKey = function() {
    key = $scope.loadKey_raw();

    if (!key) return;

    var sp = {
      key: $scope.getFingerprint(key),
      private: $scope.isPrivate(key),
    };
    //console.log(sp);
    $scope.$state.go("key", sp);
  };

  $scope.encryptMessage = function() {
    $scope.resulttext = "";

    if ($scope.message && !$scope.isNewKey()) {
      //return "DEC: " + message;
      openpgp.encryptMessage($scope.key, $scope.message).then(function(pgpMessage) {
        $scope.resulttext = pgpMessage;
        $scope.$apply();
      }).catch(function(error) {
        $scope.resulttext = error;
        $scope.$apply();
      });
    }
  };

  $scope.applyPassword = function() {
    $scope.passworderror = false;
    if ($scope.password) {
      var ok = $scope.key.decrypt($scope.password);
      $scope.passworderror = !ok;

      if(ok) {
        $scope.password = "";
        focus('pmessage');
      }

      if(ok && $scope.pmessage) {
        $scope.decryptMessage();
      }
    }
  }

  $scope.blockquote = function(quote) {
    var out = "    " + quote.replace(/\n/g, "\n    ");
    return( out );
  }

  $scope.decryptMessage = function() {
    $scope.resulttext = "";
    $scope.pmessageerror = false;

    if( $scope.isNewKey() ) return;
    if( !$scope.pmessage) return;

    var ctext;
    try {
      ctext = openpgp.message.readArmored($scope.pmessage);
    } catch (err) {
      $scope.resulttext = err.message;
      $scope.pmessageerror = true;
      return;
    }

    if (!$scope.isDecryptedKey()) {
      focus("passphrase");
      return;
    }

    openpgp.decryptMessage($scope.key, ctext).then( function(plaintext) {
      $scope.resulttext = plaintext;
      $scope.$apply();
    }).catch(function(error ) {
      $scope.resulttext = error.message;
      $scope.$apply();
    });
  };

  $scope.init();
});
