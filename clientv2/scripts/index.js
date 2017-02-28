
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
    /*$.getScript('scripts/profile.js', function() {*/
        console.log("loadProfile: " + $scope.loadProfile);
        $scope.loadProfile = function(){
          console.log("Run loadProfile");
          $scope.displayPartial = "profile";
        }
        console.log("loadProfile: " + $scope.loadProfile);
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

  mainApp.controller('profileCtrl', function($scope, $http){
    console.log("Run profileCtrl");
    //TODO: Set token in header, write function for authenticating
    $.getScript('scripts/constants.js', function() {
      $http({
        method: 'GET',
        url: serverURL + "/student",
        params: {cid: sessionStorage.getItem("cid")},
        headers: {'Authorization': sessionStorage.getItem("token")}
        }).then(function(response){
          if(response.data.result == "success"){
            console.log("success");
            sessionStorage.setItem("token", response.data.token);
            $scope.profile = response.data.student.profile;
          }else{
            console.log("failure");
            console.log(sessionStorage.getItem("cid"));
            authenticationFailure(response.data);
          }
        });
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
