//DOM SELECTORS
const question = document.getElementById("question");
const answers = Array.from(document.getElementsByClassName('answer-text'));
const scoreTotal = document.getElementById("scoreTotal");
const questionNo = document.getElementById("questionNo");
const feedback = document.getElementById("feedback");


//CONSTANT VARIABLES
const BONUS = 10;
const QUESTION_LIMIT = 3;

//VARIABLES     `   
var curQuestion = {};
var questionCounter = 0;
var acceptingAnswers = false;
var score = 0;
var availableQuestions=[];
var questions = [];

//LOADING QUESTIONS FROM FETCHED API
fetch(
    "https://opentdb.com/api.php?amount=10&type=multiple"
)
.then(res=>{
    return res.json();
})
.then(loadedQuestions=>{
    console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map(loadedQuestion=>{
       
        const formattedQuestion = {
            question: loadedQuestion.question
        };

        const answerOption = [... loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random()*3)+1;
        answerOption.splice(
            formattedQuestion.answer-1,
            0,
            loadedQuestion.correct_answer
        );

        answerOption.forEach((choice,index)=>{
            formattedQuestion["choice"+(index+1)] = choice;
        });
        return formattedQuestion;
    });
    startApp();
})
.catch(err=>{
    console.log(err);
});

answers.forEach(choice=>{
    choice.addEventListener("click", listener =>{
        if(!acceptingAnswers) return;
            // Creating a promise so that a getQuestion() gets executed only
            // once the selectedChoice is defined.
            const promise = new Promise((resolve,reject)=>{
                acceptingAnswers= false;
                var selectedChoice = listener.target;
                var selectedAnswer = selectedChoice.dataset["option"];
                
                setTimeout(()=>resolve(selectedChoice),200);
                
            })
            promise.then((selectedChoice)=>{

                console.log(selectedChoice.dataset["option"], curQuestion.answer);
               
                
               
                if(selectedChoice.dataset["option"]==curQuestion.answer){
                  
                    score += BONUS;
                    scoreTotal.innerHTML = score;
                    feedback.innerHTML = "Correct";
                    feedback.style.display = "flex";
                }else{
                    feedback.innerHTML = "Wrong";
                    feedback.style.display = "flex";
                }
                
                console.log(selectedChoice);
               
                
                setTimeout(()=>{
                        
                        getQuestion();
                        feedback.style.display = "none";
                },2000);           
            })           
    });
});

//FUNCTIONS
startApp = () => {

    //Reseting values for the new game
    questionCounter = 0;
    score= 0;
    availableQuestions = [... questions];
   
   
    getQuestion();

};

getQuestion = () => {
 if(availableQuestions.length===0||questionCounter>=QUESTION_LIMIT){
    localStorage.setItem("latestScore", score);
    return window.location.assign("/views/end.html");
 }
questionCounter++;
questionNo.innerHTML = questionCounter;
const questionIndex = Math.floor(Math.random()*availableQuestions.length);
curQuestion = availableQuestions[questionIndex];
question.innerHTML = curQuestion.question;

answers.forEach( choice =>{
    const number = choice.dataset["option"];
    choice.innerHTML = curQuestion["choice"+number];
})


    availableQuestions.splice(questionIndex,1);
    acceptingAnswers = true;
   

    
};

incrementScore = (number) => {
    score+= number;
}