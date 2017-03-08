var suitors;
var suitorIndex;

function loadTinderSelect($scope, $http, course){
 //TODO: handle case where there are no other ungrouped students
  $.getScript('scripts/constants.js', function() {
    $http({
      method: 'GET',
      url: serverURL + "/course/ungrouped",
      params: {course: sessionStorage.getItem("genCode")},
      headers: {'Authorization': sessionStorage.getItem("token")}
    }).then(function(response){
      if(response.data.result == "success"){
        sessionStorage.setItem("token", response.data.token);
        var user = response.data.ungroupedStudents.find(function(s){
          return s.cid == sessionStorage.getItem("cid");
        });
        if(user){
          response.data.ungroupedStudents.sort(
            function(a, b){
              return (Math.abs(a.score - user.score)) - (Math.abs(b.score - user.score));
            }
          );
          suitors = response.data.ungroupedStudents;
          suitorIndex = 0;
          suitors.splice(suitors.indexOf(user), 1);
          $scope.tinderSelect = true;
          $scope.selectGroup = false;
          updateSuitor($scope);
        }else{
          setDefaultMessage("Please exit current group before entering new group");
          setDisplayPartial("default");
        }
      }
    }).catch(function(error){
      //TODO
    });
  });
}

function updateSuitor($scope){
  $scope.name = suitors[suitorIndex].firstname + " " + suitors[suitorIndex].lastname;
  $scope.profile = suitors[suitorIndex].profile;
  $scope.email = suitors[suitorIndex].email;
}

function prevSuitor($scope){
  if(suitorIndex > 0){
    suitorIndex--;
    updateSuitor($scope);
  }
}

function sendInvite($scope, $http, invitee){
//TODO, once proper route exists
}

function nextSuitor($scope){
  if(suitorIndex + 1 < suitors.length){
    suitorIndex++;
    updateSuitor($scope);
  }
}

function displayGroupJoin($scope) {
  $scope.displayPartial = "groupJoin";
}

function loadGroupSelect($scope, $http, course){
  $.getScript('scripts/constants.js', function() {
    $http({
      method: 'GET',
      url: serverURL + "/groups",
      params: {course: sessionStorage.getItem("genCode")},
      headers: {'Authorization': sessionStorage.getItem("token")}
    }).then(function(response){
      if(response.data.result == "success"){
        sessionStorage.setItem("token", response.data.token);
        var groups = new Array();
        for(let i = 0; i < response.data.groups.length;i++){
          if(response.data.groups[i]){
            groups.push(response.data.groups[i]);
          }
        }
        $scope.groups = groups;
      }else{
        authenticationFailure(response.data);
      }
    });
  });
  $scope.tinderSelect = false;
  $scope.selectGroup = true;
}

function createGroup($scope, $http, course){
  console.log("createGroup");
  $.getScript('scripts/constants.js', function() {
    $http({
      method: 'POST',
      url: serverURL + "/groups/join",
      data: {student: sessionStorage.getItem("cid"),
             course: sessionStorage.getItem("genCode")},
      headers: {'Authorization': sessionStorage.getItem("token")}
    }).then(function(response){
      if(response.data.result == "success"){
        sessionStorage.setItem("token", response.data.token);
        setDefaultMessage("Successfully created group!");
        setDisplayPartial("default");
      }else{
        authenticationFailure(response.data);
      }
    });
  });
}

function showProfile($scope, $http, course, cid){
 //TODO: Temp fix
  sessionStorage.setItem("desiredProfile", cid);
  setDisplayPartial("profile");
}

function joinGroup($scope, $http, course, groupNo){
  console.log("joinGroup: " + groupNo);
  $.getScript('scripts/constants.js', function() {
    $http({
      method: 'POST',
      url: serverURL + "/groups/join",
      data: {id: groupNo,
             student: sessionStorage.getItem("cid"),
             course: sessionStorage.getItem("genCode")},
      headers: {'Authorization': sessionStorage.getItem("token")}
    }).then(function(response){
      if(response.data.result == "success"){
        sessionStorage.setItem("token", response.data.token);
        setDefaultMessage("Successfully joined group " + groupNo + "!");
        setDisplayPartial("default");
      }else{
        authenticationFailure(response.data);
      }
    }).catch(function(error){
      setDefaultMessage(error);
      setDisplayPartial("default");
    });
  });
}

function inGroup($http, course, cid){
  $.getScript('scripts/constants.js', function() {
      $http({
        method: 'GET',
        url: serverURL + "/groups",
        params: {course: sessionStorage.getItem("genCode")},
        headers: {'Authorization': sessionStorage.getItem("token")}
      }).then(function(response){
        for(let i = 0; i < response.data.groups.length;i++){
          if(response.data.groups[i]){
            for(let j= 0; j < response.data.groups[i].members.length;j++){
              if(response.data.groups[i].members[j] == cid){
                return true;
              }
            }
          }
        }
        return false;
      });
  });
}
