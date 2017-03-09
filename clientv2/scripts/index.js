
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

    /*
      Load in the script registerCourse.js, and link the method loadRegisterCoursePage (which is defined in there),
      to the variable loadCourseReg. loadCourseReg() is the method being ran when a user clicks on Register course.
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

    /*$.getScript('scripts/profile.js', function() {*/
    $scope.loadProfile = function(){
      console.log("Run loadProfile");
      sessionStorage.setItem("desiredProfile", sessionStorage.getItem("cid")); //TODO: Hella ad-hoc solution, will do for now
      $scope.displayPartial = "profile";
    };

    $scope.loadGroupManagement = function(){
      console.log("Load groupManagement");
      $scope.displayPartial = "groupManagement";
    }

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

  /*
    The controller for the register course partial. This is ran when the partial is first loaded, and its
    main purpose is to link methods to any eventual buttons and other action-able items in the partial.
  */
  mainApp.controller('registerCourseCtrl', function($scope, $http) {
    console.log("About to register to a course");
    //$scope.displayPartial = "registerCourse";
    $scope.registerCourse = function () {
      registerToCourse($http, $scope);
    };
  });

  //courseCtrl to load a students courses
  mainApp.controller('coursesCtrl', function ($scope, $http) {
    console.log("Try to get courses");
    $.getScript('scripts/courses.js', function () {
      loadStudCourses($scope, $http);
    });
  });

  /*
    Controller for a course, links loadCourseInfo til the courseCtrl html code
   */
  mainApp.controller('courseCtrl', function ($scope, $http) {
     console.log("Try getting a course");
     $.getScript('scripts/course.js', function () {
             loadCourseInfo($scope, $http);
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
