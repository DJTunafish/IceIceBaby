
function loadCourseInfo($scope, $http, courseCode) {
    console.log("loading a course " + courseCode);
    $.getScript('scripts/constants.js', function () {
        $http({
            method: 'GET',
            url: serverURL + '/course',
            params: {gencode: courseCode},
            headers: {'Authorization': sessionStorage.getItem("token")}
        }).then(function (response) {
            console.log("Get /course success " + courseCode);
            if(response.data.result == "success"){
                sessionStorage.setItem("token", response.data.token);
                $scope.courseInfo = response.data.courseResponse.description;
            }
        })
    })
}
