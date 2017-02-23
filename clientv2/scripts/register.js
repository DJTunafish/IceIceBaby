

  function regUser($http){
    $.getScript('scripts/constants.js', function() {
      $http({
        method: 'POST', 
        url: serverURL + "/courses",
        data: {text: "HEYYHEYHEYHEY"}
        }).then(function successCallback(response) {
            console.log(response.data.text);
          }, function errorCallback(response) {
            console.log("FAILURE");
        });
    });
  /*    $.ajax({url: "localhost:3000/profile", success: function(result){
        console.log("result");
      }});*/
  }

  //loadPage should contain logic to check whether loading the 
  function loadRegPage($scope, $http){
    console.log("register loadpage");
    $scope.displayPartial = "register";
    console.log("displayPartial set to register");
  }






