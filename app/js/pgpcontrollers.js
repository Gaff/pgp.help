var pgpApp = angular.module('pgpApp', ['ngAnimate', 'ui.router', 'ui.bootstrap']);

pgpApp.directive('autoselectall', ['$window', function ($window) {
    return {
        restrict: 'C', //A would be better
        link: function (scope, element, attrs) {
          //var $this = $(this);
          element.on('click', function () {
              if (!$window.getSelection().toString()) {
                  // Required r mobile Safari
                  this.select();
              }
          });
          element.on('blur', function(){
            element.scrollTop(0);
          });
        }
    };
}]);

pgpApp.directive('focusOn', function() {
   return function(scope, elem, attr) {
      scope.$on('focusOn', function(e, name) {
        if(name === attr.focusOn) {
          //console.log("focuson "+attr.focusOn);
          elem[0].focus();
        }
      });
   };
});

pgpApp.factory('focus', function ($rootScope, $timeout) {
  return function(name) {
    $timeout(function (){
      $rootScope.$broadcast('focusOn', name);
    });
  }
});

pgpApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/import");

  $stateProvider
    .state('permalink', {
      url: "/permalink?{pgp}",
      templateUrl: "templates/keyWork.html",
      controller: 'KeyWorkCtrl',
      params: {
        pgp : null,
      },
    })
    .state('key', {
      url: "/",
      templateUrl: "templates/keyWork.html",
      controller: 'KeyWorkCtrl',
      params: {
        key : null,
        private : null,
      },
    })
    .state('import', {
      url: "/import?{pgp}",
      templateUrl: "templates/keyWork.html",
      controller: 'KeyWorkCtrl',
      params: {
        key : null,
        private : null,
        pgp : null,
      },
    })
    .state('generate', {
      url: "/generate",
      templateUrl: "templates/keyGenerator.html",
      controller: 'KeyGenerator',
    })
    .state('intro', {
      url : "/intro",
      templateUrl : "templates/intro.html",
    })
    ;


  // configure html5 to get links working on jsfiddle
  //$locationProvider.html5Mode({
  //  enabled: true,
  //  requireBase: false,
  //});
});

pgpApp.config( [
    '$compileProvider',
    function( $compileProvider )
    {
        //need to enable data links for downloads.
        ///^\s*(https?|ftp|mailto|tel|file):/
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|data|mailto):/);
    }
]);


