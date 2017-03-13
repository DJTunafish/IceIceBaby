var suitors;
var suitorIndex;

//TODO: Don't allow user to see either view when already in group?

function loadTinderSelect($scope, $http, course){
 //TODO: handle case where there are no other ungrouped students
  $.getScript('scripts/constants.js', function() {
    console.log("Load matchmaking view");
    $http({
      method: 'GET',
      url: serverURL + "/course/ungrouped",
      params: {course: sessionStorage.getItem("genCode")},
      headers: {'Authorization': sessionStorage.getItem("token")}
    }).then(function(response){
      if(response.data.result == "success"){
        console.log("Successfully loaded matchmaking view");
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
          console.log("User already in group");
          setDefaultMessage("Please exit current group before entering new group");
          setDisplayPartial("default");
        }
      }
    }).catch(function(error){
      //TODO
      console.log("Failed to reach server");
    });
  });
}

function updateSuitor($scope){
  $scope.name = suitors[suitorIndex].firstname + " " + suitors[suitorIndex].lastname;
  $scope.profile = suitors[suitorIndex].profile;
  $scope.email = suitors[suitorIndex].email;
  $scope.cid = suitors[suitorIndex].cid;
}

function prevSuitor($scope){
  if(suitorIndex > 0){
    suitorIndex--;
    updateSuitor($scope);
  }
}

function sendInvite($scope, $http, invitee){
  console.log("Sending group invite from " + sessionStorage.getItem("cid") + "to " +
               ivitee);
  $.getScript('scripts/constants.js', function() {
    $http({
      method: 'POST',
      url: serverURL + "/groups/invite",
      data: {course: sessionStorage.getItem("genCode"),
             receiver: invitee},
      headers: {'Authorization': sessionStorage.getItem("token")}
    }).then(function(response){
      if(response.data.result == "success"){
        console.log("Successfully sent invite");
        sessionStorage.setItem("token", response.data.token);
        setDefaultMessage(response.data.message);
        setDisplayPartial("default");
      }else{
        authenticationFailure(response.data);
      }
    }).catch(function(error){
      console.log("Error in contacting server: " + error);
    });
  });
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
    console.log("Load group selection view");
    $http({
      method: 'GET',
      url: serverURL + "/groups",
      params: {course: sessionStorage.getItem("genCode")},
      headers: {'Authorization': sessionStorage.getItem("token")}
    }).then(function(response){
      if(response.data.result == "success"){
        console.log("Successfully fetched data from server");
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
  console.log("Create new group");
  $.getScript('scripts/constants.js', function() {
    $http({
      method: 'POST',
      url: serverURL + "/groups/join",
      data: {student: sessionStorage.getItem("cid"),
             course: sessionStorage.getItem("genCode")},
      headers: {'Authorization': sessionStorage.getItem("token")}
    }).then(function(response){
      if(response.data.result == "success"){
        console.log("Successfully created group");
        sessionStorage.setItem("token", response.data.token);
        setDefaultMessage("Successfully created group!");
        setDisplayPartial("default");
      }else{
        console.log("Failure");
        authenticationFailure(response.data);
      }
    });
  });
}

function showProfile($scope, $http, course, cid){
  sessionStorage.setItem("desiredProfile", cid);
  setDisplayPartial("profile");
}

function joinGroup($scope, $http, course, groupNo){
  console.log("User " + sessionStorage.getItem("cid") +
              " joining group "  + groupNo + " in course " + course);
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
        console.log("Successfully joined group");
        sessionStorage.setItem("token", response.data.token);
        setDefaultMessage("Successfully joined group " + groupNo + "!");
        setDisplayPartial("default");
      }else{
        authenticationFailure(response.data);
      }
    }).catch(function(error){
      console.log("Error in contacting server");
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
