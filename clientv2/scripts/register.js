/*
  Register a new user to the application by sending a POST
  request to the server
*/
  function regUser($http, $scope){
    console.log("Attempting to register new user");
    $.getScript('scripts/constants.js', function() {
      $http({
        method: 'POST',
        url: serverURL + "/register",
        data: {cid: $("#cid").val(),
               firstname: $("#fName").val(),
               lastname: $("#lName").val(),
               personnumber: $("#personnumber").val(),
               password: $("#password").val(),
               email: $("#email").val()}
        }).then(function successCallback(response) {
            console.log("Register result: " + response.data.result);
            if(response.data.result == "success"){
                setDefaultMessage("Successfully registered user!");
                setDisplayPartial("default");
            }else{
              $scope.errorMsg = "Failed to register new user. User already exists"
            }
          }, function errorCallback(response) {
            console.log("FAILURE");
        });
    });
  }

/*
  Simple setter for the displayPartial variable
*/
  function loadRegPage($scope, $http){
    $scope.displayPartial = "register";
  }
