
//Create a course
function createCourse($http, $scope){
    console.log($("#gencode").val());
    $.getScript('scripts/constants.js', function() {
        $http({
            method: 'POST',
            url: serverURL + "/createcourse",
            data: {gencode: $("#gencode").val(),
                coursecode: $("#coursecode").val(),
                name: $("#name").val(),
                description: $("#cDesc").val(),
                admin: sessionStorage.getItem("cid")}
        }).then(function successCallback(response) {
            console.log("Result: " + response.data.result);
            if(response.data.result == "success"){
                setDisplayPartial("default");
                setDefaultMessage("Successfully create course!");
            }else{
                $scope.errorMsg = "Failed to create new course. Course already exists"
            }
        }, function errorCallback(response) {
            console.log("FAILURE");
        });
    });
}

//display the createCourse page
function displayCreateCourse($scope) {
    $scope.displayPartial = "createCourse";
}
