var pgpApp = angular.module('pgpApp', []);

pgpApp.controller('KeyListCtrl', function ($scope) {
  k = {'alias': 'New Key...', 'new' : 'True'};
  $scope.selectit = k;
  $scope.keys = [k];
  pgpkeys = openpgp.key.readArmored(myKey);
  $scope.keys = $scope.keys.concat (pgpkeys.keys);
  $scope.selectedIndex = function() { return  $scope.keys.indexOf($scope.selectit);}
  $scope.onSelect = function(key) {
    $scope.selectit = key;
    $scope.$broadcast('selection', key);
  }

  $scope.$watch('$viewContentLoaded', function() {
    //This makes sure that when we load up we pass down the selection.
    $scope.onSelect($scope.selectit);
  });

  //TODO: All this stuff should be pushed to a generic module!
  $scope.isNew = function(key) { return key == k; }

  $scope.getUser = function(key) {
    if('alias' in key) {
      return key.alias;
    }
    if('primaryKey' in key) {
      return key.getPrimaryUser().user.userId.userid;
    }
    return key.keys();
  }

  $scope.getFingerprint = function(key) {
    if('primaryKey' in key) {
      return key.primaryKey.fingerprint;
    }
  }
});

pgpApp.controller('KeyWorkCtrl', function ($scope) {
  //$scope.key = "none yet";
  $scope.$on('selection', function(event, data) {
    $scope.key = data;
  });

  $scope.encryptMessage = function() {
    if ($scope.message && !$scope.isNew($scope.key)) {
      //return "DEC: " + message;
      openpgp.encryptMessage($scope.key, $scope.message).then(function(pgpMessage) {
        $scope.ciphertext = $scope.message + "\n" + pgpMessage;
        $scope.$apply();
      }).catch(function(error) {
        $scope.ciphertext = error;
        $scope.$apply();
      });
    } else {
      $scope.ciphertext = "";
    }
  }
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
