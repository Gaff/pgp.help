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
      $scope.stored = false;

      $scope.$state.go("key", {key:null, private:false});
    }, function () {
      //$log.info('Modal dismissed at: ' + new Date());
    });

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
