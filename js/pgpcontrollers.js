var pgpApp = angular.module('pgpApp', ['ngAnimate']);

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

pgpApp.controller('KeyListCtrl', function ($scope) {
  $scope.getUser = function(key) {
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
    if('primaryKey' in key) {
      return key.primaryKey.fingerprint;
    }
  };

  $scope.getKeyId = function(key) {
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


  k = {'alias': 'New Key...', 'new' : true };
  kpriv = {'alias': 'Import Private Key...', 'new' : true, 'private' : true};
  kgenerate = {'alias': 'Generate Key...', 'new' : true, 'private' : true, 'generate' : true};
  $scope.selectit = k;
  $scope.keys = [k];
  $scope.keyring = new openpgp.Keyring(); //Magically attaches to local store!
  $scope.workstarted = $scope.allKeys().length > 0 ? true : false; //Should we start in basic mode?
  $scope.persist = $scope.workstarted;
  $scope.stored = $scope.persist; //Have we stored anything locally? Used to control delete button.
  pgpkeys = openpgp.key.readArmored(myKey);
  $scope.addOrUpdateKey(pgpkeys.keys[0]);

  $scope.selectedPublicIndex = function() {
    all = $scope.publicKeys();
    return all.indexOf($scope.selectit);
  };

  $scope.selectedPrivateIndex = function() {
    all = $scope.privateKeys();
    return all.indexOf($scope.selectit);
  };

  $scope.onSelect = function(key) {
    $scope.selectit = key;
    $scope.$broadcast('selection', key);
  };

  $scope.selectNew = function(priv) {
    if (priv) {
      $scope.onSelect(k);
    } else {
      $scope.onSelect(kpriv);
    }
  }

  $scope.selectGenerator = function() {
    $scope.onSelect(kgenerate);
  };

  $scope.$watch('$viewContentLoaded', function() {
    //This makes sure that when we load up we pass down the selection.
    $scope.onSelect($scope.selectit);
  });

  $scope.$watch('persist', function() {
    $scope.saveKeys();
  });

  $scope.isNew = function(key) {
      return( 'new' in key ? true : false );
  };

  $scope.isPrivate = function(key) {
    if( $scope.isNew(key)) {
      return( 'private' in key);
    } else {
      return key.isPrivate();
    }
  }

  $scope.isGenerator = function(key) {
    return ('generate' in key ? true : false);
  };

  $scope.isDecrypted = function(key) {
    if( $scope.isNew(key)) {
      return false;
    } else {
      return key.primaryKey.isDecrypted;
    }
  }

  $scope.$on('persist', function(event) {
    $scope.persist = true;
  });

  $scope.$on('newkey', function(event, data) {
    var updated = $scope.addOrUpdateKey(data);
    if(data.isPrivate()) {
      $scope.newidentityopts = false;
    }
    $scope.workstarted = true;
    $scope.saveKeys();
    $scope.selectit = updated;

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
    $scope.keyring.clear();
    $scope.keyring.store();
    $scope.stored = false;
    $scope.onSelect(k);
  }
});

pgpApp.controller('KeyWorkCtrl', function ($scope, focus) {
  $scope.key = null;

  $scope.$on('selection', function(event, data) {
    $scope.smartfade = "";
    $scope.pgperror = false;
    $scope.password = "";
    $scope.passworderror = false;

    $scope.key = data;
    if ($scope.isNewKey()) {
      $scope.rawkey = "";
      focus("pgppub");
    } else {
      if ($scope.isPrivateKey()) {
        $scope.rawkey = data.toPublic().armor();
        if(!$scope.isDecryptedKey()) {
          focus("passphrase");
        } else {
          focus("pmessage");
        };
      } else {
        $scope.rawkey = data.armor();
        focus("message");
      }

    }
  });

  $scope.$watch('key', function() {
    if ($scope.isPrivateKey()) {
      $scope.decryptMessage();
    } else {
      $scope.encryptMessage()}
    }
  );

  $scope.isNewKey = function() { return $scope.isNew($scope.key)};
  $scope.isPrivateKey = function() { return $scope.isPrivate($scope.key)};
  $scope.isDecryptedKey = function() {
    if($scope.key){
      return ($scope.isDecrypted($scope.key));
    } else { return(false); }
  };

  $scope.loadKey = function() {
    try {
      var publicKey = openpgp.key.readArmored($scope.rawkey);
      if (publicKey.err) {
        $scope.pgperror = true;
      } else {
        $scope.pgperror = false;
        //Apply this first to get animations to work:
        $scope.key = publicKey.keys[publicKey.keys.length - 1];
        $scope.smartfade = "smartfade";
        focus("message");
        //$scope.wasNew = true;

        //Now notify about the new keys.
        for( i = 0; i < publicKey.keys.length; i++) {
          $scope.$emit('newkey', publicKey.keys[i]);
        }
      }

    } catch (err) {
      //console.log("Not a key: " + err);
      $scope.pgperror = true;
    }
  };

  $scope.encryptMessage = function() {
    $scope.resulttext = "";

    if ($scope.message && !$scope.isNew($scope.key)) {
      //return "DEC: " + message;
      openpgp.encryptMessage($scope.key, $scope.message).then(function(pgpMessage) {
        $scope.resulttext = pgpMessage;
        //$scope.ciphertext = $scope.message + "\n" + pgpMessage;
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

  $scope.decryptMessage = function() {
    $scope.resulttext = "";
    $scope.pmessageerror = false;

    if( $scope.isNew($scope.key) ) return;
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

});

pgpApp.controller('KeyGenerator', function ($scope, focus) {
  $scope.working = false;
  $scope.generateKeyPair = function() {
    var userid;

    if ($scope.user) {
      userid = $scope.user + " <" + $scope.email + ">";
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
        $scope.$apply();
    }).catch(function(err) {
        // failure
        $scope.working = false;
        condole.log(err);
        $scope.$apply();
    });
  };
});


var myKey = [
'-----BEGIN PGP PUBLIC KEY BLOCK-----',
'Version: BCPG C# v1.6.1.0',
'',
'mQENBFWip3EBCADWJcyGfxOTWyW2inpYwqKKwyWGvz+/ypqxt7QSLlqgpUgNLznH',
'5PnuTuO9LO+QGMt2xYr5hxmv75/Xhj1OgpFB3ejh4B5dedFli1MBQ1fASHnqGIAY',
'hf8CHnrRsCpG9xsU4aAVoFyc4c/FbmLq8NlAz8yqHGx5zR2II0p3I9kYnQOywveD',
'zMhSmJiaH1hNbaBDiuzvWGX4Uya2KMZnTb5yhRcOLvgj5R6m1knq/fJVyqmrBoGZ',
'hiQ2UQOz5OmoPciu61pDiYBUjke4enUjJjOOfKsxy/hSanfjsDBLizNkjDJ6GTmt',
'qxg38ZCoTfle+B7OockT9M4exkt1FfDa1rbhABEBAAG0FnBncC5oZWxwQHNoYXls',
'b3IuY28udWuJARwEEAECAAYFAlWip3EACgkQ4cuI9adKJZkkewgAlybUl5vwtKaQ',
'fQnq079DIKp303NtfTp4zZpfk/rbnyewOYeS+GmKj7pbxJGwit9b4u2OLFUQtzjL',
'dcJPb41u5ACy89E8NIGyjlD8betiCnXnS6QT+4K+RZ7wmEKtOVToGQU6i8jy3W47',
'4sBWP6+WGTvbxmTAJlZG/0JlQ9lDXvRYTnFaNbhiYvQfA5uuLkqbmKdC4GR5RbIU',
'hqXWDAt/eIx+nr6tBjJ/zcz2yRiSMNayTSg4qk0Y/+eq6eIC+3sbf5Sv4Na+j1Q0',
'RfPOO22INIz7vY0ycd740lRhDrVoEQilkTWhQT0JtWD0gFQIeFARqqvDjghr/yBX',
'Uq0XqerlKg==',
'=n31g',
'-----END PGP PUBLIC KEY BLOCK-----',
].join('\n');
