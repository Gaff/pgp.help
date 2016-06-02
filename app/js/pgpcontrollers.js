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


pgpApp.controller('chickenBoxCtrl', function ($scope, $uibModalInstance, content) {

  $scope.content = content;

  $scope.ok = function () {
    $uibModalInstance.close(true);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
