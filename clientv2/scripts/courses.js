

//set myReggedCourses in the scope
function setCourses($scope, reggedCourses){
    console.log("the regged courses are " + reggedCourses.data.course);
    $scope.myReggedCourses = reggedCourses.data.courses;
}

//get all of a students regged courses
function loadStudCourses($scope, $http){
    var courseResponse = null;
    console.log("LOLOLOLOL");
    $.getScript('scripts/constants.js', function() {

        $http({
        method: 'GET',
        url: serverURL + "/user/courses",
        params: {cid: sessionStorage.getItem("cid")},
        headers: {'Authorization': sessionStorage.getItem("token")}
        }).then(function(response) {
            if (response.data.result == "success") {
                console.log("Get /user/courses success");
                sessionStorage.setItem("token", response.data.token);
                courseResponse = response;
                setCourses($scope, courseResponse);
            } else {
                authenticationFailure(response.data);
            }
        });

    });

}
//loadPage should contain logic to check whether loading the
function loadCourses($scope){
    console.log("register loadpage");
    $scope.displayPartial = "register";
    console.log("displayPartial set to register");
}
