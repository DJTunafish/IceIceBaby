
function displayRemoveCourse($scope){
    $scope.displayPartial = "removeCourse"
}

function confirmRemoveCourse($http, $scope) {
    $.getScript('scripts/constants.js', function() {
        console.log("in remove corse");
        $http({
            method: 'POST',
            url: serverURL + "/admin/removecourse",
            data: {
                gencode: sessionStorage.getItem("genCode")
            }
        }).then(function successCallback(response) {
            console.log("Result: " + response.data.result);
            if(response.data.result == "success"){
                setDisplayPartial("default");
                setDefaultMessage("Successfully removed course!");
                $scope.displayPartial = "default";
            }else{
                $scope.errorMsg = "Failed to removed course."
            }
        }, function errorCallback(response) {
            console.log("FAILURE" + response.data.result);
        });
    });

}