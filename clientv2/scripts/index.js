
  var setDisplayPartial;
  var setDefaultMessage;
  var setLoggedIn;
  var setAdmin;
  var setLoggedOut;
  var getGScope;

  function testPrint(){
    console.log("HOWDY");
  }

  var mainApp = angular.module('myApp', []);

/*  mainApp.config([
    "$httpProvider",
    function($httpProvider){
        $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
    }
  ]);*/

  //TODO: Check if token & cid already in sessionStorage
  mainApp.controller('myCtrl', function($scope, $http) {
    console.log("myCtrl");
    console.log(sessionStorage.getItem("token"));
    getGScope = function(){
      return $scope;
    };
    //Set environment variables
    setDisplayPartial = function(partialToDisplay){
      $scope.displayPartial = partialToDisplay;
    };

    setDefaultMessage = function(msg) {
      $scope.defaultMsg = msg;
    };

    setLoggedIn = function() {
      $scope.loggedIn = true;
    }

    setAdmin = function() {
      $scope.isAdmin = true;
    }

    setLoggedOut = function() {
      $scope.loggedIn = false;
      $scope.isAdmin = false;
    }

    $scope.defaultMsg = "Welcome to Ice!"

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

    //loads the view for a students courses
    $.getScript('scripts/courses.js', function() {
      console.log("in index.js/courseView");
      $scope.loadStudentCourseView = function(){
        loadStudCourses($scope, $http);
        $scope.displayPartial = "courses"
      }
    });

    /*$.getScript('scripts/profile.js', function() {*/
    $scope.loadProfile = function(){
      console.log("Run loadProfile");
      sessionStorage.setItem("desiredProfile", sessionStorage.getItem("cid")); //TODO: Hella ad-hoc solution, will do for now
      $scope.displayPartial = "profile";
    }
  /*  });*/

  });

  function authenticationFailure(data){
    sessionStorage.setItem("cid", null);
    sessionStorage.setItem("token", null);
    setLoggedOut();
    setDefaultMessage(data.message);
    setDisplayPartial("default");
  }

  mainApp.controller('regCtrl', function($scope, $http) {
    $scope.errorMsg = "";
    $scope.registerUser = function() {
        regUser($http, $scope);
    };

    console.log("HI HO");
  });

  mainApp.controller('loginCtrl', function($scope, $http) {
    console.log("Set submitLogin n shit");
    $scope.errorMsg = "Proof this exists, set in logInCtrl";
    $scope.submitLogin = function() {
      logIn($http, $scope);
    };
  });

  //courseCtrl to load a students courses
  mainApp.controller('coursesCtrl', function ($scope, $http) {
    console.log("Try to get courses");
    $.getScript('scripts/courses.js', function () {
      loadStudCourses($scope, $http, sessionStorage.getItem("desiredProfile"));
    });
  });

  mainApp.controller('profileCtrl', function($scope, $http){
    console.log("Run profileCtrl");
    $.getScript('scripts/profile.js', function() {
      $scope.updateProfileView = function(){
        updateProfile($scope, $http);
      };
      loadProfPage($scope, $http, sessionStorage.getItem("desiredProfile"));
    });
  });

  mainApp.controller('defCtrl', function($scope, $http){
/*    if(getGScope().loggedIn){
      console.log("Set loadProfile");
      getGScope().loadProfile = function(){
        console.log("Set displayPartial to profile");
        setDisplayPartial("profile");
      };
    }
    console.log(getGScope().loadProfile);*/
  });
