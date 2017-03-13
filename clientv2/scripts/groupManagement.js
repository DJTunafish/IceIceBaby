function acceptInvite($scope, $http, course, sender){
  console.log("Accept invite");
  $http({
    method: 'PUT',
    url: serverURL + "/groups/invite",
    data: {course: course,
           sender: sender},
    headers: {'Authorization': sessionStorage.getItem("token")}
  }).then(function(response){
    if(response.data.result == "success"){
      console.log("Successfully accepted invite");
      sessionStorage.setItem("token", response.data.token);
      setDefaultMessage("Joined group with user " + sender + "!");
      setDisplayPartial("default");
    }else{
      authenticationFailure(response.data);
    }
  }).catch(function(error){
    console.log(error);//TODO
  });
}

function leaveGroup($scope, $http, groupNo, course){
  console.log("User " + sessionStorage.getItem("cid") +
              " leaving group " + groupNo + " in course " + course);
  $http({
    method: 'POST',
    url: serverURL + "/groups/leave",
    data: {id: groupNo,
           student: sessionStorage.getItem("cid"),
           course: course},
    headers: {'Authorization': sessionStorage.getItem("token")}
  }).then(function(response){
    if(response.data.result == "success"){
      console.log("Successfully left group");
      sessionStorage.setItem("token", response.data.token);
      setDefaultMessage("Successfully left group!");
      setDisplayPartial("default");
    }else{
      authenticationFailure(response.data);
    }
  }).catch(function(error){
    console.log(error); //TODO
  });
}

function loadGroupInvites($scope, $http){
  console.log("Fetch group invites");
  $http({
    method: 'GET',
    url: serverURL + "/groups/invite",
    headers: {'Authorization': sessionStorage.getItem("token")}
  }).then(function(response){
    if(response.data.result == "success"){
      console.log("Successfully fetched invites");
      sessionStorage.setItem("token", response.data.token);
      $scope.invites = response.data.invites;
      console.log(response.data.invites);
      $scope.groupList = false;
      $scope.groupInvites = true;
    }else{
      authenticationFailure(response.data);
    }
  }).catch(function(error){
    console.log(error);
  });
}

function loadGroupList($scope, $http){
  console.log("Fetch list of groups for user " + sessionStorage.getItem("cid"));
  $http({
    method: 'GET',
    url: serverURL + "/user/groups",
    headers: {'Authorization': sessionStorage.getItem("token")}
  }).then(function(response){
    if(response.data.result == "success"){
      console.log("Successfully fetched list of groups");
      sessionStorage.setItem("token", response.data.token);
      $scope.groups = response.data.groups;
      console.log(response.data.groups);
      $scope.groupList = true;
      $scope.groupInvites = false;
    }else{
      authenticationFailure(response.data);
    }
  }).catch(function(error){
    console.log(error); //TODO
  });
}

function showProfile($scope, $http, cid){
  sessionStorage.setItem("desiredProfile", cid);
  setDisplayPartial("profile");
}
