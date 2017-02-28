
//TODO: Ändra profile.html så att du kan sätta en variabel
//      för att visa olika saker beroende på om man kollar på sin egen
//      profil eller ej
function loadProfPage($scope, $http, cid){
  var studentResponse = null;
  var userResponse = null;
  $.getScript('scripts/constants.js', function() {
    $http({
      method: 'GET',
      url: serverURL + "/student",
      params: {cid: cid},
      headers: {'Authorization': sessionStorage.getItem("token")}
      }).then(function(response){
        if(response.data.result == "success"){
          console.log("success");
          sessionStorage.setItem("token", response.data.token);
          //$scope.profile = response.data.student.profile;
          studentResponse = response;
        }else{
          authenticationFailure(response.data);
        }
      });
      $http({
        method: 'GET',
        url: serverURL + "/user",
        params: {cid: cid},
        headers: {'Authorization': sessionStorage.getItem("token")}
      }).then(function(response){
        if(response.data.result == "success"){
          sessionStorage.setItem("token", response.data.token);
          //$scope.profile = response.data.student.profile;
          userResponse = response;
        }else{
          authenticationFailure(response.data);
        }
      }); //TODO here: Set all the shit in profile.html based on responses
  });
}
