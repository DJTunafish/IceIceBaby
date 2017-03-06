
function loadCourseInfo($scope, $http) {
    console.log("loading a course " + sessionStorage.getItem("genCode"));
    $.getScript('scripts/constants.js', function () {
        $http({
            method: 'GET',
            url: serverURL + '/course',
            params: {gencode: sessionStorage.getItem("genCode")},
            headers: {'Authorization': sessionStorage.getItem("token")}
        }).then(function (response) {
            console.log("Get /course success " + response.data.course.gencode);
            if(response.data.result == "success"){
                sessionStorage.setItem("token", response.data.token);
                $scope.courseInfo = response.data.course.description;

            }
        });
    });
}

function displayCourseInfo($scope){
    $scope.displayPartial = "course";
}
