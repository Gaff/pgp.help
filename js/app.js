var app = angular.module('myApp', ['ngAnimate']);
app.controller('MyController', function($scope) {
  $scope.test = {'class' : '', 'hide' : false};

  $scope.quickhide = function() { $scope.test.hide = true; };
  $scope.slowhide = function() { $scope.test.hide = true; $scope.test.class = 'smartfade';};
  $scope.show = function() { $scope.test.hide = false; $scope.test.class = '';};
});
