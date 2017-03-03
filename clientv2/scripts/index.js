
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
      console.log("setLoggedOut");
      $scope.loggedIn = false;
      $scope.isAdmin = false;
      sessionStorage.setItem("token", null);
      sessionStorage.setItem("cid", null);
    }
    //Set functions for loading each page
    //The .js file for every view should have a loadPage($scope) function,
    //which is used in the sidenav to load the partial.
    $scope.setLoggedOut = function(){
        setDefaultMessage("Logged out!");
        setLoggedOut();
    };

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
    //$.getScript('scripts/courses.js', function() {
    //console.log("in index.js/courseView");
    $scope.loadStudentCourseView = function(){
      $scope.displayPartial = "courses"
    };
    //});

    /*$.getScript('scripts/profile.js', function() {*/
    $scope.loadProfile = function(){
      console.log("Run loadProfile");
      sessionStorage.setItem("desiredProfile", sessionStorage.getItem("cid")); //TODO: Hella ad-hoc solution, will do for now
      $scope.displayPartial = "profile";
    };

    $scope.loadCourseReg = function(){
      console.log("Run loadCourseReg");
      $scope.displayPartial = "courseRegister"
    };

    console.log("'Bout to do session check stuff'");
    if(sessionStorage.getItem("cid")){
      console.log("Session data found");
      $.getScript('scripts/constants.js', function(){
        $http({
          method: 'GET',
          url: serverURL + "/user",
          params: {cid: sessionStorage.getItem("cid")},
          headers: {'Authorization': sessionStorage.getItem("token")}
        }).then(function(response){
          if(response.data.result == "success"){
            console.log("Verification successful");
            sessionStorage.setItem("token", response.data.token);
            $scope.loggedIn = true;
            $scope.defaultMsg = "Welcome, " + sessionStorage.getItem("cid");
            if(response.data.isAdmin){
              $scope.isAdmin = true;
            }
          }else{
            console.log("Verification failed");
            sessionStorage.setItem("cid", null);
            sessionStorage.setItem("token", null);
            $scope.defaultMsg = "Welcome to Ice!"
          }
        });
      });
    }else{
      console.log("No stored session data");
      $scope.defaultMsg = "Welcome to Ice!"
    }

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
    $scope.submitLogin = function() {
      logIn($http, $scope);
    };
  });

  //courseCtrl to load a students courses
  mainApp.controller('coursesCtrl', function ($scope, $http) {
    console.log("Try to get courses");
    $.getScript('scripts/courses.js', function () {
      loadStudCourses($scope, $http);
    });
  });

  mainApp.controller('profileCtrl', function($scope, $http){
    console.log("Run profileCtrl");
    $.getScript('scripts/profile.js', function() {
      $scope.updateProfileView = function(){
        updateProfile($scope, $http);
      };
      $scope.submitProfile = function(){
        submitProfile($scope, $http);
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

  mainApp.controller('courseRegCtrl', function($scope, $http){
    console.log("Controller for Course register view");
    $.getScript('scripts/courseReg.js', function(){
      $scope.registerCourse = function(){
        console.log("Anonymous function for registerCourse");
        registerCourse($scope, $http);
      }
    });
  });
