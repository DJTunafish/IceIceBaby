
function loadQuiz($scope, $http){
    console.log("QUIZ QUIZ");
    $.getScript('scripts/constants.js', function() {

        $http({
        method: 'GET',
        url: serverURL + "/quiz/questions",
        params: {gencode: 'abcdf'},
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
    //console.log('Input: ' + userAnswers[i]);
    //console.log('Correct Answer: '+ $scope.myQuizQuestions[i].answer);

    if(userAnswers[i]===$scope.myQuizQuestions[i].answer){
      //console.log('CORRECT ANSWER!');
      totalScore += $scope.myQuizQuestions[i].weight;
    }
  }
  console.log('Din poäng är: ' + totalScore*100);
  //Här ska vi köra en post men oklart om det fungerar just nu

}
