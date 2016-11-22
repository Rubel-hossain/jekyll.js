// Generated by CoffeeScript 1.11.1
angular.module('application', ['ngRoute', 'restangular']).config(function($routeProvider, RestangularProvider) {
  $routeProvider.when("/", {
    templateUrl: "./assets/templates/landing.html",
    controller: "displayController"
  }).when("/new", {
    templateUrl: "./assets/templates/new.html"
  }).when("/editor", {
    templateUrl: "./assets/templates/editor.html"
  });
  RestangularProvider.setBaseUrl("https://api.github.com/");
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
}).factory('utilsFactory', function() {
  return {
    getUsername: function(url) {
      return url.split('.')[0];
    },
    getPostTitle: function(gitTitle) {
      var temp;
      temp = gitTitle.split('-').slice(3).join(" ");
      return temp.split('.')[0];
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
  console.log("URL : " + $window.localStorage.getItem('url'));
  console.log("TOKEN : " + $window.localStorage.getItem('token'));
  $scope.logout = function() {
    return tokenFactory.clearProfile();
  };
  return $rootScope.$on("tokenEvent", function() {
    return $scope.authenticated = $window.localStorage.getItem('token');
  });
}).controller('displayController', function($scope, $window, $rootScope, Restangular) {
  $scope.authenticated = $window.localStorage.getItem('token');
  return $rootScope.$on("tokenEvent", function() {
    return $scope.authenticated = $window.localStorage.getItem('token');
  });
}).controller('dashboardController', function($scope, $window, Restangular, utilsFactory) {
  $scope.utils = utilsFactory;
  $scope.url = $window.localStorage.getItem('url');
  $scope.token = $window.localStorage.getItem('token');
  $scope.username = utilsFactory.getUsername($window.localStorage.getItem('url'));
  return Restangular.setDefaultHeaders({
    'Authorization': 'Basic ' + $scope.token
  }).one('/repos/' + $scope.username + '/' + $scope.url + '/contents/_posts').get().then(function(response) {
    return $scope.posts = response;
  });
});
