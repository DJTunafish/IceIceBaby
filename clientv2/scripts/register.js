  function regUser($http, $scope){ //TODO: Check everything non-empty and shite
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
            console.log("Result: " + response.data.result);
            if(response.data.result == "success"){
   //           $.getScript('scripts/index.js', function(){
                setDisplayPartial("default");
                setDefaultMessage("Successfully registered user!");
     //         });
            }else{
              $scope.errorMsg = "Failed to register new user. User already exists"
            }
          }, function errorCallback(response) {
            console.log("FAILURE");
        });
    });
  }

  //loadPage should contain logic to check whether loading the 
  function loadRegPage($scope, $http){
    console.log("register loadpage");
    $scope.displayPartial = "register";
    console.log("displayPartial set to register");
  }