pgpApp.controller('KeyListCtrl', function ($scope, $location, $modal) {

  $scope.$location = $location;

  $scope.getUser = function(key) {
    if (!key) return "";
    if('alias' in key) {
      return key.alias;
    }
    if('primaryKey' in key) {
      return key.getPrimaryUser().user.userId.userid;
    }
    console.log("Ooops - no idea what this key is:");
    console.log(key);
    return "Unknown key!";
  };

  $scope.getFingerprint = function(key) {
    if(!key) return "";
    if('primaryKey' in key) {
      return key.primaryKey.fingerprint;
    }
  };

  $scope.getKeyId = function(key) {
    if(!key) return "";
    if('primaryKey' in key) {
      return key.primaryKey.getKeyId().toHex();
    }
  };

  $scope.addOrUpdateKey = function(data) {
    //console.log(data);
    var f = $scope.getFingerprint(data);
    var ret = null;

    if( data.isPrivate()) {
      var match = $scope.keyring.privateKeys.getForId(f);
      if (match) {
        key = match;
        key.update(data);
        ret = key;
      } else {
        $scope.keyring.privateKeys.push(data);
        ret = data;
      }
    } else {
      var match = $scope.keyring.publicKeys.getForId(f);
      if (match) {
        key = match;
        key.update(data);
        ret = key;
      } else {
        $scope.keyring.publicKeys.push(data);
        ret = data;
      }
    }

    return ret;
  };

  $scope.allKeys = function() {
    return $scope.keyring.getAllKeys();
  };

  $scope.publicKeys = function() {
    return $scope.keyring.publicKeys.keys;
  };

  $scope.privateKeys = function() {
    return $scope.keyring.privateKeys.keys;
  };

  $scope.keyring = new openpgp.Keyring(); //Magically attaches to local store!
  $scope.workstarted = $scope.allKeys().length > 0 ? true : false; //Should we start in basic mode?
  $scope.skipintro = $scope.allKeys().length > 2 ? true : false; //Should we start in basic mode?
  $scope.persist = $scope.workstarted;
  $scope.stored = $scope.persist; //Have we stored anything locally? Used to control delete button.
  pgpkeys = openpgp.key.readArmored(myKey);
  openpgp.config.commentstring = "https://pgp.help"; //Bit of a hack?
  $scope.addOrUpdateKey(pgpkeys.keys[0]);

  $scope.findKey = function(id, private) {
    if (!id) return null;
    if (private) {
      return $scope.keyring.privateKeys.getForId(id);
    } else {
      return $scope.keyring.publicKeys.getForId(id);
    };
  };


  $scope.$watch('$viewContentLoaded', function() {
    //This makes sure that when we load up we pass down the selection.
  });

  $scope.$watch('persist', function() {
    if ($scope.persist) {
      $scope.workstarted = true;
    }
    $scope.saveKeys();
  });

  $scope.isPrivate = function(key) {
    if(!key) return false;
    return key.isPrivate();
  }

  $scope.isDecrypted = function(key) {
    if(!key) return false;
    return key.primaryKey.isDecrypted;
  }

  $scope.$on('persist', function(event) {
    $scope.persist = true;

  });

  $scope.$on('newkey', function(event, data) {
    var updated = $scope.addOrUpdateKey(data);
    if(data.isPrivate()) {
      $scope.newidentityopts = false;
      $scope.workstarted = true;
    }

    if ($scope.allKeys().length > 1 ) {
      $scope.workstarted = true;
    }

    if ($scope.allKeys().length > 2 ) {
      $scope.skipintro = true;
    }


    $scope.saveKeys();
  });

  $scope.$on('deletekey', function(event, data) {
    //Maybe check isNew?
    var f = $scope.getFingerprint(data);
    if (data.isPrivate()) {
      $scope.keyring.privateKeys.removeForId(f);
    } else {
      $scope.keyring.publicKeys.removeForId(f);
    }

    $scope.saveKeys();
  });

  $scope.loadKeys = function() {
    //var localstore = new openpgp.Keyring.localstore("pgp.help_");
    var keyring = new openpgp.Keyring();
    console.log(keyring);
  };

  $scope.saveKeys = function() {
    if ($scope.persist) {
      //console.log("saved...");
      $scope.keyring.store();
      $scope.stored = true;
    };
  };

  $scope.purgeKeys = function() {
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'chickenBox.html',
      controller: 'chickenBoxCtrl',
      size: 'lg',
      resolve: {
        content: function () {
          return {
            title : 'Delete ALL key data!',
            danger : $scope.privateKeys().length > 0,
          };
        }
      }
    });

    modalInstance.result.then(function (result) {
      $scope.keyring.clear();
      $scope.keyring.store();
      $scope.stored = false;

      $scope.$state.go("key", {key:null, private:false});
    }, function () {
      //$log.info('Modal dismissed at: ' + new Date());
    });

  };

});

