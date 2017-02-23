
  console.log("load script");

  console.log("run function");
/*  var app = angular.module("myApp", ["ngRoute"]);
  app.config(function($routeProvider) {
      $routeProvider
      .when("/", {
          templateUrl : "main.htm"
      })
      .when("/login", {
          templateUrl : "'login.html'"
      })
      .when("/register", {
          templateUrl : "'partials/register.htm'"
      })
  });*/

  var mainApp = angular.module('myApp', []);
  //TODO: Default values for isAdmin & shite
  mainApp.controller('myCtrl', function($scope, $http) { 
    console.log("myCtrl");
    //Set functions for loading each page
    //The .js file for every view should have a loadPage($scope) function,
    //which is used in the sidenav to load the partial.
    
    $.getScript('scripts/login.js', function() {
      $scope.loadLogin = function(){
        loadLogPage($scope);
      };
    });
    $.getScript('scripts/register.js', function() {
      $scope.loadRegister = function(){
        loadRegPage($scope);
      }
    });

  });
  
/*  mainApp.controller('loginCtrl', function($scope, $http) {
      console.log("loginCtrl");
  });
*/
  mainApp.controller('regCtrl', function($scope, $http) {
    $scope.registerUser = function() {
        regUser($http);
    };

    console.log("HI HO");
  });   



