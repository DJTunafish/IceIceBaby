<<<<<<< HEAD
function logIn($http, $scope){
  console.log("Sending login request");
  $.getScript('scripts/constants.js', function() {
    $http({
      method: 'POST',
      url: serverURL + "/login",
      data: {cid: $("#cid").val(),
             password: $("#password").val()}
      }).then(function successCallback(response) {
          console.log(response.data.result);
          console.log(response.data.token);
          if(response.data.result == "success"){
              sessionStorage.setItem("token", response.data.token);
              sessionStorage.setItem("cid", response.data.cid);
              setLoggedIn();
              if(response.data.access == "admin"){
                setAdmin();
              }
              console.log("Sessionstorage: " + sessionStorage.getItem("token"));
              setDefaultMessage("Logged in! Welcome!");
              setDisplayPartial("default"); //TODO Change redirect here once profile view available
          }else{
            console.log("Set errorMsg");
            $scope.errorMsg = "Username or password incorrect";
          }
        }, function errorCallback(response) {
          console.log("FAILURE");
      });
  });
}


function loadLogPage($scope){

=======


function loadLogPage($scope, $http){
  console.log("login loadPage");
>>>>>>> fca3fbf498d386c69500c0b06aabbf96ece04494
  $scope.displayPartial = "login";
}
