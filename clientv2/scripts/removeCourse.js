
//show the page for removing a course
function displayRemoveCourse($scope){
    if($scope.isAdmin) {
        $scope.displayPartial = "removeCourse";
    }
}

//remove a course from the database
function confirmRemoveCourse($http, $scope) {
    if($scope.isAdmin) {
        $.getScript('scripts/constants.js', function () {
            console.log("in remove corse");
            $http({
                method: 'POST',
                url: serverURL + "/admin/removecourse",
                data: {
                    gencode: sessionStorage.getItem("genCode")
                },
                headers: {'Authorization': sessionStorage.getItem("token")}
            }).then(function successCallback(response) {
                console.log("Result: " + response.data.result);
                if (response.data.result == "success") {
                    sessionStorage.setItem("token", response.data.token);
                    setDisplayPartial("default");
                    setDefaultMessage("Successfully removed course!");
                } else {
                    $scope.errorMsg = "Failed to removed course."
                }
            }, function errorCallback(response) {
                console.log("FAILURE" + response.data.result);
            });
        });
    }

}