pgpApp.controller('KeyWorkCtrl', function ($scope, focus, $state, $stateParams, $modal) {
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
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'chickenBox.html',
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

pgpApp.controller('chickenBoxCtrl', function ($scope, $modalInstance, content) {

  $scope.content = content;

  $scope.ok = function () {
    $modalInstance.close(true);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

var myKey = [
'-----BEGIN PGP PUBLIC KEY BLOCK-----',
'Version: OpenPGP.js v1.2.0',
'Comment: https://pgp.help',
'',
'xsBNBFW7TH8BCADccz73OFQprAsBLNTFNZFTPzDUbmwKn5BMFFK7rYf7v8Gj',
'PyYQrl9DupBTiP6ISyTIvn/pT0/+G1yTYzliej4UZP7LOUz+pg59/X2JP7Ko',
'3UzH9qoO3FYXl85ok/daSNRt0VrKSoGcMuoLw7CT48hHZdIXSwoPFP//n8Qo',
'3u1J3LghZQLPdnZfWHPA6ZKLvcgQaByCABsRrH7L75+Qw49Wb3VeBiE5u26E',
'j3NXUc1GskMvFHp8pUnfzFxF4sCzk/o+zqJW8NtIje48beufH4eMBF2NK6nF',
'1Et8ESCM7jE10rpWm+nsl8lMooQEbUXoMp2z2s2zuYmaiV+ONaa3UT6fABEB',
'AAHNGVBncCBIZWxwIDxoZWxsb0BwZ3AuaGVscD7CwHIEEAEIACYFAlW7TIAG',
'CwkIBwMCCRAj/Z8+mwZ1aQQVCAIKAxYCAQIbAwIeAQAApGkIAJCtB3PD5aka',
'rGPzePxmqc37cpOGx/ArO8M7ouXDkc75xt3MOMvAFB4y8lytwteXbLG50Kl0',
'1KHp1NkUEJM0eR8SxGaPipEgN0PRoEDhN8VgR3m4Lq5RlTMFq1yXQgjPGndB',
'sP+KIDSfBEPZOlMW9VgdzThjqj8WqVxvaoRPbazLpS+WYrGTx4WjcsoS53ou',
'b7Fd6rkOdZcbgmUooDHRiNSNJq+RCwZnffxLlJQp3r3U0Ll4Mrsb/pxcOjde',
'7Cnc1SildK3m5iIuteGSIl8qXXTidcw5vV9w1xDLu7mPztaXlM72KaVkuhJN',
'/mSaCFTAAgECmvgP88ByG0uDu4SpeFrOwE0EVbtMfwEIAM/+tJfjT8ER4qe0',
'VJJPCqAcUffyXyABnN4NymDxz97ol9xwi2boTb2oDtTkAXmTU5pKKOjZFtV1',
'FizpVemVoGWBnmEZBaOUMZy2qFEIHrPh0OWaiuCSr+m/VjvOWota//bJZg1H',
'/o9JaMXSefE+lWak/BZagMAX/EOWUfzYfNSfHViua5HxKA5PoQ7Blcxt7T1f',
'5427XhoSpZzdbi9XjlYZmFlQ08MYG18wTVa6g8MJ7qr9TIVZPRnSrtE15iP1',
'8py3tXn97PToLd78ZkTfnlKZwrMxuFHcNCHMpVbEXD6zVWATeMMNRo5an3kg',
'dE9+9odr2zZWdJgnN1PDwbGKeEEAEQEAAcLAXwQYAQgAEwUCVbtMgQkQI/2f',
'PpsGdWkCGwwAAL2qCACSkHd3SDv1XTJJcwsazkXr+NMJaNSN7qQFPMboDS0Z',
'3pX27Rn1ev1UHTqFKBYgogxyeUOnbeXE+VAFYuoeNCbFYY1TFhvGVWRax/rf',
'PBuVQ4d1+g87nxSL3JFwvSGzTjPkJiU+rGOIkOqYK0JA/T8+ZqrXTQoH2d7i',
'r1vldA2CakQ+Mf+BjHjG06doQlrbuGBYXLWJbATpcKmK++kWaGE01h5rFbx8',
'JmS3SZME1N2bdm99TJVzbWbHqcJge/1lfEY1PecjweX2McXQEVGmZLPdN6dF',
'HLrZ5SS/qnXSXE79odO4Cd/gx1nJrovmut1vZfxh3yyLOnh9+BZX/NeU9FWu',
'',
'=MMEa',
'-----END PGP PUBLIC KEY BLOCK-----',
].join('\n');
