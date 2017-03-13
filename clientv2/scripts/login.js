function logIn($http, $scope){
  console.log("Sending login request");
  $.getScript('scripts/constants.js', function() {
    $http({
      method: 'POST',
      url: serverURL + "/login",
      data: {cid: $("#cid").val(),
             password: $("#password").val()}
      }).then(function successCallback(response) {
          if(response.data.result == "success"){
              console.log("Login successful");
              sessionStorage.setItem("token", response.data.token);
              sessionStorage.setItem("cid", response.data.cid);
              setLoggedIn();
              if(response.data.isadmin){
                setAdmin();
              }
              setDefaultMessage("Logged in! Welcome, " + sessionStorage.getItem("cid"));
              setDisplayPartial("default");
          }else{
            console.log("Login failed");
            $scope.errorMsg = "Username or password incorrect";
          }
        }, function errorCallback(response) {
          console.log("Failure in contacting server");
      });
  });
}


function loadLogPage($scope){
  $scope.displayPartial = "login";
}
