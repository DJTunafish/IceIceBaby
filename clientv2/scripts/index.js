
  var setDisplayPartial;
  var setDefaultMessage;
  var setLoggedIn;
  var setAdmin;
  var setLoggedOut;
  var getGScope;

  var mainApp = angular.module('myApp', []);

  mainApp.controller('myCtrl', function($scope, $http) {
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
      sessionStorage.setItem("token", null);
      sessionStorage.setItem("cid", null);
      setDisplayPartial("default");
      setDefaultMessage("Welcome to ICE! Please log in or register.");
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

    $.getScript('scripts/createCourse.js', function () {
        $scope.loadCreateCourse = function () {
            displayCreateCourse($scope);
        }
    })

    /*
      Load in the script registerCourse.js, and link the method
      loadRegisterCoursePage (which is defined in there),
      to the variable loadCourseReg.
      loadCourseReg() is the method being ran when a user clicks
      on Register course.
    */
    $.getScript('scripts/registerCourse.js', function() {
      $scope.loadCourseReg = function(){
        loadRegisterCoursePage($scope);
      };
    });

    /*
      sets sessionstorage gencode to the coursecode given by the html file,
      then displays the course info
     */
    $.getScript('scripts/course.js', function () {
        $scope.loadCourse = function (courseCode) {
          sessionStorage.setItem("genCode", courseCode);
          displayCourseInfo($scope);
        }
    });

    $.getScript('scripts/groupJoin.js', function () {
      $scope.loadGroups = function () {
        displayGroupJoin($scope);
      }
    })

    //loads the view for a students courses
    $scope.loadStudentCourseView = function(){
      $scope.displayPartial = "courses"
    };

    $scope.loadQuizView = function(){
      $scope.displayPartial = "quiz"
    };

    /*$.getScript('scripts/profile.js', function() {*/
    $scope.loadProfile = function(){
      sessionStorage.setItem("desiredProfile", sessionStorage.getItem("cid")); //TODO: Hella ad-hoc solution, will do for now
      $scope.displayPartial = "profile";
    };

    $scope.loadGroupManagement = function(){
      $scope.displayPartial = "groupManagement";
    }

    console.log("Check for authentication information in session");
    if(sessionStorage.getItem("cid")){
      console.log("Authentication data found, attempting authentication");
      $.getScript('scripts/constants.js', function(){
        $http({
          method: 'GET',
          url: serverURL + "/user",
          params: {cid: sessionStorage.getItem("cid")},
          headers: {'Authorization': sessionStorage.getItem("token")}
        }).then(function(response){
          if(response.data.result == "success"){
            console.log("Authentication successful");
            sessionStorage.setItem("token", response.data.token);
            $scope.loggedIn = true;
            $scope.defaultMsg = "Welcome, " + sessionStorage.getItem("cid");
            if(response.data.isAdmin){
              $scope.isAdmin = true;
            }
          }else{
            console.log("Authentication failed, deleting auth data from session");
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
  });

  //controller for creating a course
  mainApp.controller('createCourseCtrl', function ($scope, $http) {
    $scope.submitCreateCourse = function(){
      createCourse($http, $scope);
    }
  })

  mainApp.controller('loginCtrl', function($scope, $http) {
    $scope.submitLogin = function() {
      logIn($http, $scope);
    };
  });

  /*
    The controller for the register course partial. This is ran when the partial is first loaded, and its
    main purpose is to link methods to any eventual buttons and other action-able items in the partial.
  */
  mainApp.controller('registerCourseCtrl', function($scope, $http) {
    $scope.registerCourse = function () {
      registerToCourse($http, $scope);
    };
  });

  //courseCtrl to load a students courses
  mainApp.controller('coursesCtrl', function ($scope, $http) {
    $.getScript('scripts/courses.js', function () {
      loadStudCourses($scope, $http);
    });
  });

  /*
    Controller for a course, links loadCourseInfo til the courseCtrl html code
   */
  mainApp.controller('courseCtrl', function ($scope, $http) {
     $.getScript('scripts/course.js', function () {
             loadCourseInfo($scope, $http);
     });
  });

  mainApp.controller('quizCtrl', function ($scope, $http) {
     $.getScript('scripts/quiz.js', function () {
             loadQuiz($scope, $http);
     });
     $scope.submitQuizAnswers = function(){
       submitQuizAnswers($scope, $http);
     };
  });

  mainApp.controller('profileCtrl', function($scope, $http){
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

  mainApp.controller('groupJoinCtrl', function($scope, $http){
    $.getScript('scripts/groupJoin.js', function(){
      if(inGroup($http, sessionStorage.getItem("currentCourse"), sessionStorage.getItem("cid"))){
        setDefaultMessage("You already belong to a group in this course." +
                          "Please leave your current group before joinin another.");
        setDisplayPartial("default");
      }else{
        $scope.loadTinderSelect = function(){
          loadTinderSelect($scope, $http, sessionStorage.getItem("currentCourse"));
        };
        $scope.loadGroupSelect = function(){
          loadGroupSelect($scope, $http, sessionStorage.getItem("currentCourse"));
        };
        $scope.createGroup = function(){
          createGroup($scope, $http, sessionStorage.getItem("currentCourse"));
        };
        $scope.showProfile = function(cid){
          showProfile($scope, $http, sessionStorage.getItem("currentCourse"), cid);
        };

        $scope.joinGroup = function(groupNo){
          joinGroup($scope, $http, sessionStorage.getItem("currentCourse"), groupNo);
        };
        $scope.prevSuitor = function(){
          prevSuitor($scope);
        };
        $scope.sendInvite = function(invitee){
          sendInvite($scope, $http, invitee);
        };
        $scope.nextSuitor = function(){
          nextSuitor($scope);
        };
      }
    });
  });

  mainApp.controller('groupManageCtrl', function($scope, $http){
    $.getScript('scripts/groupManagement.js', function(){
      $scope.acceptInvite = function(sender, course){
        acceptInvite($scope, $http, course, sender);
      };

      $scope.leaveGroup = function(groupNo, course){
        leaveGroup($scope, $http, groupNo, course);
      };

      $scope.loadGroupInvites = function(){
        loadGroupInvites($scope, $http);
      };

      $scope.loadGroupList = function(){
        loadGroupList($scope, $http);
      };

      $scope.showProfile = function(cid){
        showProfile($scope, $http, cid);
      };
    });
  });
