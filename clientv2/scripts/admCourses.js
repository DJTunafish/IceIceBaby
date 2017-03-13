//set myReggedCourses in the scope
function displayAdminCourses($scope){
    if($scope.isAdmin) {
        console.log("trying to display admin courses");
        $scope.displayPartial = "adm-courses";
    }
}

//get all of a admins courses
function loadAdminCourses($http, $scope){
    if($scope.isAdmin) {
        console.log("loading admin course with admin " + sessionStorage.getItem("cid"));
        $.getScript('scripts/constants.js', function () {
            $http({
                method: 'GET',
                url: serverURL + "/admin/courses",
                params: {cid: sessionStorage.getItem("cid")},
                headers: {'Authorization': sessionStorage.getItem("token")}
            }).then(function (response) {
                if (response.data.result == "success") {
                    console.log("Get /admin/courses success");
                    sessionStorage.setItem("token", response.data.token);
                    console.log(response.data.courses);
                    $scope.myAdminCourses = response.data.courses;
                } else {
                    authenticationFailure(response.data);
                }
            }).catch(function (err) {
                console.log(err);
            });

        });
    }

}
