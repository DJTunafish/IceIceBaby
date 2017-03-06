/*
  This function will make a HTTP POST request trying to register a user at a given course.

  The course gencode is stored in the HTML element with ID 'gencode'
*/
function registerToCourse($http, $scope){
  $.getScript('scripts/constants.js', function() {
    $http({
      method: 'POST',
      url: serverURL + "/course/register",
      data: {gencode: $('#gencode').val()},
      /* Need to pass along the token to make sure user is authorized, aka logged in. */
      headers: {'Authorization': sessionStorage.getItem("token")}
    }).then(function(response) {
      if(response.data.result == "success") {
        /*
          Update token, set default partial and show the message given by the response.
          Just because the result label is set to success does not mean the query went through
          in the database. It will have been rejected if the user is already registered.
        */
        sessionStorage.setItem("token", response.data.token);
        setDisplayPartial("default");
        setDefaultMessage(response.data.message);
      } else {
        authenticationFailure(response.data);
      }
    });
  })
}

/*
  Simply loads the partial we are about to show. In this case, registerCourse.
*/
function loadRegisterCoursePage($scope){
  $scope.displayPartial = "registerCourse";
}
