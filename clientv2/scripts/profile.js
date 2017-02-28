
//TODO: Ändra profile.html så att du kan sätta en variabel
//      för att visa olika saker beroende på om man kollar på sin egen
//      profil eller ej
function updateProfile($scope, $http){
  //TODO: What do when user wants to update profile
}

function setInitialProfileValues($scope, studentResponse, userResponse, coursesResponse, cid){
  console.log("'Bout to set some values, boss'");
  console.log("given cid: " + userResponse.data.user.cid);
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