
function loadQuiz($scope, $http){
    console.log("QUIZ QUIZ");
    $.getScript('scripts/constants.js', function() {

        $http({
        method: 'GET',
        url: serverURL + "/quiz/questions",
        params: {gencode: sessionStorage.getItem('genCode')},
        headers: {'Authorization': sessionStorage.getItem("token")}
        }).then(function(response) {
            if (response.data.result == "success") {
                console.log("Get /quiz/questions success");
                sessionStorage.setItem("token", response.data.token);
                $scope.myQuizQuestions = response.data.questions;
            } else {
                authenticationFailure(response.data);
            }
        });

    });

}

function submitQuizAnswers($scope, $http){
  console.log('submit answers');
  //Takes all values from input field with class quizAnswer and puts them in an array
  var userAnswers = $('.quizAnswer').map( function(){return $(this).val(); }).get();

  var totalScore = 0;
  for(i=0; i < $scope.myQuizQuestions.length; i++){
    console.log('Input: ' + userAnswers[i]);
    totalScore+= (userAnswers[i]*$scope.myQuizQuestions[i].weight)
  }

//Multiplie the score by ten because the sum of questionScores * questionWeight can be maximun 10 and score in databases is from 0-100
  totalScore*=10;
  console.log('Din poäng är: ' + totalScore);

  //Här ska vi köra en post men oklart om det fungerar just nu
  console.log('Gencode i sessionstorage är : '+sessionStorage.getItem("genCode"));
  $.getScript('scripts/constants.js', function() {
    $http({
      method: 'POST',
      url: serverURL + "/quiz/score",
      data: {gencode: 'abcdf', cid: sessionStorage.getItem("cid"),score: totalScore},
      headers: {'Authorization': sessionStorage.getItem("token")}
    }).then(function(response) {
      console.log(response);
      if(response.data.result == "success") {
        console.log('Post Success')
        sessionStorage.setItem("token", response.data.token);
      } else {
        console.log('Auth Fail');
        //authenticationFailure(response.data);
      }
    });
  })

}
/*
data: {student: sessionStorage.getItem("cid"),
       course: sessionStorage.getItem("genCode")},
*/
