
//Create a course
function createCourse($http, $scope){
    if($scope.isAdmin) {
        $.getScript('scripts/constants.js', function () {
            console.log("Attempting to create course");
            $http({
                method: 'POST',
                url: serverURL + "/admin/createcourse",
                data: {
                    gencode: $("#gencode").val(),
                    coursecode: $("#coursecode").val(),
                    name: $("#name").val(),
                    description: $("#cDesc").val(),
                    admin: sessionStorage.getItem("cid")
                },
                headers: {'Authorization': sessionStorage.getItem("token")}
            }).then(function successCallback(response) {
                if (response.data.result == "success") {
                    sessionStorage.setItem("token", response.data.token);
                    setDisplayPartial("default");
                    setDefaultMessage("Successfully created course!");
                } else {
                    $scope.errorMsg = "Failed to create new course. Course already exists"
                }
            }, function errorCallback(response) {
                console.log("FAILURE" + response.data.result);
            });
        });
    }
}

//display the createCourse page
function displayCreateCourse($scope) {
    if($scope.isAdmin) {
        $scope.displayPartial = "createCourse";
    }
}
