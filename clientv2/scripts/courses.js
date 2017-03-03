

//set myReggedCourses in the scope
function setCourses($scope, reggedCourses){
    console.log("the regged courses are " + reggedCourses.data.courses);
}

//get all of a students regged courses
function loadStudCourses($scope, $http){
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
                $scope.myReggedCourses = response.data.courses;
            } else {
                authenticationFailure(response.data);
            }
        });

    });

}
