pgpApp.controller('KeyListCtrl', function ($scope, $location, $uibModal) {

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

  $scope.isStored = function() {
    if(typeof(Storage) !== "undefined") {
      var ls = window.localStorage;
      //TODO fetch these strings from openpgpjs lib
      var prk = ls.getItem("openpgp-private-keys");
      var puk = ls.getItem("openpgp-public-keys");
      //empty lists are persisted. See:
      //https://github.com/openpgpjs/openpgpjs/pull/344
      if((prk && prk != "[]" ) || (puk && puk != "[]")) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
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
  $scope.skipintro = $scope.allKeys().length > 2 ? true : false; //Should we start in basic mode?
  $scope.persist = $scope.isStored();
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

  $scope.$watch('persist', function() {
    if ($scope.persist) {
      $scope.workstarted = true;
      $scope.unstoredPrivateKeys = false;
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

  $scope.isStorageSafe = function() {
    return getOrigin() == "file://";
  }

  $scope.$on('generate', function(event) {
    //TODO: Really the get should be able to tell us if it was
    //generated or imported. Maybe?
    if(!$scope.persist) {
      $scope.unstoredPrivateKeys = true;
    }
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
    };
  };

  $scope.purgeKeys = function() {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'templates/chickenBox.html',
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

      $scope.$state.go("key", {key:null, private:false});
    }, function () {
      //$log.info('Modal dismissed at: ' + new Date());
    });

  };

});
