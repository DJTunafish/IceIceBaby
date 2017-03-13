
function updateProfile($scope, $http){
  $scope.updateProfile = true;
}

function submitProfile($scope, $http){
  if($("#nPassword").val() != "" && $("#nPassword").val() != $("#nPasswordConf").val()){
    $scope.updateError = "Passwords do not match";
  }else{
    $http({
      method: 'POST',
      url: serverURL + "/user",
      data: {profile : $("#profile").val(),
             email : $("#email").val(),
             password: $("#nPassword").val()},
      headers: {'Authorization': sessionStorage.getItem("token")}
    }).then(function(response){
      if(response.data.result == "success"){
        sessionStorage.setItem("token", response.data.token);
        $scope.updateProfile = false;
        setDefaultMessage("Profile updated!");
        setDisplayPartial("default");
      }else{
        authenticationFailure(response.data);
      }
    });
  }

}

function setInitialProfileValues($scope, studentResponse, userResponse, coursesResponse, cid){
  $scope.ownProfile = cid == sessionStorage.getItem("cid");
  $scope.updateProfile = false;
  $scope.name = userResponse.data.user.firstname + " " + userResponse.data.user.lastname;
  $scope.user = userResponse.data.user.cid;
  $scope.email = userResponse.data.user.email;
  $scope.profile = studentResponse.data.student.profile;
  $scope.reggedCourses = coursesResponse.data.courses;
}

function loadProfPage($scope, $http, cid){
  var studentResponse = null;
  var userResponse = null;
  var coursesResponse = null;
  $.getScript('scripts/constants.js', function() {
    /* Check that there is a student with this CID */
    $http({
      method: 'GET',
      url: serverURL + "/student",
      params: {cid: cid},
      headers: {'Authorization': sessionStorage.getItem("token")}
      }).then(function(response){
        if(response.data.result == "success"){
          console.log("Get /student success");
          sessionStorage.setItem("token", response.data.token);
          studentResponse = response;
          /* If there is a student, retrieve the user-entry associated with it */
          $http({
            method: 'GET',
            url: serverURL + "/user",
            params: {cid: cid},
            headers: {'Authorization': sessionStorage.getItem("token")}
          }).then(function(response){
            if(response.data.result == "success"){
              console.log("Get /user success");
              sessionStorage.setItem("token", response.data.token);
              userResponse = response;
              /* Retrieve the courses the user is registered at */
              $http({
                method: 'GET',
                url: serverURL + "/user/courses",
                params: {cid: cid},
                headers: {'Authorization': sessionStorage.getItem("token")}
              }).then(function(response){
                if(response.data.result == "success"){
                  console.log("Get /user/courses success");
                  sessionStorage.setItem("token", response.data.token);
                  coursesResponse = response;
                  setInitialProfileValues($scope, studentResponse, userResponse, coursesResponse, cid);
                }else{
                  authenticationFailure(response.data);
                }
              });
            }else{
              authenticationFailure(response.data);
            }
          });
        }else{
          authenticationFailure(response.data);
        }
      });
  });
}
