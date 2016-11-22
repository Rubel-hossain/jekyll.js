// Generated by CoffeeScript 1.11.1
angular.module('application', ['ngRoute', 'restangular']).config(function($routeProvider) {
  return $routeProvider.when("/", {
    templateUrl: "./assets/templates/landing.html"
  }).when("/editor", {
    templateUrl: "./assets/templates/editor.html"
  });
}).factory('tokenFactory', function($window, $rootScope) {
  return {
    saveProfile: function(url, token) {
      $window.localStorage.setItem('token', token);
      $window.localStorage.setItem('url', url);
      return $rootScope.$broadcast('tokenEvent');
    },
    clearProfile: function() {
      $window.localStorage.setItem('token', false);
      $window.localStorage.setItem('url', false);
      return $rootScope.$broadcast('tokenEvent');
    }
  };
}).controller('tokenController', function($scope, tokenFactory) {
  $scope.tokenMsg = 0;
  return $scope.newToken = function() {
    if (!$scope.token || !$scope.url) {
      $scope.tokenMsg = "Please fill in complete details on form";
    }
    return tokenFactory.saveProfile($scope.url, $scope.token);
  };
}).controller('navController', function($scope, $rootScope, $window, tokenFactory) {
  $scope.authenticated = $window.localStorage.getItem('token');
  $scope.logout = function() {
    return tokenFactory.clearProfile();
  };
  return $rootScope.$on("tokenEvent", function() {
    return $scope.authenticated = $window.localStorage.getItem('token');
  });
});
